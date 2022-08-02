<template>
  <div class="orderInfo"
      v-for="item in cartInfo"
      :key="item.id"
      @click="handle(item.product_id)"
      :productId="item.product_id"
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
    </div>
</template>

<script setup>
import { isTemplateNode } from '@vue/compiler-core';
import router from '../router';

const { cartInfo } = defineProps({
  cartInfo: {
    type: Object
  }
})
const handle = productId => {
  router.push({
    name: 'product',
    params: {
      productId
    }
  })
}
</script>

<style lang="scss" scoped>
.orderInfo {
    display: flex;
    width: 100%;
    align-items: center;
    margin-bottom: 10px;

    img {
      width: 70px;
      height: 70px;
    }

    .detail {
      padding: 0 10px;
      width: 80%;
      .title {
      font-size: 14px;
      font-weight: 700;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .spec {
      font-size: 12px;
    }

    }

    .pc {
      font-size: 14px;
    }
  }
</style>