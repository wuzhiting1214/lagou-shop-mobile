<template>
  <van-tabbar
    fixed
    route
  >
    <van-tabbar-item
      to="/"
      icon="home-o"
    >
      首页
    </van-tabbar-item>
    <van-tabbar-item
      to="/category"
      icon="apps-o"
    >
      分类
    </van-tabbar-item>
    <van-tabbar-item
      to="/recommend"
      icon="gift-o"
    >
      推荐
    </van-tabbar-item>
    <van-tabbar-item
      to="/cart"
      icon="cart-o"
    >
      购物车
    </van-tabbar-item>
    <van-tabbar-item
      to="/user"
      icon="user-o"
    >
      我的
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import {
  Tabbar as VanTabbar,
  TabbarItem as VanTabbarItem
} from 'vant'
</script>

<style lang="scss" scoped>

</style>
