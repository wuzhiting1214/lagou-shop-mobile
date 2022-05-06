<template>
  <!-- 顶部搜索区域 -->
  <home-nav></home-nav>
  <!-- 主体内容区域 -->
  <home-main class="home-main"></home-main>
  <!-- 底部导航区域 -->
  <layout-footer></layout-footer>
</template>

<script setup>
import HomeNav from './components/HomeNav.vue'
import HomeMain from './components/HomeMain.vue'
import LayoutFooter from '@/components/LayoutFooter.vue'
</script>

<style lang="scss" scoped>
.home-nav {
  z-index: 1000;
}
.home-main {
  padding: 50px 0;
  background-color: #f7f7f7;
}
</style>
