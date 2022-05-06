<template>
  <div class="home-nav">
    <img height="20" src="@/assets/logo.png" alt="">
    <div class="search">
      <van-icon name="search" size="20"/>
    </div>
    <van-icon name="wap-nav"></van-icon>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.home-nav {
  position: fixed;
  display: flex;
  height: 50px;
  width: 100%;
  align-items: center;
  padding-right: 10px;
  box-sizing: border-box;
  background-color: #fff;

  img {
    padding: 0 10px;
  }
  
  .search {
    width: 100%;
    background-color: #f7f7f7;
    border-radius: 25px;
    padding-left: 12px;
    margin-right: 10px;
  }
}
</style>
