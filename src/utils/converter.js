/* ============================================================
   converter.js — 浏览器端 DBF ⇄ XLSX 转换流程（ES Module）
   依赖：dbf.js（DBF 解析/写入）、SheetJS xlsx（XLSX 读写）
   由原有 web/converter.js 重构为 ES Module。
   ============================================================ */
import * as XLSX from 'xlsx';
import { Dbf } from './dbf.js';

const XLSX_MAX_ROWS = 1048576;

/* ---------- DBF → XLSX ---------- */
// 返回 { rows, encoding, headers }
function convertDbf2Xlsx(dbfBytes, options) {
  options = options || {};
  const enc = options.encoding === 'auto' || !options.encoding ? undefined : options.encoding;
  const data = Dbf.read(dbfBytes, { encoding: enc });
  const headers = data.headers;
  const rows = data.rows;

  const aoa = [headers].concat(rows);
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  // 设置列宽（可选）
  const widths = headers.map((h, i) => {
    let maxLen = h.length;
    for (let r = 0; r < Math.min(rows.length, 200); r++) {
      const v = rows[r][i];
      if (v != null) maxLen = Math.max(maxLen, String(v).length);
    }
    return { wch: Math.max(8, Math.min(maxLen * 1.2, 40)) };
  });
  ws['!cols'] = widths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  let out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  // XLSX.write type:'array' 返回 ArrayBuffer，统一为 Uint8Array
  if (out instanceof ArrayBuffer) out = new Uint8Array(out);
  return { data: out, rows: rows.length, encoding: data.encoding, headers };
}

/* ---------- XLSX → DBF ---------- */
function inferColumnType(types, stats) {
  let hasDate = false, hasBool = false, hasNum = false;
  for (let i = 0; i < types.length; i++) {
    const t = types[i];
    if (t === 'date' || t === 'datetime') hasDate = true;
    else if (t === 'bool') hasBool = true;
    else if (t === 'int' || t === 'float') hasNum = true;
  }
  const hasOther = types.some((t) => {
    return t !== 'date' && t !== 'datetime' && t !== 'bool' && t !== 'int' && t !== 'float' && t !== 'none';
  });
  // 全部日期/空
  if (!hasBool && !hasNum && !hasOther && hasDate) return ['D', 8, 0];
  // 全部布尔/空
  if (!hasDate && !hasNum && !hasOther && hasBool) return ['L', 1, 0];
  // 全部数字/空
  if (!hasDate && !hasBool && !hasOther && hasNum) {
    const maxInt = stats.max_int_digits || 1;
    const decimals = stats.max_decimals || 0;
    const neg = stats.has_negative ? 1 : 0;
    let len = Math.max(maxInt + decimals + neg, 1);
    if (len > 20) len = 20;
    return ['N', len, Math.min(decimals, len - 1)];
  }
  return ['C', Math.max(1, Math.min(stats.max_str_len || 1, 254)), 0];
}

// 两遍扫描 xlsx：第一遍推断类型，第二遍产出数据
function convertXlsx2Dbf(xlsxBytes, options) {
  options = options || {};
  const writeEnc = options.encoding && options.encoding !== 'auto' ? options.encoding : 'gbk';
  const wb = XLSX.read(xlsxBytes, { type: 'array', cellDates: true });
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: null });

  if (!aoa || aoa.length === 0) throw new Error('工作表中没有数据（至少需要一行表头）');
  const headers = aoa[0].map((h) => h == null ? '' : String(h));
  const body = aoa.slice(1);
  const nCols = headers.length;

  // 第一遍：推断每列类型
  const colStats = [];
  for (let c = 0; c < nCols; c++) {
    colStats.push({ types: [], max_str_len: 0, max_int_digits: 0, max_decimals: 0, has_negative: false });
  }
  for (let r = 0; r < body.length; r++) {
    const row = body[r];
    for (let c2 = 0; c2 < nCols; c2++) {
      const v = row[c2];
      const st = colStats[c2];
      if (v === null || v === undefined) { st.types.push('none'); continue; }
      if (typeof v === 'boolean') {
        st.types.push('bool');
      } else if (typeof v === 'number') {
        if (Number.isInteger(v)) {
          st.types.push('int');
          if (v < 0) st.has_negative = true;
          st.max_int_digits = Math.max(st.max_int_digits, String(Math.abs(v)).length);
        } else {
          st.types.push('float');
          if (v < 0) st.has_negative = true;
          st.max_int_digits = Math.max(st.max_int_digits, String(Math.abs(Math.trunc(v))).length);
          const s = String(v);
          let decLen = 0;
          if (s.indexOf('.') >= 0) decLen = s.split('.')[1].length;
          else if (/e/i.test(s)) decLen = 4;
          st.max_decimals = Math.max(st.max_decimals, decLen);
        }
      } else if (v instanceof Date) {
        // SheetJS cellDates 为 true 时给出 Date 对象；判断是否含时间部分
        st.types.push('datetime');
      } else {
        const str = String(v);
        st.types.push('str');
        const bLen = Dbf.encodeStringBytes(str, writeEnc).length;
        st.max_str_len = Math.max(st.max_str_len, bLen);
      }
    }
  }

  // 清洗字段名 + 推断类型
  const used = {};
  const fields = [];
  const warnings = [];
  for (let h = 0; h < nCols; h++) {
    const name = Dbf.cleanFieldName(headers[h], h + 1, used);
    if (name !== headers[h].trim()) warnings.push('字段名 "' + headers[h] + '" -> "' + name + '"');
    const ft = inferColumnType(colStats[h].types, colStats[h]);
    fields.push([name, ft[0], ft[1], ft[2]]);
  }

  if (body.length >= XLSX_MAX_ROWS) {
    throw new Error('数据行数达到 Excel 上限 ' + (XLSX_MAX_ROWS - 1) + '，请拆分后再转换');
  }

  // 第二遍：写 DBF
  const dw = new Dbf.DbfWriter(fields, writeEnc);
  for (let r2 = 0; r2 < body.length; r2++) {
    const row2 = body[r2];
    const values = [];
    for (let c3 = 0; c3 < nCols; c3++) {
      let val = row2[c3];
      if (val instanceof Date && fields[c3][1] === 'D') {
        val = fmtDate(val);
      } else if (val instanceof Date && fields[c3][1] === 'N') {
        val = val.getTime(); // 不常见，保留
      }
      values.push(val);
    }
    dw.write(values);
  }
  const out = dw.toUint8Array();
  return { data: out, rows: body.length, fields, warnings };
}

function fmtDate(d) {
  const y = d.getFullYear(), m = d.getMonth() + 1, dd = d.getDate();
  const pad = (n) => n < 10 ? '0' + n : '' + n;
  return '' + y + pad(m) + pad(dd);
}

export const Converter = {
  dbf2xlsx: convertDbf2Xlsx,
  xlsx2dbf: convertXlsx2Dbf,
};

export default Converter;
