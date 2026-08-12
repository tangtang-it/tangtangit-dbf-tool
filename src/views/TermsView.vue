<script setup>
import SiteNav from '@/components/SiteNav.vue';
import SiteFooter from '@/components/SiteFooter.vue';
</script>

<template>
  <SiteNav active="terms" />

  <section class="page-hero">
    <div class="container">
      <div class="crumb"><a href="index.html">首页</a> / 服务条款</div>
      <h1>服务条款</h1>
      <p>请在使用本网站及服务前仔细阅读以下条款。您使用本网站即表示您同意遵守本条款。</p>
      <div class="updated-date">最后更新：2026 年 8 月</div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="prose">
        <h2>1. 服务说明</h2>
        <p>本网站提供 DBF 与 Excel（XLSX）格式之间的在线转换服务。服务以「现状」和「可获得的」方式提供，我们会在合理范围内尽力保证服务的稳定性，但不承诺任何特定运行结果。</p>

        <h2>2. 使用规则</h2>
        <ul>
          <li>您应仅将本服务用于合法用途，不得利用本服务从事任何违法、侵权或损害他人权益的行为。</li>
          <li>您对上传文件的内容拥有合法权利，并对这些内容及其合法性负责。</li>
          <li>不得尝试攻击、破坏或干扰本网站的服务运行。</li>
        </ul>

        <h2>3. 数据与隐私</h2>
        <p>有关数据处理方式，请参见我们的<a href="privacy.html">隐私政策</a>。我们重视您的数据安全，建议不要上传包含极高敏感信息且不可恢复的文件，并妥善保管转换后下载的结果文件。</p>

        <h2>4. 知识产权</h2>
        <p>本网站及服务的所有内容、代码、界面设计、商标均归我们所有或由相应权利人授权使用。未经许可，您不得复制、修改或再分发本服务。</p>

        <h2>5. 免责声明</h2>
        <p>转换结果可能受源文件格式、编码与第三方软件实现差异的影响。尽管我们尽力保证准确性，但不就转换结果的绝对正确性、完整性与适用性作任何明示或默示的保证。对于因使用或无法使用本服务造成的任何间接或衍生损失，我们不承担责任。</p>

        <h2>6. 服务变更与终止</h2>
        <p>我们保留随时修改、暂停或终止本服务的权利，恕不另行通知。您也可以随时停止使用本服务。</p>

        <h2>7. 适用法律与争议解决</h2>
        <p>本条款的解释与适用遵循相关法律法规。如产生争议，双方应友好协商解决；协商不成的，提交服务提供方所在地有管辖权的人民法院处理。</p>

        <h2>8. 联系我们</h2>
        <p>如对本条款有任何疑问，请通过<a href="contact.html">联系我们</a>页面与我们联系。</p>
      </div>
    </div>
  </section>

  <SiteFooter />
</template>
