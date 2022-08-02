<template>
  <div class="container">
    <div class="header">
      <img
        :src="userAvatar"
        alt=""
      >
      <div class="user-info">
        <div
          class="user-name"
          v-text="username"
        />
        <div
          class="user-id"
          v-text="userId"
        />
      </div>
      <van-icon
        name="setting-o"
        size="24"
      />
    </div>
    <div class="main">
      <van-cell-group
        inset
        class="user-detail"
      >
        <van-cell>
          <van-grid :border="false">
            <van-grid-item :text="collectCount">
              <template #icon>
                收藏
              </template>
            </van-grid-item>
            <van-grid-item :text="integral">
              <template #icon>
                积分
              </template>
            </van-grid-item>
            <van-grid-item :text="couponCount">
              <template #icon>
                优惠券
              </template>
            </van-grid-item>
            <van-grid-item :text="now_money">
              <template #icon>
                余额
              </template>
            </van-grid-item>
          </van-grid>
        </van-cell>
      </van-cell-group>
      <van-cell-group inset>
        <van-cell
          title="订单中心"
          value="查看全部"
          is-link
          to="/order"
        />
        <van-cell>
          <van-grid
            :border="false"
            column-num="5"
            to="/order"
          >
            <van-grid-item
              icon="bill-o"
              text="待付款"
              :to="{
                name: 'order',
                params: {
                  typeNum: 0
                }
              }"
            />
            <van-grid-item
              icon="tosend"
              text="待发货"
              :to="{
                name: 'order',
                params: {
                  typeNum: 1
                }
              }"
            />
            <van-grid-item
              icon="logistics"
              text="待收货"
              :to="{
                name: 'order',
                params: {
                  typeNum: 2
                }
              }"
            />
            <van-grid-item
              icon="comment-o"
              text="待评价"
              :to="{
                name: 'order',
                params: {
                  typeNum: 3
                }
              }"
            />
            <van-grid-item
              icon="sign"
              text="已完成"
              :to="{
                name: 'order',
                params: {
                  typeNum: 4
                }
              }"
            />
          </van-grid>
        </van-cell>
      </van-cell-group>
    </div>
    <layout-footer />
  </div>
</template>

<script setup>
import {
  Icon as VanIcon,
  CellGroup as VanCellGroup,
  Cell as VanCell,
  Grid as VanGrid,
  GridItem as VanGridItem,
} from 'vant'
import LayoutFooter from '@/components/LayoutFooter.vue'
import { getUserInfo } from '@/api/user'
import { ref } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'

const userdata = ref({})
// 用户头像
const userAvatar = computed(() => userdata.value?.switchUserInfo?.[0].avator || 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi-1.lanrentuku.com%2F2020%2F11%2F5%2Fdef6ed04-6d34-402e-99c8-366266f627dd.png%3FimageView2%2F2%2Fw%2F500&refer=http%3A%2F%2Fi-1.lanrentuku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654442915&t=3ca554dc0601995db249e49d7755af0d')
// 用户昵称
const username = computed(() => userdata.value?.nickname || '')
// 用户id
const userId = computed(() => 'ID: ' + (userdata.value?.uid || ''))
// 收藏
const collectCount = computed(() => userdata.value?.collectCount?.toString() || '')
// 积分
const integral = computed(() => userdata.value?.integral?.toString() || '')
// 优惠券
const couponCount = computed(() => userdata.value?.couponCount?.toString() || '')
// 余额
const now_money = computed(() => userdata.value?.now_money || '')

const loadUserData = async () => {
  const { data } = await getUserInfo()
  userdata.value = data.data
  console.log(data)
}
loadUserData()
</script>

<style lang="scss" scoped>
.container {
  padding: 15px 0;
  height: 600px;
  background: radial-gradient(circle at 50% -10%, #fbc546 72%, #f6f7f9 72%) #f6f7f9 0 -300px no-repeat;

  .header {
    padding: 0 15px 15px;
    display: flex;
    align-items: center;

    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 10px;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;

      .user-name {
        font-size: 14px;
        font-weight: 700;
        padding-bottom: 10px;
      }

      .user-id  {
        font-size: 10px;
      }
    }
  }

  .main {
    .van-cell-group {
      margin-bottom: 10px;
    }
    .user-detail {
      .van-cell {
        padding: 0;
        // 避免内容没有加载出来时造成短暂的塌陷
        min-width: 74px;
      }
    }
  }
}
</style>
