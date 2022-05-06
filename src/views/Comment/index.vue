<template>
  <van-cell-group class="comment">
    <!-- 总体评价情况 -->
    <van-nav-bar
      title="商品评价"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    <van-cell
      class="header"
      title="商品评价"
      :value="`好评率: ${ state.reply_chance }%`"
    ></van-cell>
    <!-- 标签切换区域 -->
    <van-cell class="tags">
      <van-button
        size="small"
        :class="{ active: state.isSum }"
        @click="handleTag('0')"
      >全部({{ state.sum_count }})</van-button>
      <van-button
        size="small"
        :class="{ active: state.isGood }"
        @click="handleTag('1')"
      >好评({{ state.good_count }})</van-button>
      <van-button
        size="small"
        :class="{ active: state.isIn }"
        @click="handleTag('2')"
      >中评({{ state.in_count }})</van-button>
      <van-button
        size="small"
        :class="{ active: state.isPoor }"
        @click="handleTag('3')"
      >差评({{ state.poor_count }})</van-button>
    </van-cell>
    <!-- 评价列表 -->
    <div v-if="state.hasComment" class="content">
      <comment-item
        v-for="item in state.commentList"
        :key="item.id"
        :reply="item"
      ></comment-item>
    </div>
    <!-- 当没有评价时，进行空结构展示 -->
    <van-empty v-else description="暂时没有评价" class="content"/>
  </van-cell-group>
</template>

<script setup>
import CommentItem from '@/components/CommentItem.vue'
import { useRouter } from 'vue-router'
import { getCommentCount, getCommentByTag} from '@/api/product'
import { reactive } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'
const router = useRouter()
const { productId } = defineProps({
  productId: {
    type: String,
    required: true
  }
})
// 导航栏返回
const onClickLeft = () => {
  return router.go(-1)
}
// 存储评论相关信息
const state = reactive({
  // 存储所有个数信息
  commentCounts: {},
  // 好评个数
  good_count: computed(() => state.commentCounts?.good_count || 0),
  in_count: computed(() => state.commentCounts?.in_count || 0),
  poor_count: computed(() => state.commentCounts?.poor_count || 0),
  sum_count: computed(() => state.commentCounts?.sum_count || 0),
  reply_chance: computed(() => state.commentCounts?.reply_chance || 100),
  // 存储评价信息
  commentList: [],
  // 控制评价显示状态
  active: '0',
  // 通过计算属性，来进行不同类型状态的判断
  isSum: computed(() => state.active === '0'),
  isGood: computed(() => state.active === '1'),
  isIn: computed(() => state.active === '2'),
  isPoor: computed(() => state.active === '3'),
  // 是否有评价
  hasComment: computed(() => state.commentList.length || 0)
})
// 切换评价的类型
  const handleTag = (typeNum) => {
    state.active = typeNum
    initReplyByTag(typeNum)
  }

// 获取评价数量
async function initReplyDatas () {
  const { data } = await getCommentCount(productId)
  if (data.status !== 200) return
  state.commentCounts = data.data
}
initReplyDatas()

// 根据类型获取评价数据
async function initReplyByTag (type) {
  const { data } = await getCommentByTag(productId, { type })
  if (data.status !== 200) return
  state.commentList = data.data
  console.log(state.commentList)
}
initReplyByTag ('0')
</script>

<style lang="scss" scoped>
.van-button {
  border-radius: 15px;
  margin-right: 10px;
}

.active {
  background-color: #fac143;
}

.header {
  position: fixed;
  top: 46px;
  z-index: 1000;
}

.tags {
  position: fixed;
  top: 90px;
  z-index: 1000;
}

.content {
  position: relative;
  top: 143px;
}
</style>