<template>
  <div class="cart-item">
    <van-checkbox v-model="itemChecked" checked-color="#ee0a24"></van-checkbox>
    <div class="link" @click="handleRouter">
      <img :src="itemData.image" alt="">
      <div class="cart-info">
        <p class="title" v-text="itemData.title"></p>
        <div class="detail">
          <span class="price">￥{{ itemData.price }}</span>
          <van-stepper v-model="itemCount" :max="itemData.stock" button-size="26px" @click.stop/>
        </div>
        <p class="del">删除</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Checkbox as VanCheckbox,
  Stepper as VanStepper
} from 'vant'
import { computed } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
const router = useRouter()
const store = useStore()
const itemChecked = computed({
  get: () => itemData.checked,
  set: newChecked => {
    store.commit('cart/checkedChange', { checked: newChecked, id: itemData.id})
  }
})
const itemCount = computed({
  get: () => itemData.count,
  set (newCount) {
    store.dispatch('cart/countChange', { id: itemData.id, count: newCount })
  }
})
// 接收父组件传递的数据
const { itemData } = defineProps({
  itemData: {
    type: Object,
    required: true
  }
})

const handleRouter = () => {
  router.push({
    name: 'product',
    params: {
      productId: itemData.productId
    }
  })
}
</script>

<style lang="scss" scoped>
.cart-item {
  background-color: #fff;
  margin-bottom: 1px;
  height: 90px;
  padding: 10px 20px;
  display: flex;

  .link {
    width: 100%;
    display: flex;
    img {
      width: 88px;
      height: 88px;
      align-self: center;
    }

    .cart-info {
      font-size: 14px;
      .title {
        width: 220px;
        margin: 5px 0 15px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 1;
      }

      .detail {
        margin-bottom: 5px;
        .price {
          font-size: 16px;
          color: #f2270c;
        }

        .van-stepper {
          float: right;
        }
      }
      .del {
        direction: rtl;
      }
    }
  }
}
</style>