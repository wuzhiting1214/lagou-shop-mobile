<template>
  <van-cell class="comment-item">
    <!-- 1.用户信息 -->
    <div class="userinfo">
      <img :src="reply?.avatar" alt="">
      <span class="username">{{reply?.nickname}}</span>
      <van-rate v-model="star" readonly size="12"></van-rate>
    </div>
    <!-- 2.评价时间与规格 -->
    <p class="time">{{reply?.add_time}} {{reply?.sku}}</p>
    <!-- 3.评价内容 -->
    <p class="content">{{reply?.comment}}</p>
    <!-- 4.评价图片 -->
    <ul class="picture" v-if="reply?.pics">
      <li
        v-for="(item,index) in pics"
        :key="index"
      >
        <img :src="item" alt="">
      </li>
    </ul>
  </van-cell>
</template>

<script setup>
import { computed } from "@vue/runtime-core"


const { reply } = defineProps({
  reply: {
    type: Object,
    required: true
  }
})

const star = computed(() => Number(reply?.star))
const pics = computed(() => reply?.pics)
</script>

<style lang="scss" scoped>
.comment {
  margin-bottom: 10px;

  .comment-item {
    padding: 10px 15px 20px;

    .userinfo {
      font-size: 13px;
      display: flex;
      align-items: center;
      padding: 7px 0;

      img{
        width: 28px;
        height: 28px;
      }

      .username {
        padding: 0 10px 0 6px;
      }
    }

    .time {
      font-size: 12px;
      color: #82848f;
      padding: 5px 0;
    }

    .content {
      font-size: 13px;
      margin-bottom: 10px;
    }

    .picture {
      li {
        float: left;
        padding-right: 7px;
      }

      img {
        width: 78px;
        height: 78px;
      }
    }
  }
}
</style>