<script setup>
import SiteNav from '@/components/SiteNav.vue';
import SiteFooter from '@/components/SiteFooter.vue';
</script>

<template>
  <SiteNav active="about" />

  <section class="page-hero">
    <div class="container">
      <div class="crumb"><a href="index.html">首页</a> / 关于我们</div>
      <h1>关于我们</h1>
      <p>让老数据活起来——专为中文财务与 ERP 数据打造的格式转换工具。</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="prose">
        <h2>我们的故事</h2>
        <p>在国内很多财务、ERP 与档案管理系统中，DBF 格式仍被大量使用。然而，将这些历史数据导出为 Excel 常常面临编码乱码、字段类型错乱、大文件卡顿等问题。</p>
        <p>我们创建这个工具的初衷，就是为这些真实场景提供一个简单、可靠、安全的解决方案：无需安装、数据本地处理、智能识别中文编码，让任何人都能轻松完成 DBF 与 Excel 之间的双向转换。</p>

        <h2>我们相信</h2>
        <ul>
          <li><strong>数据安全第一</strong>：文件不上传云端，全程本机处理。</li>
          <li><strong>兼容性优先</strong>：忠于 dBASE III 原生格式，最大限度兼容老软件。</li>
          <li><strong>简单易用</strong>：网页拖拽即可，无需学习复杂命令。</li>
          <li><strong>完全免费</strong>：核心功能永久免费，为个人与中小企业服务。</li>
        </ul>

        <h2>技术理念</h2>
        <p>核心引擎以流式读写实现，保障超大文件的稳定与快速处理。我们持续打磨编码检测、类型推断与边界容错，力求在真实的生产数据上表现得可靠而准确。</p>

        <h2>联系方式</h2>
        <p>如果你有任何问题、建议或合作意向，欢迎访问<a href="contact.html">联系我们</a>页面。也欢迎查看我们的<a href="terms.html">服务条款</a>与<a href="privacy.html">隐私政策</a>。</p>
      </div>
    </div>
  </section>

  <SiteFooter />
</template>
