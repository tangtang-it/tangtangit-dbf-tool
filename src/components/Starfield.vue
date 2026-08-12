<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
const stars = ref([]);
const colors = ['rgba(255,255,255,.6)', 'rgba(98,174,240,.7)', 'rgba(214,182,246,.8)', 'rgba(255,100,200,.7)', 'rgba(42,157,153,.7)'];
let built = false;

function build() {
  if (built) return;
  built = true;
  const arr = [];
  for (let i = 0; i < 60; i++) {
    const size = Math.random() * 2.4 + 1;
    arr.push({
      width: size + 'px',
      height: size + 'px',
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      background: colors[i % colors.length],
      animationDelay: (Math.random() * 3) + 's',
    });
  }
  stars.value = arr;
}

onMounted(build);
</script>

<template>
  <div class="starfield" aria-hidden="true">
    <i v-for="(s, i) in stars" :key="i" :style="s"></i>
  </div>
</template>
