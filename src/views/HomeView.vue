<script setup>
import SiteNav from '@/components/SiteNav.vue';
import SiteFooter from '@/components/SiteFooter.vue';
import Starfield from '@/components/Starfield.vue';
import ConvertTool from '@/components/ConvertTool.vue';
</script>

<template>
  <SiteNav active="home" />

  <!-- Hero（深靛蓝夜带） -->
  <section class="hero">
    <Starfield />
    <div class="container hero-inner">
      <div class="hero-copy">
        <span class="badge">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4L19 6"/></svg>
          免费 · 本机处理 · 数据不上传
        </span>
        <h1>DBF 与 Excel 快速双向转换</h1>
        <p class="lead">自动识别 GBK / UTF-8 中文编码，支持批量与超大文件流式处理。专为国内老财务、ERP 与台账数据设计，全程本地安全运行。</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="index.html#tool">免费在线转换</a>
          <a class="btn btn-secondary" href="features.html">查看功能特性</a>
        </div>
        <div class="stats">
          <div class="stat"><b>10 万行</b><span>约 4 秒完成</span></div>
          <div class="stat"><b>C / N / D / L</b><span>兼容 dBASE III 类型</span></div>
          <div class="stat"><b>100% 本地</b><span>文件不上传云端</span></div>
        </div>
      </div>

      <div class="hero-art" aria-hidden="true">
        <div class="hero-card">
          <div class="hero-card-head">
            <span class="hero-dot orange"></span><span class="hero-dot pink"></span><span class="hero-dot teal"></span>
          </div>
          <div class="hero-pipe">
            <div class="hero-tile">DBF</div>
            <svg class="hero-flow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M5 12l4-4M5 12l4 4M19 12l-4-4M19 12l-4 4"/></svg>
            <div class="hero-tile hero-tile-out">XLSX</div>
          </div>
          <div class="hero-rows">
            <div class="hero-row" style="width:86%"></div>
            <div class="hero-row" style="width:72%"></div>
            <div class="hero-row" style="width:93%"></div>
            <div class="hero-row" style="width:64%"></div>
            <div class="hero-row" style="width:80%"></div>
          </div>
          <div class="hero-badge">✓ 转换成功 · 全程本地</div>
        </div>
      </div>
    </div>
  </section>

  <!-- 在线转换工具 -->
  <section class="section" id="tool">
    <div class="container">
      <div class="sec-head">
        <h2>在线转换工具</h2>
        <p>拖拽或选择 .dbf / .xlsx 文件，方向自动识别，结果可逐个下载或一键打包 ZIP。</p>
      </div>
      <ConvertTool />
    </div>
  </section>

  <!-- 核心特性 -->
  <section class="section" id="features">
    <div class="container">
      <div class="sec-head">
        <h2>为什么选择我们</h2>
        <p>专为中文财务 / ERP 环境打磨，解决 DBF 编码与类型兼容的痛点。</p>
      </div>
      <div class="grid-3">
        <div class="card">
          <div class="card-icon teal">编</div>
          <h3>智能中文编码</h3>
          <p>读入时自动检测 DBF 头部编码（GBK 优先），写出默认 GBK，兼容国内老财务、ERP 软件。</p>
          <div class="dots"><span class="dot teal"></span><span class="dot sky"></span><span class="dot green"></span></div>
        </div>
        <div class="card">
          <div class="card-icon orange">批</div>
          <h3>批量转换</h3>
          <p>一次选择多个文件或整个目录，自动识别方向，逐个显示结果，成功结果可一键打包 ZIP 下载。</p>
        </div>
        <div class="card">
          <div class="card-icon purple">快</div>
          <h3>流式高速处理</h3>
          <p>全程流式读写，10 万行数据约 4 秒完成，内存占用稳定，不随行数增长。</p>
        </div>
        <div class="card">
          <div class="card-icon sky">类</div>
          <h3>类型智能推断</h3>
          <p>XLSX 转 DBF 时自动推断字段类型（日期 D / 逻辑 L / 数值 N / 字符 C），输出 dBASE III 原生格式。</p>
        </div>
        <div class="card">
          <div class="card-icon green">安</div>
          <h3>数据本地安全</h3>
          <p>文件全程在本机浏览器与服务间处理，不上传任何云端，适合敏感财务数据。</p>
        </div>
        <div class="card">
          <div class="card-icon pink">健</div>
          <h3>边界处理完善</h3>
          <p>自动跳过删除标记、过滤 VFP 内部字段、字段名冲突加序号、超长字段安全截断不切半汉字。</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 使用教程 -->
  <section class="section" id="guide" style="background:var(--surface-card);border-top:1px solid var(--hairline);border-bottom:1px solid var(--hairline);">
    <div class="container">
      <div class="sec-head">
        <h2>三步快速上手</h2>
        <p>无需安装，浏览器即用。三种方式任选其一。</p>
      </div>
      <div class="grid-3">
        <div class="card">
          <h3>① 网页在线</h3>
          <p>在上方工具区拖入文件，选择方向与编码，点击「开始转换」即可下载。</p>
        </div>
        <div class="card">
          <h3>② 本地构建</h3>
          <p>npm 管理依赖，esbuild 一键打包，转换全程在浏览器本地完成。</p>
        </div>
        <div class="card">
          <h3>③ 静态部署</h3>
          <p>纯静态站点，可部署到 Cloudflare Pages 等任何静态托管。</p>
        </div>
      </div>
      <div style="margin-top:var(--s-xl)">
        <pre class="code"><span class="c"># 本地构建与预览示例</span>
<span class="cmd">npm</span> install            <span class="c"># 安装依赖（vue / vite / xlsx / jszip）</span>
<span class="cmd">npm</span> run dev             <span class="c"># 本地开发 http://127.0.0.1:5173</span>
<span class="cmd">npm</span> run build           <span class="c"># 打包 → dist/</span></pre>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="section" id="faq">
    <div class="container">
      <div class="sec-head">
        <h2>常见问题</h2>
        <p>关于编码、类型与使用场景的解答。</p>
      </div>
      <div class="faq">
        <details>
          <summary>支持哪些 DBF 编码？</summary>
          <p>读取时自动检测 DBF 头部的 language driver id，GBK（cp936）最常用；也支持 UTF-8、Big5 等。写出默认 GBK，可用选项切换为 UTF-8。</p>
        </details>
        <details>
          <summary>转换会不会上传我的文件到云端？</summary>
          <p>不会。转换引擎是纯前端 JS，文件全程在浏览器本地处理，绝不离开你的电脑。</p>
        </details>
        <details>
          <summary>最多支持多大的文件？</summary>
          <p>受浏览器内存限制，建议单文件不超过 300MB。XLSX 单表上限 1,048,576 行，超限会提示拆分。</p>
        </details>
        <details>
          <summary>Excel 里的字段类型怎么映射到 DBF？</summary>
          <p>全部为日期→D、全部为布尔→L、全部为数字→N（按位数自动定长）、含文本→C（按字节数定长，中文按 2 字节计）。统一输出 dBASE III 原生类型。</p>
        </details>
        <details>
          <summary>中文文件名/字段名会不会乱码或被截断？</summary>
          <p>字段名按 GBK 字节截断到 10 字节，不会切出半个汉字；非法字符替换为下划线，重名自动追加序号。数据内容按所选编码正确处理。</p>
        </details>
        <details>
          <summary>可以商用吗？需要付费吗？</summary>
          <p>本工具完全免费。建议查阅<a href="terms.html">服务条款</a>与<a href="privacy.html">隐私政策</a>。若在生产环境大规模使用，欢迎通过<a href="contact.html">联系我们</a>获取支持。</p>
        </details>
      </div>
    </div>
  </section>

  <!-- CTA 区 -->
  <section class="section">
    <div class="container">
      <div class="cta-band">
        <h2>准备好转换你的数据了吗？</h2>
        <p>完全免费，无需注册，数据全程在本机处理。</p>
        <div style="margin-top:var(--s-lg)"><a class="btn btn-primary" href="index.html#tool">立即开始转换</a></div>
      </div>
    </div>
  </section>

  <SiteFooter />
</template>
