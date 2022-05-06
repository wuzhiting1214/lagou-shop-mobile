<template>
  <div class="container">
    <div class="header">
      <img src="https://i-1-lanrentuku.52tup.com/2020/11/5/8cc3854a-c8bd-456a-8b36-9209de3ccbfb.png?imageView2/2/w/1024/" alt="">
      <div class="user-info">
        <div class="user-name">小吴</div>
        <div class="user-id">ID: 3</div>
      </div>
      <van-icon name="setting-o" size="24"></van-icon>
    </div>
    <div class="main">
      <van-cell-group inset class="user-detail">
        <van-cell>
          <van-grid :border="false">
            <van-grid-item text="1">
              <template #icon>收藏</template>
            </van-grid-item>
            <van-grid-item text="555">
              <template #icon>积分</template>
            </van-grid-item>
            <van-grid-item text="10">
              <template #icon>优惠券</template>
            </van-grid-item>
            <van-grid-item text="0">
              <template #icon>余额</template>
            </van-grid-item>
          </van-grid>
        </van-cell>
      </van-cell-group>
      <van-cell-group inset>
        <van-cell title="订单中心" value="查看全部" is-link to="/order" />
        <van-cell>
          <van-grid :border="false" column-num="5">
            <van-grid-item icon="bill-o" text="待付款" />
            <van-grid-item icon="tosend" text="待发货" />
            <van-grid-item icon="logistics" text="待收货" />
            <van-grid-item icon="comment-o" text="待评价" />
            <van-grid-item icon="sign" text="已完成" />
          </van-grid>
        </van-cell>
      </van-cell-group>
    </div>
    <layout-footer></layout-footer>  
  </div>  
</template>

<script setup>
import LayoutFooter from '@/components/LayoutFooter.vue'
import { getUserInfo } from '@/api/user'
import { ref } from '@vue/reactivity'

const userdata = ref({})

const loadUserData = async () => {
  const { data } = await getUserInfo()
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
