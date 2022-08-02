<template>
  <van-nav-bar left-arrow title="新增收货地址"></van-nav-bar>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <!-- 姓名区域 -->
      <van-field
        v-model="real_name"
        name="姓名"
        label="姓名"
        placeholder="收货人姓名"
      />
      <!-- 电话区域 -->
      <van-field
        v-model="phone"
        name="电话"
        label="电话"
        placeholder="收货人手机号"
      />
      <!-- 地址区域 -->
      <van-field
        v-model="fieldValue"
        is-link
        readonly
        label="地区"
        placeholder="请选择所在地区"
        @click="show = true"
      />
      <van-popup v-model:show="show" round position="bottom">
        <van-cascader
          v-model="area"
          title="请选择所在地区"
          :options="options"
          @close="show = false"
          @finish="onFinish"
          :field-names="fieldNames"
        />
      </van-popup>
      <!-- 详细地址 -->
      <van-field
        v-model="detail"
        name="详细地址"
        label="详细地址"
        placeholder="详细地址信息"
      />
    </van-cell-group>
    <!-- 默认地址开关 -->
    <van-cell-group inset>
      <van-cell center title="设置默认地址">
        <template #right-icon>
          <van-switch v-model="isDefault" size="24" />
        </template>
      </van-cell>
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button
        round
        block
        type="primary"
        native-type="submit"
        @click="handleAdd"
      >
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup>
import {
  NavBar as VanNavBar,
  Form as VanForm,
  CellGroup as VanCellGroup,
  Field as VanField,
  Popup as VanPopup,
  Cascader as VanCascader,
  Cell as VanCell,
  Switch as VanSwitch,
  Button as VanButton
} from 'vant'
import { ref } from "@vue/reactivity"
import { getCityList, addOrEditAddress } from '@/api/address'
import { useRouter } from "vue-router";

const router = useRouter()
// 1.数据处理
const real_name = ref('')
const phone = ref('')
const area = ref('')
const detail = ref('')
const isDefault = ref(false)
const onSubmit = () => {
  console.log(1)
}
const show = ref(false)
const fieldValue = ref('')
// 选项列表，children 代表子选项，支持多级嵌套
const options = ref([
  // {
  //   text: '浙江省',
  //   value: '330000',
  //   children: [{ text: '杭州市', value: '330100' }],
  // },
  // {
  //   text: '江苏省',
  //   value: '320000',
  //   children: [{ text: '南京市', value: '320100' }],
  // },
])
// 全部选项选择完毕后，会触发 finish 事件
const onFinish = ({ selectedOptions }) => {
  show.value = false
  fieldValue.value = selectedOptions.map((option) => option.n).join('/')
  address = {
    province: selectedOptions[0].n,
    city: selectedOptions[1].n,
    city_id: selectedOptions[1].v,
    district: selectedOptions[2].n
  }
}

// 2.获取数据
const fieldNames = {
  text: 'n',
  value: 'v',
  children: 'c'
}

// 处理数据
const processData = data => {
  data.forEach(item => {
    if (item.c.length === 0) {
      delete item.c
    } else {
      processData(item.c)
    }
  })
  return data
}
const initCityList = async () => {
  const { data } = await getCityList()
  if (data.status !== 200) { return }
  console.log(data)
  options.value = processData(data.data)
}

initCityList()

// 发送新增地址数据
let address = { }

// 接收购物车id
const { cartId, id } = defineProps({
  cartId: {
    type: String
  },
  id: {
    type: Number
  }
})

const handleAdd = async () => {
  const { data } = await addOrEditAddress({
    // 新增时 id 默认为 0
    id: id || 0,
    real_name: real_name.value,
    detail: detail.value,
    is_default: isDefault.value,
    phone: phone.value,
    address
  })
  if (data.status !== 200) { return }
  if (cartId) {
    router.push({
      name: 'order-comfirm',
      params: {
        cartId
      }
    })
  } else {
    router.push({
      name: 'user'
    })
  }
  console.log(data)
}
</script>

<style lang="scss" scoped>
.van-form {
  background-color: #f7f7f7;

  .van-cell-group {
    margin-bottom: 10px;
  }
}
</style>