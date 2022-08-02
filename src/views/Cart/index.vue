<template>
  <!-- 顶部navbar -->
  <van-nav-bar
    title="购物车"
    left-arrow
    @click-left="onClickLeft"
  />
  <!-- 主体部分 -->
  <div class="cart-list" v-if="hasItem">
    <cart-item
      v-for="item in cartList"
      :key="item.id"
      :itemData="item"
    ></cart-item>
  </div>
  <!-- 当购物车为空时，显示 -->
  <van-empty v-else description="购物车还没有商品哦" />
  <!-- 下面不可以使用click事件 会由于冒泡而使得整个组件都会起到跳转作用 -->
  <van-submit-bar
    :price="store.getters['cart/sumPrice'] * 100"
    button-text="去结算"
    @submit="handleClick"
  >
    <van-checkbox v-model="checkedAll" checked-color="#ee0a24">全选</van-checkbox>
  </van-submit-bar>
  <layout-footer />
</template>

<script setup>
import {
  NavBar as VanNavBar,
  Empty as VanEmpty,
  SubmitBar as VanSubmitBar,
  Checkbox as VanCheckbox
} from 'vant'
import LayoutFooter from '@/components/LayoutFooter.vue'
import { useRouter } from 'vue-router'
import { getCartList } from '@/api/cart'
import { ref } from '@vue/reactivity'
import CartItem from './components/CartItem.vue'
import { useStore } from 'vuex'
import { computed, nextTick } from '@vue/runtime-core'
const store = useStore()
const router = useRouter()
const onClickLeft = () => {
  return router.go(-1)
}

// 购物车数据
const cartList = computed(() => store.state.cart.cartList)
const hasItem = computed(() => cartList.value.length !== 0)

// 商品全选
const checkedAll = computed({
  get: () => store.getters['cart/checkedAll'],
  set (newValue) {
    store.commit('cart/changeChecked', { checked: newValue })
  }
})

// 获取购物车数据
const loadCartData = async () => {
  const { data } = await getCartList()
  if (data.status !== 200) { return }
  // 每次访问前先清空购物车中的数据再重新渲染
  store.commit('cart/clear')
  await nextTick()
  // 数据处理，将处理后需要的数据传输给 store 进行状态管理
  data.data.valid.forEach(item => {
    store.commit('cart/addToCart', {
      id: item.id,
      checked: true,
      image: item.productInfo.image,
      price: item.truePrice,
      count: item.cart_num,
      title: item.productInfo.store_name,
      stock: item.productInfo.stock,
      productId: item.product_id
    })
  })
}
loadCartData()

// 点击跳转到订单页面
const handleClick = () => {
  router.push({
    name: 'order-comfirm',
    params: {
      cartId: store.getters['cart/checkItems'].map(item => item.id).toString()
    }
  })
}
</script>

<style lang="scss" scoped>
.van-submit-bar {
  margin-bottom: 50px;
}

.cart-list {
  margin: 0 0 100px;
  background-color: #f2f2f2;
}
</style>
