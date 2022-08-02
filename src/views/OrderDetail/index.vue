<template>
  <div class="order-detail">
    <van-nav-bar
      left-arrow  
      title="订单详情"
      @click-left="handleBack"
    ></van-nav-bar>
    <van-cell class="orderinfo">
      <order-item
        :cartInfo="cartInfo"
      ></order-item>
      <span>商品总价：</span>
      <span>￥{{order.orderDetail.pay_price}}</span>
    </van-cell>
    <!-- <van-cell class="price">
      <span>商品总价：</span>
      <span>￥{{order.orderDetail.pay_price}}</span>
    </van-cell> -->
    <van-cell class="info">
      <p>订单信息</p>
      <span>订单编号：</span>
      <span v-text="order.orderDetail.order_id"></span>
      <p>
        <span>创建时间：</span>
        <span v-text="order.orderDetail._add_time"></span>
      </p>
      <p>
        <span>付款时间：</span>
        <span v-text="order.orderDetail._pay_time"></span>
      </p>
    </van-cell>
    <van-cell class="shouhuo">
      <p>收货人： {{order.orderDetail.real_name}}</p>
      <p>收货地址：{{order.orderDetail.user_address}}</p>
      <p>联系电话：{{order.orderDetail.user_phone}}</p>
    </van-cell>
  </div>
</template>

<script setup>
import {
  NavBar as VanNavBar,
  Cell as VanCell
} from 'vant'
import OrderItem from '@/components/OrderItem.vue'
import { getOrderListById } from '@/api/order'
import { useRouter } from 'vue-router'
import { reactive, ref } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'
const { orderId } = defineProps({
  orderId: {
    type: String,
    required: true
  }
})

const router = useRouter()

const handleBack = () => {
  router.push('/order')
}

// 获取订单详情
const order = reactive({
  orderDetail: []
})

const initOrderDetail = async (orderId) => {
  const { data } = await getOrderListById(orderId)
  if (data.status !== 200) { return }
  order.orderDetail = data.data
  console.log(data.data)
}
initOrderDetail(orderId)
const cartInfo = computed(() => order.orderDetail?.cartInfo)
console.dir(cartInfo)
</script>

<style lang="scss" scoped>
.order-detail {
  background-color: #f6f6f6;
}

.van-cell {
  margin-bottom: 10px;
}
:deep(.orderInfo) {
  width: 95%;
  padding: 5px 15px;
}
</style>