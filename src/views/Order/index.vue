<template>
  <van-cell-group class="order">
    <van-nav-bar
      left-arrow
      title="订单页面"
      @click-left="router.push('/user')"
      fixed
    ></van-nav-bar>
    <!-- 标签切换区域 -->
    <van-cell class="tags">
      <van-button
        size="small"
        :class="{ active: orderDataList.is5 }"
        @click="handleChange(5)"
      >全部</van-button>
      <van-button
        size="small"
        :class="{ active: orderDataList.is0 }"
        @click="handleChange(0)"
      >待付款</van-button>
      <van-button
        size="small"
        :class="{ active: orderDataList.is1 }"
        @click="handleChange(1)"
      >未发货</van-button>
      <van-button
        size="small"
        :class="{ active: orderDataList.is2 }"
        @click="handleChange(2)"
      >待收货</van-button>
      <van-button
        size="small"
        :class="{ active: orderDataList.is3 }"
        @click="handleChange(3)"
      >待评价</van-button>
      <van-button
        size="small"
        :class="{ active: orderDataList.is4 }"
        @click="handleChange(4)"  
      >已完成</van-button>
    </van-cell>
    <div class="content" v-if="!orderDataList.hasOrder">
      <order-item
        v-for="item in orderDataList.orderData"
        :key="item.id"
        :dingdan="item"
        :to="{
          name: 'order-detail',
          params: {
            orderId: item.order_id
          }
        }"
      ></order-item>
    </div>
    <van-empty v-else description="暂时没有订单"></van-empty>
  </van-cell-group>
</template>

<script setup>
import OrderItem from './components/OrderItem.vue'
import { reactive } from '@vue/reactivity'
import {
  CellGroup as VanCellGroup,
  NavBar as VanNavBar,
  Cell as VanCell,
  Button as VanButton,
  Empty as VanEmpty
} from 'vant'
import { useRouter } from "vue-router"

import { getOrderList } from '@/api/order'
import { computed } from '@vue/runtime-core'

const router = useRouter()

const { typeNum } = defineProps({
  typeNum: {
    type: String
  }
})
// 0 - 待付款，1 - 待发货，2 - 待收货，3 - 待评价，4 - 已完成
const orderDataList = reactive({
  orderData: [],
  active: 5,
  allData: [],
  is5: computed(() => orderDataList.active === 5),
  is0: computed(() => orderDataList.active === 0),
  is1: computed(() => orderDataList.active === 1),
  is2: computed(() => orderDataList.active === 2),
  is3: computed(() => orderDataList.active === 3),
  is4: computed(() => orderDataList.active === 4),
  hasOrder: computed(() => orderDataList.orderData.length === 0)
})


// 获取所有订单
const initOrderList = async () => {
  const { data } = await getOrderList()
  if (data.status !== 200) { return }
  // console.log(data)
  // orderData = data.data
  orderDataList.allData = data.data
  orderDataList.orderData = orderDataList.allData
  if (typeNum) {
    handleChange(typeNum * 1)
  }  
}
initOrderList()

// 更改订单类型
const handleChange = (num) => {
  orderDataList.active = num
  if (num === 5) {
    orderDataList.orderData = orderDataList.allData
  } else {
    orderDataList.orderData = orderDataList.allData.filter(item => item._status._type === num)
  }
  console.log(2)
}
// handleChange(typeNum * 1)
// 订单详情
// const handleDetail = () => {
//   router.push({
//     name: 'order-detail',
//     params: {
//       orderId: item.id
//     }
//   })
// }
</script>

<style lang="scss" scoped>
.order {
  background-color: #f6f6f6;
}

.tags {
  position: fixed;
  top: 40px;
  z-index: 10000;
}
.active {
  background-color: #fac143;
  border-radius: 10px;
}
.van-button {
  margin-left: 5px;
  border: none;
}

.content {
  margin-top: 93px;
}

.van-empty {
  margin-top: 93px;
}
// .order-item {
//   position: fixed;
//   top: 150px;
// }
</style>