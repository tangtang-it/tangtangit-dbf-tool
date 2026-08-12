<script setup>
import { ref, computed, onBeforeUnmount } from 'vue';
import JSZip from 'jszip';
import { Converter } from '@/utils/converter.js';
import { triggerDownload, readFileAsUint8 } from '@/utils/download.js';

/* ---------- 状态 ---------- */
const files = ref([]);        // 待转换 File 列表
const results = ref([]);      // 转换结果
const direction = ref('auto');
const encoding = ref('auto');
const busy = ref(false);
const status = ref('');
const dragover = ref(false);
const procStep = ref('正在读取文件');
const procMeta = ref('请稍候，文件将全程在本机处理');
const showProcessing = ref(false);
const resultsHidden = ref(false);
const zipVisible = ref(false);

const fileInput = ref(null);
let procTimer = null;

const procPhases = [
  '正在读取文件结构',
  '正在推断字段类型',
  '正在转换数据',
  '正在写入文件',
  '正在完成收尾',
];

/* ---------- 工具函数 ---------- */
function fmtSize(n) {
  if (n < 1024) return n + ' B';
  if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
  return (n / 1048576).toFixed(1) + ' MB';
}
function extOf(name) { return name.split('.').pop().toLowerCase(); }
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function baseName(name) { return name.replace(/\.[^.]+$/, ''); }

/* ---------- 文件队列 ---------- */
function addFiles(list) {
  let ignored = [];
  for (let i = 0; i < list.length; i++) {
    const f = list[i];
    const ext = extOf(f.name);
    if (ext !== 'dbf' && ext !== 'xlsx' && ext !== 'xlsm') { ignored.push(f.name); continue; }
    const dup = files.value.some((x) => x.name === f.name && x.size === f.size);
    if (!dup) files.value.push(f);
  }
  if (ignored.length) status.value = '已忽略不支持的文件: ' + ignored.join(', ');
}

function onDrop(e) {
  e.preventDefault();
  dragover.value = false;
  addFiles(e.dataTransfer.files);
}
function onFileChange(e) {
  addFiles(e.target.files);
  e.target.value = '';
}
function openFileDialog() { fileInput.value && fileInput.value.click(); }
function removeFile(i) { files.value.splice(i, 1); }
function clearAll() { files.value = []; }

const canStart = computed(() => files.value.length > 0);

/* ---------- 转换 ---------- */
function setBusy(b) {
  busy.value = b;
  showProcessing.value = b;
  if (b) {
    resultsHidden.value = true;
    procMeta.value = '正在处理 ' + files.value.length + ' 个文件，请稍候';
    procStep.value = procPhases[0];
    let idx = 0;
    clearInterval(procTimer);
    procTimer = setInterval(() => {
      idx = (idx + 1) % procPhases.length;
      procStep.value = procPhases[idx];
    }, 900);
  } else {
    clearInterval(procTimer);
    procTimer = null;
    resultsHidden.value = false;
  }
}

function convertOne(file, dir, enc) {
  const ext = extOf(file.name);
  let mode = dir;
  if (mode === 'auto') mode = ext === 'dbf' ? 'dbf2xlsx' : 'xlsx2dbf';

  return readFileAsUint8(file).then((bytes) => {
    let outExt, data, extra;
    if (mode === 'dbf2xlsx') {
      const r1 = Converter.dbf2xlsx(bytes, { encoding: enc });
      outExt = 'xlsx';
      data = r1.data;
      extra = { rows: r1.rows, src_enc: r1.encoding };
    } else {
      const writeEnc = (enc && enc !== 'auto') ? enc : 'gbk';
      const r2 = Converter.xlsx2dbf(bytes, { encoding: writeEnc });
      outExt = 'dbf';
      data = r2.data;
      extra = { rows: r2.rows, fields: r2.fields, warnings: r2.warnings };
    }
    return {
      name: file.name,
      ok: true,
      out_name: baseName(file.name) + '.' + outExt,
      out_ext: outExt,
      data,
      mime: outExt === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/x-dbf',
      rows: extra.rows,
      fields: extra.fields ? extra.fields.length : undefined,
      src_enc: extra.src_enc,
      warnings: extra.warnings || [],
      dl_name: '',
    };
  });
}

function startConvert() {
  if (files.value.length === 0) return;
  setBusy(true);
  zipVisible.value = false;
  results.value = [];
  status.value = '正在转换 ' + files.value.length + ' 个文件…';

  const dir = direction.value;
  const enc = encoding.value;

  const promises = files.value.map((f) => {
    return convertOne(f, dir, enc).catch((err) => {
      return { name: f.name, ok: false, error: (err && err.message) || String(err) };
    });
  });

  Promise.all(promises).then((res) => {
    setBusy(false);
    results.value = res;
    status.value = '完成';
    const okCount = res.filter((r) => r.ok).length;
    if (okCount === res.length) status.value = '全部转换成功，共 ' + okCount + ' 个文件';
    else if (okCount > 0) status.value = okCount + '/' + res.length + ' 个文件转换成功';
    else status.value = '转换失败，请检查文件';
    zipVisible.value = okCount > 0;
  }).catch((err) => {
    setBusy(false);
    status.value = '转换失败: ' + err.message;
  });
}

/* ---------- 下载 ---------- */
function effectiveName(r) {
  return (r.dl_name || '').trim() || r.out_name;
}
function downloadResult(r) {
  if (!r || !r.ok) return;
  triggerDownload(r.data, r.mime, effectiveName(r));
}

/* ---------- 打包 ZIP ---------- */
function collectResults() {
  const out = [];
  results.value.forEach((r) => {
    if (!r || !r.ok) return;
    const name = effectiveName(r);
    out.push({ name, data: r.data, mime: r.mime });
  });
  return out;
}

async function zipAll() {
  const items = collectResults();
  if (items.length === 0) return;
  status.value = '正在打包 ZIP…';
  const zip = new JSZip();
  const used = {};
  items.forEach((item) => {
    let filename = item.name;
    let n = 1, final = filename;
    const stem = filename.replace(/\.[^.]+$/, ''), ext = filename.slice(stem.length);
    while (used[final]) { n++; final = stem + '_' + n + ext; }
    used[final] = true;
    zip.file(final, item.data);
  });
  try {
    const blob = await zip.generateAsync({ type: 'blob' });
    triggerDownload(blob, 'application/zip', 'converted_files.zip');
    status.value = '打包完成';
  } catch (err) {
    status.value = '打包失败: ' + err.message;
  }
}

onBeforeUnmount(() => { clearInterval(procTimer); });
</script>

<template>
  <div id="tool-app" class="tool-panel tool-split">
    <div class="tool-col tool-col-upload">
      <div class="tool-col-head">
        <span class="tool-step">1</span>
        <h3>上传文件</h3>
        <p>拖拽或选择 .dbf / .xlsx，支持批量</p>
      </div>

      <div
        id="drop"
        class="drop"
        :class="{ dragover }"
        @dragover.prevent="dragover = true"
        @dragleave="dragover = false"
        @drop="onDrop"
        @click="openFileDialog"
      >
        <div class="drop-icon">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M12 3l-4 4M12 3l4 4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>
        </div>
        <p>拖拽 <b>.dbf</b> / <b>.xlsx</b> 文件到此处</p>
        <p class="sub">或 <span class="link">点击选择文件</span>，可多选，单次上限 300MB</p>
        <input
          ref="fileInput"
          type="file"
          multiple
          hidden
          accept=".dbf,.xlsx,.xlsm"
          @change="onFileChange"
        >
      </div>

      <div class="options">
        <div class="opt-group">
          <span class="opt-label">方向</span>
          <div class="seg">
            <label><input type="radio" value="auto" v-model="direction"><span>自动识别</span></label>
            <label><input type="radio" value="dbf2xlsx" v-model="direction"><span>DBF → XLSX</span></label>
            <label><input type="radio" value="xlsx2dbf" v-model="direction"><span>XLSX → DBF</span></label>
          </div>
        </div>
        <div class="opt-group">
          <span class="opt-label">编码</span>
          <select v-model="encoding">
            <option value="auto">自动检测(读) / GBK(写)</option>
            <option value="gbk">GBK (简体中文)</option>
            <option value="utf-8">UTF-8</option>
          </select>
        </div>
      </div>

      <div class="queue-head">
        <span style="font-size:14px;font-weight:600">文件队列</span>
        <span class="count">{{ files.length }}</span>
        <button class="queue-clear" @click="clearAll">清空</button>
      </div>
      <div id="filelist">
        <div v-if="files.length === 0" class="q-empty">尚未添加文件</div>
        <div v-else class="q-item" v-for="(f, i) in files" :key="i">
          <span class="ext" :class="extOf(f.name) === 'dbf' ? 'dbf' : 'xlsx'">{{ extOf(f.name).toUpperCase() }}</span>
          <div class="q-info">
            <div class="q-name">{{ f.name }}</div>
            <div class="q-meta">{{ fmtSize(f.size) }}</div>
          </div>
          <button class="q-rm" title="移除" @click="removeFile(i)">×</button>
        </div>
      </div>

      <div class="actions">
        <button id="go" class="btn btn-primary" :disabled="busy || !canStart" @click="startConvert">
          <span class="spinner" v-show="busy"></span>
          <span>{{ busy ? '转换中…' : '开始转换' }}</span>
        </button>
        <span id="status">{{ status }}</span>
      </div>
    </div>

    <div class="tool-col tool-col-result">
      <div class="tool-col-head">
        <span class="tool-step tool-step-result">2</span>
        <div class="tool-col-title">
          <div>
            <h3>转换结果</h3>
            <p>每个文件独立显示，可下载或打包</p>
          </div>
          <button id="zip" class="btn btn-utility btn-zip" v-show="zipVisible" @click="zipAll">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/></svg>
            打包下载全部
          </button>
        </div>
      </div>

      <div id="processing" class="processing" v-show="showProcessing">
        <div class="proc-visual" aria-hidden="true">
          <div class="proc-file">
            <span class="proc-file-tile">DBF</span>
            <svg class="proc-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M5 12l4-4M5 12l4 4"/></svg>
            <span class="proc-file-tile proc-file-tile-out">XLSX</span>
          </div>
          <div class="proc-track"><span class="proc-bar"></span></div>
        </div>
        <p class="proc-title">正在转换…</p>
        <p class="proc-step">{{ procStep }}</p>
        <div class="proc-meta">{{ procMeta }}</div>
      </div>

      <div id="results" v-show="!showProcessing">
        <div v-if="results.length === 0" class="empty">转换结果将在此处显示</div>
        <template v-for="(r, idx) in results" :key="idx">
          <div
            class="r-card"
            :class="r.ok ? 'ok ' + (r.out_ext === 'dbf' ? 'type-dbf' : 'type-xlsx') : 'fail'"
          >
            <div class="r-filetype">
              <span class="r-type-tile" :class="!r.ok ? 'r-type-fail' : ''">
                {{ r.ok ? r.out_ext.toUpperCase() : '!' }}
              </span>
              <div class="r-filebody">
                <div class="r-name" :title="r.name">{{ r.name }}</div>
                <div class="r-meta" :class="!r.ok ? 'r-meta-fail' : ''">
                  <template v-if="r.ok">
                    <span>共 <b>{{ r.rows }}</b> 行</span>
                    <span v-if="r.fields">· <b>{{ r.fields }}</b> 个字段</span>
                    <span v-if="r.src_enc">· 编码 {{ r.src_enc }}</span>
                  </template>
                  <template v-else>{{ r.error }}</template>
                </div>
              </div>
            </div>
            <div class="r-warn" v-if="r.ok && r.warnings && r.warnings.length">
              <span v-for="(w, wi) in r.warnings" :key="wi">{{ w }}<br v-if="wi < r.warnings.length - 1"></span>
            </div>
            <div class="r-dl-row" v-if="r.ok">
              <input
                class="r-dl-name"
                type="text"
                v-model="r.dl_name"
                :placeholder="r.out_name"
                maxlength="200"
                spellcheck="false"
                aria-label="下载文件名"
              >
              <button class="r-dl-btn" type="button" @click="downloadResult(r)">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M12 15l-4-4M12 15l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>
                <span>下载</span>
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
