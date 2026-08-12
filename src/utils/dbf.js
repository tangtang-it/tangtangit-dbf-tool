/* ============================================================
   dbf.js — 纯浏览器端 DBF 解析与写入（dBASE III，C/N/D/L）
   由原有 web/dbf.js 重构为 ES Module，供 Vue 组件直接 import。

   编码方案：
   - 解码：new TextDecoder('gbk')（浏览器原生支持）
   - 编码：枚举全部 GBK 码位，用 TextDecoder 解码反推 Unicode→GBK 映射表
   ============================================================ */

const DBF_FIELD_NAME_MAX = 10;   // dBASE III 字段名最长字节
const DBF_RECORD_MAX = 65535;
const DBF_FIELD_MAX_COUNT = 255;
const DEFAULT_ENCODING = 'gbk';

// 常见 language driver id -> 编码名
const LANG_DRIVER = {
  0x01: 'cp437', 0x02: 'cp437', 0x03: 'cp1252', 0x04: 'cp1252',
  0x57: 'gbk', 0x64: 'gbk', 0x65: 'gbk', 0x66: 'gbk', 0x6A: 'gbk',
  0x55: 'gbk', 0x56: 'gbk',
  0x58: 'big5',
  0xC8: 'cp1252', 0xCB: 'cp1252', 0xE5: 'cp1251', 0x71: 'cp1251',
  0x78: 'shift_jis'
};

export function DbfError(message) {
  this.message = message || 'DBF 错误';
}
DbfError.prototype = Object.create(Error.prototype);
DbfError.prototype.name = 'DbfError';

/* ---------- 编码工具 ---------- */
let gbkTable = null;   // char -> 字节数组

function buildGbkTable() {
  if (gbkTable) return;
  const map = {};
  let d;
  try { d = new TextDecoder('gbk'); }
  catch (e) { d = null; }
  // 单字节 ASCII 区域
  for (let i = 0x20; i <= 0x7E; i++) {
    map[String.fromCharCode(i)] = [i];
  }
  if (d) {
    for (let hi = 0x81; hi <= 0xFE; hi++) {
      for (let lo = 0x40; lo <= 0xFE; lo++) {
        if (lo === 0x7F) continue;
        const s = d.decode(new Uint8Array([hi, lo]));
        if (s && s !== '\ufffd' && !map[s]) map[s] = [hi, lo];
      }
    }
  }
  gbkTable = map;
}

// 用给定编码解码字节数组（Uint8Array）为字符串
function decodeBytes(bytes, encoding) {
  const enc = normalizeEnc(encoding);
  if (enc === 'utf-8' || enc === 'utf8') {
    return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  }
  if (enc === 'gbk' || enc === 'cp936' || enc === 'gb2312') {
    try { return new TextDecoder('gbk', { fatal: false }).decode(bytes); }
    catch (e) { return latin1(bytes); }
  }
  if (enc === 'big5' || enc === 'cp950') {
    try { return new TextDecoder('big5', { fatal: false }).decode(bytes); }
    catch (e) { return latin1(bytes); }
  }
  if (enc === 'shift_jis' || enc === 'cp932') {
    try { return new TextDecoder('shift_jis', { fatal: false }).decode(bytes); }
    catch (e) { return latin1(bytes); }
  }
  // cp437 / cp1252 等拉丁编码
  return latin1(bytes);
}

function latin1(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return s;
}

function normalizeEnc(enc) {
  return String(enc || DEFAULT_ENCODING).toLowerCase();
}

// 编码字符串为字节（Uint8Array），支持 gbk / utf-8 / latin1
function encodeString(str, encoding) {
  const enc = normalizeEnc(encoding);
  if (enc === 'utf-8' || enc === 'utf8') {
    return new TextEncoder().encode(str);
  }
  if (enc === 'gbk' || enc === 'cp936' || enc === 'gb2312') {
    buildGbkTable();
    const out = [];
    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      const b = gbkTable[c];
      if (b) { out.push.apply(out, b); }
      else { out.push(0x3F); } // ?
    }
    return new Uint8Array(out);
  }
  // latin1 / 其它：按字符码
  const bytes = new Uint8Array(str.length);
  for (let j = 0; j < str.length; j++) bytes[j] = str.charCodeAt(j) & 0xFF;
  return bytes;
}

function encodeStringBytes(str, encoding) {
  return Array.from(encodeString(str, encoding));
}

// 按字节截断，且不切出半个多字节字符
function safeTruncate(bytes, length) {
  if (bytes.length <= length) return bytes;
  let cut = bytes.slice(0, length);
  // 检查最后一个字节是否是半个 GBK 汉字（GBK 双字节高位 >=0x81）
  if (cut.length > 0 && cut[cut.length - 1] >= 0x81) cut = cut.slice(0, -1);
  return cut;
}

/* ---------- 编码检测（读 DBF 头） ---------- */
function detectDbfEncoding(bytes) {
  if (bytes.length < 30) return DEFAULT_ENCODING;
  const lang = bytes[29];
  const enc = LANG_DRIVER[lang];
  return enc || DEFAULT_ENCODING;
}

/* ---------- DBF 读取 ---------- */
// 解析 DBF 头部，返回 { fields, recordLen, headerLen, recordCount, encoding }
function parseDbfHeader(bytes, encoding) {
  if (bytes.length < 32) throw new DbfError('文件过小，不是有效的 DBF');
  const version = bytes[0];
  const recordCount = bytes[4] | (bytes[5] << 8) | (bytes[6] << 16) | (bytes[7] << 24);
  const headerLen = bytes[8] | (bytes[9] << 8);
  const recordLen = bytes[10] | (bytes[11] << 8);
  // language driver at byte 29
  const langEnc = detectDbfEncoding(bytes);
  encoding = encoding && encoding !== 'auto' ? encoding : langEnc;

  // 解析字段描述（headerLen - 1 个字节用于 0x0D 结束符）
  const fields = [];
  let pos = 32;
  const fieldDescLen = 32;
  const end = headerLen - 1; // 最后一个是 0x0D
  while (pos + fieldDescLen <= end) {
    const nameBytes = bytes.subarray(pos, pos + 11);
    let nameEnd = 0;
    for (let i = 0; i < 11; i++) { if (nameBytes[i] === 0) { nameEnd = i; break; } }
    const name = latin1(nameBytes.subarray(0, nameEnd));
    const ftype = String.fromCharCode(bytes[pos + 11]);
    const length = bytes[pos + 16];
    const decimals = bytes[pos + 17];
    fields.push({ name, type: ftype, length, decimals });
    pos += 32;
  }
  if (fields.length === 0) throw new DbfError('DBF 中没有字段定义');
  return { version, fields, recordLen, headerLen, recordCount, encoding };
}

// 解析单条记录，返回 { deleted, values }，values 按字段解码
function parseRecord(bytes, start, fields, encoding, rowOut) {
  const deleted = bytes[start] === 0x2A; // '*' 删除标记
  const values = [];
  let p = start + 1;
  for (let i = 0; i < fields.length; i++) {
    const f = fields[i];
    const raw = bytes.subarray(p, p + f.length);
    p += f.length;
    values.push(decodeFieldValue(f, raw, encoding));
  }
  rowOut.deleted = deleted;
  rowOut.values = values;
}

function decodeFieldValue(f, raw, encoding) {
  if (f.type === 'C') {
    // 字符：trim 右侧空格
    const s = decodeBytes(raw, encoding);
    return s.replace(/\x00+$/, '').replace(/[ \t\r\n]+$/, '');
  }
  if (f.type === 'N' || f.type === 'F') {
    const t = latin1(raw).trim();
    if (t === '') return null;
    const n = Number(t);
    return isNaN(n) ? t : n;
  }
  if (f.type === 'D') {
    const ds = latin1(raw).trim();
    if (!ds) return null;
    // YYYYMMDD -> 保持字符串，SheetJS 可识别为日期
    if (/^\d{8}$/.test(ds)) {
      const y = ds.slice(0, 4), m = ds.slice(4, 6), dd = ds.slice(6, 8);
      return y + '-' + m + '-' + dd;
    }
    return ds;
  }
  if (f.type === 'L') {
    const ls = latin1(raw).trim().toUpperCase();
    if (ls === 'T' || ls === 'Y' || ls === '1' || ls === 'TRUE') return true;
    if (ls === 'F' || ls === 'N' || ls === '0' || ls === 'FALSE') return false;
    return null;
  }
  // I / T / M 等其它类型
  if (f.type === 'I') {
    const iv = bytesToInt(raw);
    return iv === null ? null : iv;
  }
  if (f.type === 'T') {
    return latin1(raw).trim() || null;
  }
  return decodeBytes(raw, encoding).trim() || null;
}

function bytesToInt(raw) {
  if (raw.length < 4) return null;
  const v = (raw[0]) | (raw[1] << 8) | (raw[2] << 16) | (raw[3] << 24);
  return v;
}

// 读取完整 DBF（Uint8Array），返回 { headers, rows, encoding, warnings }
function readDbf(bytes, options) {
  options = options || {};
  const hdr = parseDbfHeader(bytes, options.encoding);
  const enc = hdr.encoding;

  // 过滤 VFP 内部字段（type '0' 或 _NullFlags）
  const realFields = [];
  for (let i = 0; i < hdr.fields.length; i++) {
    const f = hdr.fields[i];
    if (f.type === '0') continue;
    if (f.name.toLowerCase().indexOf('_nullflags') === 0) continue;
    realFields.push(f);
  }
  if (realFields.length === 0) {
    throw new DbfError('DBF 中没有业务字段（全部是 VFP 内部字段）');
  }

  const headers = [];
  for (let h = 0; h < realFields.length; h++) headers.push(realFields[h].name);

  const rows = [];
  const recordStart = hdr.headerLen;
  const recordLen = Math.max(hdr.recordLen, 1 + realFields.reduce((a, f) => a + f.length, 0));
  const maxRecords = Math.min(hdr.recordCount, Math.floor((bytes.length - hdr.headerLen) / (recordLen || 1)));
  const rec = { deleted: false, values: [] };
  for (let r = 0; r < maxRecords; r++) {
    const start = recordStart + r * recordLen;
    if (start + recordLen > bytes.length) break;
    parseRecord(bytes, start, realFields, enc, rec);
    if (!rec.deleted) rows.push(rec.values.slice());
  }
  return { headers, rows, encoding: enc };
}

/* ---------- DBF 写入 ---------- */
class DbfWriter {
  constructor(fields, encoding) {
    this.encoding = encoding || DEFAULT_ENCODING;
    this.fields = [];
    for (let i = 0; i < fields.length; i++) {
      const f = fields[i];
      const ftype = String(f[1] || 'C').toUpperCase();
      const length = parseInt(f[2], 10) || 1;
      const decimals = parseInt(f[3], 10) || 0;
      if (ftype !== 'C' && ftype !== 'N' && ftype !== 'D' && ftype !== 'L') {
        throw new DbfError('不支持的字段类型 ' + ftype);
      }
      if (length < 1 || length > 254) throw new DbfError('字段长度超出范围 1-254');
      this.fields.push([f[0], ftype, length, decimals]);
    }
    if (this.fields.length === 0) throw new DbfError('至少需要一个字段');
    if (this.fields.length > DBF_FIELD_MAX_COUNT) throw new DbfError('字段数超过上限');
    this.recordLen = 1 + this.fields.reduce((a, f) => a + f[2], 0);
    if (this.recordLen > DBF_RECORD_MAX) throw new DbfError('记录长度超过上限');
    this.headerLen = 32 + 32 * this.fields.length + 1;
    this.records = [];
  }

  write(record) {
    let values;
    if (Array.isArray(record)) values = record.slice();
    else {
      values = [];
      for (let i = 0; i < this.fields.length; i++) {
        values.push(record[this.fields[i][0]]);
      }
    }
    while (values.length < this.fields.length) values.push(null);
    let buf = [0x20]; // 删除标记：正常
    for (let j = 0; j < this.fields.length; j++) {
      buf = buf.concat(encodeFieldValue(this.fields[j], values[j], this.encoding));
    }
    this.records.push(new Uint8Array(buf));
  }

  toUint8Array() {
    const now = new Date();
    const numRecords = this.records.length;
    const header = [];
    header.push(0x03); // dBASE III
    header.push(now.getFullYear() % 100, now.getMonth() + 1, now.getDate());
    header.push(numRecords & 0xFF, (numRecords >> 8) & 0xFF, (numRecords >> 16) & 0xFF, (numRecords >> 24) & 0xFF);
    header.push(this.headerLen & 0xFF, (this.headerLen >> 8) & 0xFF);
    header.push(this.recordLen & 0xFF, (this.recordLen >> 8) & 0xFF);
    for (let i = 0; i < 17; i++) header.push(0);
    header.push(0x57); // language driver: cp936
    header.push(0, 0);

    for (let fi = 0; fi < this.fields.length; fi++) {
      const f = this.fields[fi];
      const nameBytes = encodeStringBytes(f[0], 'latin1'); // 字段名限 ASCII
      for (let n = 0; n < 11; n++) header.push(n < nameBytes.length ? nameBytes[n] : 0);
      header.push(f[1].charCodeAt(0)); // type
      header.push(0, 0, 0, 0); // reserved
      header.push(f[2]); // length
      header.push(f[3]); // decimals
      for (let r = 0; r < 14; r++) header.push(0);
    }
    header.push(0x0D); // 字段终止符

    const total = header.length + this.records.reduce((a, rec) => a + rec.length, 0) + 1;
    const out = new Uint8Array(total);
    out.set(header, 0);
    let pos = header.length;
    for (let ri = 0; ri < this.records.length; ri++) {
      out.set(this.records[ri], pos);
      pos += this.records[ri].length;
    }
    out[pos] = 0x1A; // 文件结束符
    return out;
  }
}

function encodeFieldValue(f, value, encoding) {
  const ftype = f[1], length = f[2], decimals = f[3];
  if (value === null || value === undefined) {
    if (ftype === 'L') return [0x3F]; // ?
    if (ftype === 'D') return [0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20];
    return new Array(length).fill(0x20);
  }
  if (ftype === 'C') {
    let rawC = encodeStringBytes(String(value), encoding);
    rawC = safeTruncate(rawC, length);
    const arrC = new Array(length).fill(0x20);
    for (let i = 0; i < rawC.length && i < length; i++) arrC[i] = rawC[i];
    return arrC;
  }
  if (ftype === 'N') {
    let s;
    if (typeof value === 'boolean') value = value ? 1 : 0;
    if (typeof value === 'number') {
      if (decimals > 0) s = value.toFixed(decimals);
      else s = String(Math.round(value));
    } else {
      s = String(value);
    }
    const rawN = encodeStringBytes(s, 'latin1');
    const arrN = new Array(length).fill(0x20);
    let start = length - rawN.length;
    if (start < 0) start = 0;
    for (let j = 0; j < rawN.length && start + j < length; j++) arrN[start + j] = rawN[j];
    return arrN;
  }
  if (ftype === 'D') {
    let ds = String(value).trim();
    ds = ds.replace(/[-/.]/g, '');
    ds = ds.replace(/\D/g, '').slice(0, 8);
    if (ds.length < 8) ds = ds + new Array(8 - ds.length + 1).join(' ');
    const arrD = new Array(8).fill(0x20);
    for (let k = 0; k < 8; k++) arrD[k] = k < ds.length ? ds.charCodeAt(k) : 0x20;
    return arrD;
  }
  if (ftype === 'L') {
    const ls = String(value).trim().toUpperCase();
    if (ls === 'T' || ls === 'Y' || ls === '1' || ls === 'TRUE' || value === true) return [0x54]; // T
    return [0x46]; // F
  }
  return new Array(length).fill(0x20);
}

/* ---------- 字段名清洗（XLSX → DBF） ---------- */
function cleanFieldName(name, index, used) {
  let raw = String(name == null ? '' : name).trim();
  if (!raw) raw = 'F' + index;
  let cleaned = raw.replace(/[^0-9A-Za-z_\u4e00-\u9fff]/g, '_').replace(/_+/g, '_');
  if (/^\d/.test(cleaned)) cleaned = '_' + cleaned;
  // 按目标编码字节截断到 10 字节（GBK 下中文字符占 2 字节）
  const bytes = encodeStringBytes(cleaned, DEFAULT_ENCODING);
  if (bytes.length > DBF_FIELD_NAME_MAX) {
    let cut = bytes.slice(0, DBF_FIELD_NAME_MAX);
    if (cut.length > 0 && cut[cut.length - 1] >= 0x81) cut = cut.slice(0, -1);
    cleaned = decodeBytes(new Uint8Array(cut), DEFAULT_ENCODING).replace(/[\ufffd_]+$/, '');
  }
  if (used[cleaned]) {
    let i = 2;
    const base = cleaned.slice(0, DBF_FIELD_NAME_MAX - 2);
    while (true) {
      const cand = (base + '_' + i).slice(0, DBF_FIELD_NAME_MAX);
      if (!used[cand]) { cleaned = cand; break; }
      i++;
    }
  }
  used[cleaned] = true;
  return cleaned || 'F' + index;
}

export const Dbf = {
  read: readDbf,
  parseHeader: parseDbfHeader,
  detectEncoding: detectDbfEncoding,
  DbfWriter,
  DbfError,
  encodeString,
  decodeBytes,
  encodeStringBytes,
  cleanFieldName,
  buildGbkTable,
};

export default Dbf;
