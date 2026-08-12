<script setup>
import SiteNav from '@/components/SiteNav.vue';
import SiteFooter from '@/components/SiteFooter.vue';
</script>

<template>
  <SiteNav active="features" />

  <section class="page-hero">
    <div class="container">
      <div class="crumb"><a href="index.html">首页</a> / 功能特性</div>
      <h1>功能特性</h1>
      <p>专为中文财务 / ERP 环境设计的 DBF ⇄ XLSX 双向转换能力，从编码到类型、从单文件到批量全覆盖。</p>
    </div>
  </section>

  <section class="section" id="financial">
    <div class="container">
      <div class="sec-head"><h2>核心能力</h2><p>覆盖 DBF 与 Excel 转换的每一个关键环节。</p></div>
      <div class="grid-2">
        <div class="card elevated">
          <div class="card-icon teal">编</div>
          <h3>智能中文编码检测</h3>
          <p>读入时优先读取 DBF 头部的 language driver id（0x57=GBK），取不到默认 GBK；写出统一 GBK，可用选项切换 UTF-8，兼容国内老财务 / ERP 软件。</p>
        </div>
        <div class="card elevated">
          <div class="card-icon orange">批</div>
          <h3>批量与目录转换</h3>
          <p>命令行支持 batch 子命令，一键转换整个目录内所有匹配文件；Web 端支持多选上传、自动识别方向、打包 ZIP 下载。</p>
        </div>
        <div class="card elevated">
          <div class="card-icon purple">速</div>
          <h3>流式高速读写</h3>
          <p>全程流式读写，不把整个文件载入内存，内存占用稳定（与行数无关）。10 万行 × 4 字段转换约 4 秒。</p>
        </div>
        <div class="card elevated">
          <div class="card-icon sky">类</div>
          <h3>类型智能推断</h3>
          <p>XLSX→DBF 时两遍扫描自动推断字段类型，统一输出 dBASE III 原生 C / N / D / L 四种类型，兼容性最好。</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="erp" style="background:var(--surface-card);border-top:1px solid var(--hairline);border-bottom:1px solid var(--hairline);">
    <div class="container">
      <div class="sec-head"><h2>类型映射规则</h2><p>DBF 与 Excel 之间的字段类型对应关系。</p></div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>DBF 类型</th><th>说明</th><th>XLSX 类型</th></tr>
          </thead>
          <tbody>
            <tr><td><code>C</code></td><td>字符（文本，定长）</td><td>文本</td></tr>
            <tr><td><code>N / F</code></td><td>数值（保留小数位）</td><td>数字</td></tr>
            <tr><td><code>D</code></td><td>日期（YYYYMMDD）</td><td>日期</td></tr>
            <tr><td><code>L</code></td><td>逻辑（T/F）</td><td>布尔</td></tr>
            <tr><td><code>I / T / M</code></td><td>整型 / 时间戳 / 备注</td><td>数字 / 日期时间 / 文本</td></tr>
          </tbody>
        </table>
      </div>
      <p style="color:var(--ink-muted);font-size:14px;margin-top:12px">输出统一使用 dBASE III 原生四种类型（C/N/D/L），兼容性最好。</p>
    </div>
  </section>

  <section class="section" id="archive">
    <div class="container">
      <div class="sec-head"><h2>边界与健壮性</h2><p>处理真实数据时的细节保障。</p></div>
      <div class="grid-3">
        <div class="card"><h3>字段名安全</h3><p>非 ASCII / 超长字段名按 GBK 字节截断到 10 字节，不会切出半个汉字；非法字符替换为下划线，冲突自动追加序号。</p></div>
        <div class="card"><h3>空值处理</h3><p>数字 / 日期空值写空格填充、逻辑空值写 ?，读回时还原为 None，保证往返一致。</p></div>
        <div class="card"><h3>异常兜底</h3><p>自动跳过删除标记记录、过滤 VFP 内部字段（_NullFlags）、缺失 .fpt 备注文件不报错、超限提示拆分。</p></div>
        <div class="card"><h3>大文件支持</h3><p>DBF 记录数上限约 10 亿，XLSX 单表上限 1,048,576 行，超限会清晰提示。</p></div>
        <div class="card"><h3>防御性读取</h3><p>个别非标准 DBF 字段值为 bytes 时转为可读文本，编码错误以 replace 兜底，不中断转换。</p></div>
        <div class="card"><h3>三种接入方式</h3><p>Web 拖拽界面、命令行（CLI）、Python API 三种方式，从日常使用到自动化集成全覆盖。</p></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="cta-band">
        <h2>功能如此强大，且完全免费</h2>
        <p>无需注册，数据本地安全处理。</p>
        <div style="margin-top:var(--s-lg)"><a class="btn btn-primary" href="index.html#tool">立即开始转换</a></div>
      </div>
    </div>
  </section>

  <SiteFooter />
</template>
