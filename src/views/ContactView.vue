<script setup>
import { ref } from 'vue';
import SiteNav from '@/components/SiteNav.vue';
import SiteFooter from '@/components/SiteFooter.vue';

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});
const contactStatus = ref('');
const contactColor = ref('');

function submitForm() {
  const email = form.value.email.trim();
  const message = form.value.message.trim();
  if (!email || !message) {
    contactStatus.value = '请填写邮箱和内容。';
    contactColor.value = '#d84343';
    return;
  }
  // 本机演示：收集后提示（正式部署请替换为真实邮件 / 后端接口）
  contactStatus.value = '已记录，感谢你的反馈！（本演示环境不会真实发送邮件，请配置后端后启用）';
  contactColor.value = '#1aae39';
  form.value = { name: '', email: '', subject: '', message: '' };
}
</script>

<template>
  <SiteNav active="contact" />

  <section class="page-hero">
    <div class="container">
      <div class="crumb"><a href="index.html">首页</a> / 联系我们</div>
      <h1>联系我们</h1>
      <p>有问题、有建议，或希望洽谈合作？欢迎与我们联系。</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="grid-2" style="align-items:start">
        <div class="card">
          <h3 style="margin-top:0">发送消息</h3>
          <p style="margin-bottom:var(--s-lg)">请尽量详细描述你的问题，我们会尽快回复。</p>
          <form id="contact-form" @submit.prevent="submitForm">
            <div class="form-field">
              <label for="name">姓名 / 称呼</label>
              <input type="text" id="name" v-model="form.name" placeholder="你的称呼（可选）">
            </div>
            <div class="form-field">
              <label for="email">邮箱</label>
              <input type="email" id="email" v-model="form.email" required placeholder="you@example.com">
            </div>
            <div class="form-field">
              <label for="subject">主题</label>
              <input type="text" id="subject" v-model="form.subject" placeholder="消息主题">
            </div>
            <div class="form-field">
              <label for="message">内容</label>
              <textarea id="message" v-model="form.message" required placeholder="请描述你的问题或建议…"></textarea>
            </div>
            <button class="btn btn-primary" type="submit">提交消息</button>
            <p id="contact-status" style="margin-top:10px;font-size:14px" :style="{ color: contactColor || 'var(--ink-muted)' }">{{ contactStatus }}</p>
          </form>
        </div>
        <div>
          <div class="card" style="margin-bottom:var(--s-md)">
            <h3 style="margin-top:0">其他联系渠道</h3>
            <p style="margin-bottom:var(--s-sm)">你也可以通过以下方式与我们联系：</p>
            <ul style="list-style:none">
              <li style="padding:8px 0;border-bottom:1px solid var(--hairline)"><strong>邮箱：</strong>support@dbf.tangtangit.com</li>
              <li style="padding:8px 0;border-bottom:1px solid var(--hairline)"><strong>响应时间：</strong>工作日 48 小时内</li>
              <li style="padding:8px 0"><strong>业务合作：</strong>欢迎洽谈企业 / 定制支持</li>
            </ul>
          </div>
          <div class="card">
            <h3 style="margin-top:0">相关页面</h3>
            <p style="margin-bottom:0"><a href="privacy.html">隐私政策</a> · <a href="terms.html">服务条款</a> · <a href="about.html">关于我们</a></p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <SiteFooter />
</template>
