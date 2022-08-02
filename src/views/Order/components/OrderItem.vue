<template>
  <van-cell class="order-item">
    <div class="status">
      <span>付款时间: {{dingdan?._pay_time}}</span>
      <span class="isSend" v-text="dingdan?._status._title"></span>
    </div>
    <order-item
      :cartInfo="cartInfo"
    ></order-item>
    <!-- <div class="orderInfo"
      v-for="item in cartInfo"
      :key="item.id"
    >
      <img :src="item?.productInfo?.image" alt="">
      <div class="detail">
        <p class="title" v-text="item?.productInfo?.store_name"></p>
        <p class="spec" v-text="item?.productInfo?.attrInfo?.sku"></p>
      </div>
      <div class="pc">
        <p class="price">x{{item?.truePrice}}</p>
        <p class="count">x{{item?.cart_num}}</p>
      </div>
    </div> -->
    <div class="sum">总计：{{dingdan?.pay_price}}</div>
  </van-cell>
</template>

<script setup>
import { computed } from '@vue/runtime-core'
import OrderItem from '@/components/OrderItem.vue'
import {
  Cell as VanCell
} from 'vant'

const { dingdan } = defineProps({
  dingdan: {
    type: Object,
    required: true
  }
})

const cartInfo = computed(() => dingdan?.cartInfo)
const productInfo = computed(() => cartInfo.value.productInfo)
// console.log(productInfo)
</script>

<style lang="scss" scoped>
.order-item {
  padding: 5px 10px;
  width: 95%;
  margin: 0 10px 10px;
  border-radius: 15px;

  .status {
    display: flex;
    justify-content: space-between;
    color: #b1b1b1;
    font-size: 12px;
  }
  // .orderInfo {
  //   display: flex;
  //   width: 100%;
  //   align-items: center;
  //   margin-bottom: 10px;

  //   img {
  //     width: 70px;
  //     height: 70px;
  //   }

  //   .detail {
  //     padding: 0 10px;
  //     width: 80%;
  //     .title {
  //     font-size: 14px;
  //     font-weight: 700;
  //     display: -webkit-box;
  //     -webkit-box-orient: vertical;
  //     -webkit-line-clamp: 2;
  //     overflow: hidden;
  //   }

  //   .spec {
  //     font-size: 12px;
  //   }

  //   }
  // }
}
</style>