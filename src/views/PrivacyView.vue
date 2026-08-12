<script setup>
import SiteNav from '@/components/SiteNav.vue';
import SiteFooter from '@/components/SiteFooter.vue';
</script>

<template>
  <SiteNav active="privacy" />

  <section class="page-hero">
    <div class="container">
      <div class="crumb"><a href="index.html">首页</a> / 隐私政策</div>
      <h1>隐私政策</h1>
      <p>本政策说明了我们（「DBF 转换工具」）如何处理您在使用本网站及转换服务时涉及的数据。我们非常重视您的隐私。</p>
      <div class="updated-date">最后更新：2026 年 8 月</div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="prose">
        <h2>1. 我们收集什么数据</h2>
        <h3>1.1 您上传的文件</h3>
        <p>您在本站上传的 .dbf / .xlsx 文件，仅在您发起转换的请求中被处理，用于执行转换功能。我们不会将这些文件上传到任何第三方云端，也不会将其用于转换以外的任何目的。</p>
        <h3>1.2 自动收集的信息</h3>
        <p>与大多数网站一样，当您访问本网站时，我们的服务器可能会自动记录一些常规信息，例如浏览器类型、访问时间、页面地址等。这些信息仅用于保障服务安全与基本运维。</p>
        <h3>1.3 本地存储</h3>
        <p>本服务默认仅监听本机（127.0.0.1）。转换过程中产生的临时文件保存在本机临时目录，服务重启时会自动清理，不进行云端持久化存储。</p>

        <h2>2. 我们如何使用数据</h2>
        <p>我们仅将收集的信息用于：提供并维护转换功能、保障服务与系统安全、改进产品体验。我们不会出售您的任何个人信息。</p>

        <h2>3. 第三方服务（广告）与 Cookie</h2>
        <p>本网站可能接入第三方广告服务（例如 Google AdSense）来展示广告。这些第三方广告提供商可能会使用 Cookie 或类似技术来提供更相关的广告内容。</p>
        <ul>
          <li>第三方供应商（包括 Google）会使用 Cookie 来根据您先前对本网站的访问情况展示广告。</li>
          <li>Google 可能会使用广告 Cookie，使其及其合作伙伴能够根据您对本站和 / 或其他网站的访问情况向您展示合适的广告。</li>
          <li>您可以通过 <a href="https://www.google.com/settings/ads" rel="nofollow noopener" target="_blank">Google 广告设置</a> 停用个性化广告，或访问 <a href="https://www.aboutads.info/choices" rel="nofollow noopener" target="_blank">www.aboutads.info</a> 了解关于此类 Cookie 的更多信息与选择。</li>
          <li>您可以通过浏览器设置管理或删除 Cookie。</li>
        </ul>

        <h2>4. 数据传输与安全</h2>
        <p>转换过程中，您的文件数据不会离开您的设备所在环境。我们采取合理的措施保护数据安全，但请您理解，任何通过互联网传输的方法都不是绝对安全的。</p>

        <h2>5. 儿童隐私</h2>
        <p>本网站面向一般公众，不针对未满 13 周岁的儿童设计，也不会刻意收集儿童的个人信息。</p>

        <h2>6. 您的权利</h2>
        <p>您有权了解我们处理了哪些数据，并有权要求我们更正或删除相关数据。由于本站原则上不采集、不保存您的个人身份数据，您一般无需担心数据留存问题。</p>

        <h2>7. 政策更新</h2>
        <p>我们可能不时更新本隐私政策。任何变更都会在本页面发布，并更新「最后更新」日期。重大变更我们会通过显著方式提示。</p>

        <h2>8. 联系我们</h2>
        <p>如果您对本隐私政策有任何疑问，请通过<a href="contact.html">联系我们</a>页面与我们取得联系。</p>
      </div>
    </div>
  </section>

  <SiteFooter />
</template>
