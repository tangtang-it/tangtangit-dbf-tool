<script setup>
import { ref, onMounted } from 'vue';
const year = ref(new Date().getFullYear());
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="nav-brand" href="/" style="margin-bottom:8px">
            <span class="mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M5 12l4-4M5 12l4 4M19 12l-4-4M19 12l-4 4"/></svg>
            </span>
            DBF 转换工具
          </a>
          <p>免费的 DBF ⇄ XLSX 双向转换工具，本地安全、支持批量与中文编码，兼容老财务 / ERP 软件。</p>
        </div>
        <div>
          <h4>工具</h4>
          <ul>
            <li><a href="/#tool">在线转换</a></li>
            <li><a href="/features">功能特性</a></li>
            <li><a href="/#guide">使用教程</a></li>
            <li><a href="/#faq">常见问题</a></li>
          </ul>
        </div>
        <div>
          <h4>支持</h4>
          <ul>
            <li><a href="/about">关于我们</a></li>
            <li><a href="/contact">联系我们</a></li>
            <li><a href="/terms">服务条款</a></li>
            <li><a href="/privacy">隐私政策</a></li>
          </ul>
        </div>
        <div>
          <h4>场景</h4>
          <ul>
            <li><a href="/features#financial">财务台账</a></li>
            <li><a href="/features#erp">ERP 数据</a></li>
            <li><a href="/features#archive">档案迁移</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© <span>{{ year }}</span> DBF 转换工具 · 保留所有权利</span>
        <span>数据全程在你的浏览器本地处理，绝不上传服务器</span>
      </div>
    </div>
  </footer>
</template>
