<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

defineProps({
  active: { type: String, default: '' },
});

const menuOpen = ref(false);
const moreOpen = ref(false);

function onDocClick(e) {
  const more = document.querySelector('.nav-more');
  if (moreOpen.value && !(more && more.contains(e.target))) {
    moreOpen.value = false;
  }
  const links = document.querySelector('.nav-links');
  if (menuOpen.value && links && !links.contains(e.target) && !e.target.closest('.nav-burger')) {
    menuOpen.value = false;
  }
}

function onLinkClick(e) {
  if (e.target.tagName === 'A') menuOpen.value = false;
  // 下拉菜单链接点击后关闭
  if (e.target.closest('.nav-more-menu')) moreOpen.value = false;
}

onMounted(() => document.addEventListener('click', onDocClick));
onBeforeUnmount(() => document.removeEventListener('click', onDocClick));
</script>

<template>
  <header class="nav">
    <div class="nav-inner">
      <a class="nav-brand" href="index.html">
        <span class="mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M5 12l4-4M5 12l4 4M19 12l-4-4M19 12l-4 4"/></svg>
        </span>
        DBF 转换工具
      </a>
      <button class="nav-burger" aria-label="打开菜单" @click="menuOpen = !menuOpen">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
      <nav class="nav-links" :class="{ open: menuOpen }" aria-label="主导航" @click="onLinkClick">
        <a href="index.html#tool">在线转换</a>
        <a href="features.html">功能特性</a>
        <a href="index.html#guide">使用教程</a>
        <a href="index.html#faq">常见问题</a>
        <a href="about.html">关于</a>
        <div class="nav-more" :class="{ open: moreOpen }">
          <button class="nav-more-btn" aria-haspopup="true" :aria-expanded="moreOpen ? 'true' : 'false'" @click.stop="moreOpen = !moreOpen">
            更多
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <div class="nav-more-menu">
            <a href="https://tangtangit.com/" target="_blank" rel="noopener">
              <img class="nav-more-icon" src="/brand/tangtang-blog.ico" alt="糖糖it 博客" loading="lazy">糖糖it 博客
            </a>
            <a href="https://m3u8player.tangtangit.com/" target="_blank" rel="noopener">
              <img class="nav-more-icon" src="/brand/m3u8.svg" alt="M3U8 Player" loading="lazy">M3U8 Player
            </a>
            <a href="https://tts.tangtangit.com/" target="_blank" rel="noopener">
              <img class="nav-more-icon" src="/brand/tts.svg" alt="TTS 语音合成" loading="lazy">TTS 语音合成
            </a>
          </div>
        </div>
        <span class="nav-cta"><a class="btn btn-utility" href="index.html#tool">立即开始</a></span>
      </nav>
    </div>
  </header>
</template>
