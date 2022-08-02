<template>
  <van-pull-refresh
    class="home-main"
    v-model="refreshing"
    @refresh="onRefresh"
  >
    <!-- <div class="home-main"> -->
    <!-- 轮播图区域 -->
    <van-swipe
      class="my-swipe"
      :autoplay="3000"
      indicator-color="white"
    >
      <van-swipe-item
        v-for="(item,index) in swipeData"
        :key="index"
      >
        <img
          :src="item.img"
          alt=""
        >
      </van-swipe-item>
    </van-swipe>
    <!-- 菜单导航区域 -->
    <van-grid
      :column-num="4"
      icon-size="40"
    >
      <van-grid-item
        v-for="(item,index) in menusData"
        :key="index"
        :icon="item.img"
        :text="item.info[0].value"
      />
    </van-grid>
    <!-- 公告区域 -->
    <van-notice-bar
      left-icon="volume-o"
      :scrollable="false"
    >
      <span>热点资讯公告：</span>
      <van-swipe
        vertical
        class="notice-swipe"
        :autoplay="3000"
        :show-indicators="false"
      >
        <van-swipe-item
          v-for="(item,index) in newsData"
          :key="index"
          v-text="item.chiild[0].val"
        />
      </van-swipe>
    </van-notice-bar>
    <!-- 商品列表区域 -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="initProductDatas"
    >
      <product-list
        :product-datas="productDatas"
      />
    </van-list>
  <!-- </div> -->
  </van-pull-refresh>
</template>

<script setup>
import {
  Swipe as VanSwipe,
  SwipeItem as VanSwipeItem,
  Grid as VanGrid,
  GridItem as VanGridItem,
  NoticeBar as VanNoticeBar,
  List as VanList,
  PullRefresh as VanPullRefresh
} from 'vant'
import ProductList from '@/components/ProductList.vue'
import { ref, computed } from 'vue'
import { getDafaultDate } from '@/api/index'
import { getProductsData } from '@/api/product'

const indexData = ref({})

// ----首页数据----
const initIndexData = async () => {
  const { data } = await getDafaultDate()
  if (data.status !== 200) return
  indexData.value = data.data
  refreshing.value = false
}
initIndexData()

// 1 轮播图数据
const swipeData = computed(() => indexData.value.swiperBg?.default.imgList.list)

// 2 菜单数据
const menusData = computed(() => indexData.value.menus?.default.imgList.list)

// 3 公告栏数据
const newsData = computed(() => indexData.value.news?.default.newList.list)

// ----首页商品信息数据----
let page = 1
const limit = 4
const productDatas = ref([])
const loading = ref(false)
const finished = ref(false)
const initProductDatas = async () => {
  const { data } = await getProductsData({
    limit,
    page
  })
  if (data.status !== 200) return
  productDatas.value.push(...data.data)
  loading.value = false

  if (data.data.length < limit) {
    return finished.value = true
  }
  page++
}

// 下拉刷新
const refreshing = ref(false)

const onRefresh = () => {
  indexData.value = {}
  productDatas.value = []
  page = 1
  finished.value = false
  initIndexData()
  initProductDatas()
}

</script>

<style lang="scss" scoped>
.my-swipe img {
  width: 100%;
  height: 170px;
}

:deep(.van-notice-bar__content) {
  display: flex;
  align-items: center;
}

.van-notice-bar {
  background-color: #fff;
  color: black;
}
.notice-swipe {
  height: 40px;
   line-height: 40px;
  }
</style>
