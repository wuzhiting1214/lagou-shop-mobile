<template>
  <div class="order-comfirm">
    <!-- 上方导航栏 -->
    <van-nav-bar left-arrow fixed title="订单确认" left-text="返回" @click="handleClick"/>
    <!-- 中间主体 -->
    <div class="container">
      <!-- 地址区域 -->
      <div class="address-card" @click="changeStatus">
        <p class="info">
          <span class="username" v-text="currentAddress.name"></span>
          <span class="phone" v-text="currentAddress.tel"></span>
        </p>
        <p class="detail">
          <span class="default" v-if="currentAddress.isDefault">[默认]</span>
          <span class="address" v-text="currentAddress.address"></span>
        </p>
      </div>
      <!-- 弹出层区域 -->
      <van-popup v-model:show="popupStatus" position="bottom">
        <van-address-list
          v-model="chosenAddressId"
          :list="addressList"
          @add="onAdd"
          @edit="onEdit"
          default-tag-text="默认"
          @click-item="changeAddress"
        >
          <template #top v-if="isEmpty">
            <van-empty description="没有可以使用的地址"></van-empty>
          </template>
        </van-address-list>
      </van-popup>
      <!-- 商品列表区域 -->
      <van-cell-group>
        <van-cell :title="cartCount"></van-cell>
        <van-cell-group class="product">
          <van-cell
            v-for="item in cartInfo"
            :key="item.id"
          >
            <img :src="item.productInfo.image" alt="">
            <div class="info">
              <p class="title" v-text="item.productInfo.store_name"></p>
              <p class="price">￥{{ item.truePrice }}</p>
            </div>
            <span class="count">×{{ item.cart_num }}</span>
          </van-cell>
        </van-cell-group>
      </van-cell-group>
    </div>
    <!-- 下方确认按钮 -->
    <van-submit-bar
      :price="totalPrice"
      label="订单总结："
      @submit="show = true"
      button-text="提交订单" />
      <!-- 付款弹窗 -->
    <van-action-sheet
      v-model:show="show"
      title="请选择支付方式"
      cancel-text="取消"
      close-on-click-action
    >
    <!-- 付款方式选择 -->
      <template #default>
        <van-radio-group v-model="payment">
          <van-cell-group inset>
            <!-- 微信支付 -->
            <van-cell
              clickable
              title="微信支付"
              label="微信快捷支付"
              @click="payment = 'wechat'"
              center
            >
              <template #icon>
                <van-icon
                  name="http://www.lgstatic.com/lg-app-fed/pay/images/wechat_b787e2f4.png"
                  size="36"
                  :style="{ marginRight: '12px' }"
                >
                </van-icon>
              </template>
              <template #right-icon>
                <van-radio
                  name="wechat"
                  checked-color="#ee0a24"
                />
              </template>
            </van-cell>
            <!-- 支付宝支付 -->
            <van-cell
              clickable
              title="支付宝"
              label="支付宝快捷支付"
              @click="payment = 'alipay'"
              center
            >
              <template #icon>
                <van-icon
                  name="http://www.lgstatic.com/lg-app-fed/pay/images/ali_ed78fdae.png"
                  size="36"
                  :style="{ marginRight: '12px' }"
                >
                </van-icon>
              </template>
              <template #right-icon>
                <van-radio
                  name="alipay"
                  checked-color="#ee0a24"
                />
              </template>
            </van-cell>
            <!-- 余额支付 -->
            <van-cell
              clickable
              title="余额支付"
              :label="`可用余额: ${ yue } 元`"
              @click="payment = 'yue'"
              center
            >
              <template #icon>
                <van-icon
                  name="gold-coin"
                  color="#ff9000"
                  size="36"
                  :style="{ marginRight: '12px' }"
                >
                </van-icon>
              </template>
              <template #right-icon>
                <van-radio
                  name="yue"
                  checked-color="#ee0a24"
                />
              </template>
            </van-cell>
            <van-cell>
              <van-button
                type="danger"
                round
                block
                @click="handlePay"
              >去支付</van-button>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </template>
    </van-action-sheet>
  </div>
</template>

<script setup>
import {
  NavBar as VanNavBar,
  Popup as VanPopup,
  AddressList as VanAddressList,
  Empty as VanEmpty,
  CellGroup as VanCellGroup,
  Cell as VanCell,
  SubmitBar as VanSubmitBar,
  ActionSheet as VanActionSheet,
  RadioGroup as VanRadioGroup,
  Button as VanButton,
  Icon as VanIcon,
  Radio as VanRadio
} from 'vant'
import { getAddressList } from '@/api/order'
import { ref } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
import { addOrEditAddress } from '@/api/address'
import { getOrderConfirmData, createOrder } from '@/api/order'

const router = useRouter()

// 导航返回
const handleClick = () => {
  router.go(-1)
}

// 弹出层
const popupStatus = ref(false)
const isEmpty = computed(() => addressList.value.length === 0)
const changeStatus = () => {
  popupStatus.value = true
}
// 选择的地址
const currentAddress = ref({})

const chosenAddressId = ref()
const changeAddress = item => {
  // 更改弹出层显示状态
  popupStatus.value = false
  // 更新当前选择的地址
  currentAddress.value = item
}

const convertData = data => {
  return data.map(item => {
    const temp = {
      id: item.id,
      name: item.real_name,
      tel: item.phone,
      address: item.province + item.city + item.district + item.detail,
      isDefault: item.is_default
    }

    // 判断地址是否为默认地址
    if (item.is_default === 1 ) {
      chosenAddressId.value = item.id
      currentAddress.value = temp
    }
    return temp
  })
}
const addressList = ref([
  // {
  //   id: '1',
  //   name: '张三',
  //   tel: '13000000000',
  //   address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室',
  //   isDefault: true,
  // },
  // {
  //   id: '2',
  //   name: '李四',
  //   tel: '1310000000',
  //   address: '浙江省杭州市拱墅区莫干山路 50 号',
  // }
])

const { cartId, id } = defineProps({
  cartId: {
    type: String,
    required: true
  },
  id: {
    type: Number
  }
})

const onAdd = () => {
  router.push({
    name: 'address',
    params: {
      cartId
    }
  })
}
const onEdit = async (item, index) => {
  router.push({
    name: 'address',
    params: {
      cartId,
      id: item.id
    }
  })
  const { data } = await getAddressList({
    id: item.id
  })
}

const loadAddressList = async () => {
  const { data } = await getAddressList({
    limit: 5,
    page: 1
  })
  if (data.status !== 200) { return }
  addressList.value = convertData(data.data)
}
loadAddressList()

// 获取确认订单信息
const orderConfirmData = ref({})
const cartInfo = computed(() => orderConfirmData.value?.cartInfo)
const cartCount = computed(() => `共${cartInfo.value?.length || 0}件`)
const totalPrice = computed(() => (orderConfirmData.value?.priceGroup?.totalPrice || 0) * 100)

const initOrderConfirm = async () => {
  const { data } = await getOrderConfirmData({
    cartId,
    new: 0
  })
  if (data.status !== 200) { return }
  orderConfirmData.value = data.data
}

initOrderConfirm()

// 付款弹出框
const show = ref(false)
const payment = ref('yue')
// 余额
const yue = computed(() => orderConfirmData.value?.userInfo.now_money || 0)
console.log(yue)
console.log(totalPrice)
// 支付
const handlePay = async () => {
  if (yue.value * 1 < (totalPrice.value / 100)) {
    Toast('余额不足，请充值')
    router.push('/cart')
    return
  }
  const { data } = await createOrder(orderConfirmData.value?.orderKey, {
      addressId: currentAddress.value?.id,
      payType: payment.value
    }
  )
  if (data.status !== 200) { return }
  Toast.success('支付成功，跳转到订单页面')
  router.push({
    name: 'order'
  })
}
</script>

<style lang="scss" scoped>
.container {
  padding: 50px 0;

  .address-card {
    padding: 20px 25px;
    font-size: 16px;
    font-weight: 500;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      background: repeating-linear-gradient(90deg, #ff6c6c 0, #ff6c6c 20%, transparent 20%, transparent 25%, #0084ff 25%, #0084ff 45%, transparent 45%, transparent 50%);
      background-size: 80px;
    }

    .info {
      .username {
        margin-right: 20px;
      }
    }

    .detail {
      margin-top: 5px;
      .default {
        font-size: 12px;
        background-color: #e3271c;
        color: #fff;
        padding: 3px;
        border-radius: 2px;
        margin-right: 20px;
      }
    }
  }

  // 产品区域
  .product {
    :deep(.van-cell__value) {
      display: flex;
      align-items: center;

      img {
        width: 80px;
        height: 80px;
      }

      .info {
        padding-left: 5px;
        
        .title {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          overflow: hidden;
          -webkit-box-orient: vertical;
          margin: 0 10px 5px;
        }

        .price {
          color: #f2270c;
        }
      }

      .count {
        color: #aaa;
      }
    }
  }
}
</style>
