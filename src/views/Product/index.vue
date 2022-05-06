<template>
  <div class="product-detail">
    <!-- 上方导航栏区域 -->
    <van-nav-bar
      left-arrow
      fixed
      @click-left="onClickLeft"
    />
    <van-tabs scrollspy color="#fbc546" width="375">
      <van-tab title="商品">
        <!-- 商品轮播图区域 -->
        <van-swipe :autoplay="3000" width="375" height="375">
          <van-swipe-item
            v-for="(item,index) in productImage"
            :key="index"
          >
            <img :src="item" alt="">
          </van-swipe-item>
        </van-swipe>
        <!-- 商品头部 -->
        <van-cell class="product-header" :border="false">
          <template #title>
            <div class="price">
              <span>￥{{storeInfo?.price}}</span>
              <van-icon name="share-o" size="20" class="share" />
            </div>            
            <div class="title">{{storeInfo?.store_name}}</div>
          </template>
          <template #label>
            <span>原价：￥{{storeInfo?.ot_price}}</span>
            <span>库存：{{storeInfo?.stock + storeInfo?.unit_name}}</span>
            <span>销量：{{storeInfo?.fsales}}</span>
          </template>
        </van-cell>
        <van-cell
          class="sku_window"
          is-link
          @click="showPopup"
        >
          <template #title>
            <span>已选择: {{ sku }}</span>
          </template>
        </van-cell>
        <van-popup
          v-model:show="specState.show"
          position="bottom"
          class="popup"
        >
          <van-cell-group>
            <!-- 商品头部 -->
            <van-cell class="popup-header">
              <img :src="specDetails?.image" alt="">
              <div class="info">
                <p class="title" v-text="storeInfo?.store_name"></p>
                <p class="price">￥{{ specDetails?.price }}</p>
                <p class="stock">库存：{{ specDetails?.stock }}</p>
              </div>
            </van-cell>
            <!-- 2.规格 -->
            <van-cell
              v-for="(attr,specIndex) in productAttr"
              :key="attr.id"
              class="spec"
            >
              <p v-text="attr.attr_name"></p>
              <span
                v-for="(item,index) in attr.attr_values"
                :key="index"
                class="tag"
                :class="{ active: specState.spec[specIndex] === item }"
                v-text="item"
                @click="handleActive(item,specIndex)"
              ></span>
            </van-cell>
            <!-- 3.数量按钮 -->
            <van-cell title="数量">
              <van-stepper v-model="specState.buyCount" :max="specDetails?.stock" />
            </van-cell>
          </van-cell-group>
        </van-popup>
      </van-tab>
      <van-tab title="评价" class="comment">
        <!-- 评价区域 -->
        <van-cell-group>
          <van-cell
          is-link
          :value="replyRate"
          :to="{
            name: 'comment',
            params: {
              productId
            } 
          }"
        >
          <template #title>
            <span>用户评价({{replyCount}})</span>
          </template>
        </van-cell>
        <!-- 评价列表 -->
        <comment-item
          v-if="replyCount !== 0"
          :reply="reply"
        ></comment-item>
        </van-cell-group>
      </van-tab>
      <van-tab title="推荐">
        <van-cell class="good-list">
          <p class="title">推荐商品</p>
          <van-grid :border="false" :column-num="3">
            <van-grid-item
              v-for="item in goodlistDatas"
              :key="item.id"
              :to="{
                name: 'product',
                params: {
                  productId: item.id
                }
              }"
            >
              <img :src="item.image" alt="">
              <p class="recommend-title" v-text="item.store_name"></p>
              <span class="recommend-price">￥{{item.price}}</span>
            </van-grid-item>
          </van-grid>
        </van-cell>
      </van-tab>
      <van-tab title="详情">
        <div class="description" v-html="storeInfo?.description"></div>
      </van-tab>
    </van-tabs>
    <!-- 下方操作图标区域 -->
    <van-action-bar z-index="9999">
      <van-action-bar-icon icon="chat-o" text="客服" color="#ee0a24" />
      <van-action-bar-icon icon="cart-o" text="购物车" />
      <van-action-bar-icon icon="star" text="已收藏" color="#ff5000" />
      <van-action-bar-button type="warning" text="加入购物车" />
      <van-action-bar-button type="danger" text="立即购买" />
    </van-action-bar>
  </div>
</template>

<script setup>
  import { onBeforeRouteUpdate, useRouter } from 'vue-router'
  
  import CommentItem from '@/components/CommentItem.vue'
  // 请求商品详情信息
  import { getProductDetails } from '@/api/product'
  import { reactive, ref } from '@vue/reactivity'
  import { computed } from '@vue/runtime-core'
  const { productId } = defineProps({
    productId: {
      type: String,
      required: true
    }
  })

  const onClickLeft = () => {
    return router.go(-1)
  }
  const router = useRouter()
  const productDetails = ref({})
  const initProductDetails = async (productId) => {
    const { data } = await getProductDetails(productId)
    if (data.status !== 200) {
      return router.push({
        name: 'home'
      })
    }
    productDetails.value = data.data
    // 初始化规格
    initSpec(data.data.productAttr)
    console.log(specState.spec)
  }

  initProductDetails(productId)

  // 1 商品详细信息
  const storeInfo = computed(() => productDetails.value?.storeInfo)
  // 轮播图
  const productImage = computed(() => storeInfo.value?.slider_image)
  // 2.评价信息
  // 2.1评价数
  const replyCount = computed(() => productDetails.value?.replyCount || 0)
  // 2.2好评率
  const replyChance = computed(() => productDetails.value?.replyChance || 0)
  const replyRate = computed(() => replyChance.value + '%好评率')
  
  // 2.3好评信息
  const reply = computed(() => productDetails.value?.reply)

  // 3.推荐商品
  const goodlistDatas = computed(() => productDetails.value.good_list)

  // 通过导航守卫监听路由变化
  onBeforeRouteUpdate((to) => {
    // 清除商品数据
    productDetails.value = {}
    // 回到顶部
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    // 重新根据商品id渲染数据
    initProductDetails(to.params.productId)
  })

  // 弹出层数据
  const productAttr = computed(() => productDetails.value.productAttr)
  const productValue = computed(() => productDetails.value.productValue)
  const sku = computed(() => specState.spec.toString())
  console.log(sku)
  const specDetails = computed(() => productValue.value?.[sku.value])
  console.log(specDetails)

  // 弹出层处理
  const specState = reactive({
    show: false,
    spec: [],
    buyCount: 0
  })

  // 弹出层显示或隐藏
  const showPopup = () => {
    specState.show = !specState.show
  }

  // 初始化规格
  const initSpec = (spec) => {
    specState.spec = spec.map(item => item.attr_value[0].attr)
  }
  // 规格切换处理
  const handleActive = (item,specIndex) => {
    specState.spec[specIndex] = item
  }
</script>

<style lang="scss" scoped>
.van-tabs {
  background-color: #f2f2f2;

  :deep(.van-tabs__wrap) {
  position: fixed;
  top: 0;
  width: 80%;
  z-index: 999;
  left: 50%;
  transform: translateX(-50%);
  }

  :deep(.van-tabs__content) {
    padding-top: 46px;
    padding-bottom: 30px;
  }

  :deep(.van-tab-2) {
    width: 100%;
  }
  :deep(.van-swipe-item) {
    img {
      width: 375px;
      height: 375px;
    }
  }

  :deep(.product-header) {
    margin-bottom: 10px;

    .price span {
      font-size: 26px;
      font-weight: 700;
    }

    .share {
      float: right;
    }

    .title {
      font-size: 16px;
      font-weight: 700;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      overflow: hidden;
      -webkit-box-orient: vertical;
      margin: 5px 0 10px;
    }

    .van-cell__label {
      display: flex;
      justify-content: space-between;
    }
  }

  .sku_window {
    margin-bottom: 10px;
  }

  // 推荐商品
  :deep(.good-list) {
    margin-bottom: 10px;

    .title {
      font-size: 16px;
      font-weight: 700;
      padding: 5px 0;
    }
    .van-grid-item {
      .van-grid-item__content {
        padding: 0;
      }

      img {
        width: 107px;
        height: 107px;
      }

      .recommend-title {
        font-size: 14px;
        font-weight: 700;
        padding: 0 3px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2;
      }

      .recommend-price {
        font-size: 12px;
        font-weight: 700;
        color: #f2270c;
        align-self: flex-start;
      }
    }
  }

  // 详情
  .description {
    width: 100%;

    :deep(img) {
      width: 100%;
    }
  }

  // 弹出层
  :deep(.van-popup) {
    max-height: 70%;
    border-radius: 10px 10px 0 0;
    margin-bottom: 50px;

    // 弹框头部
    .popup-header {
      .van-cell__value {
        display: flex;

        img {
          width: 75px;
          height: 75px;
          align-self: center;
        }

        .info {
          padding: 10px;

          .title {
            font-size: 16px;
            font-weight: 700;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            margin-bottom: 10px;
          }

          .price {
            font-size: 16px;
            color: #f2270c
          }

          .stock {
            font-size: 12px;
            color: #999;
          }
        }
      }
    }

    // 规格区域
    .spec {
      p {
        margin-bottom: 5px;
      }
      .tag {
        display: inline-block;
        min-width: 25px;
        padding: 0 12px;
        border: 1px solid #ccc;
        border-radius: 20px;
        text-align: center;
        background-color: #f2f2f2;
        margin-right: 10px;
      }

      .tag.active {
        border-color: #f2270c;
        color:#f2270c;
        background-color: #fcedeb;
      }
    }
  }
}
</style>