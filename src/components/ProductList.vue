<template>
  <van-grid
    class="product-list"
    :border="false"
    :column-num="2"
    :gutter="10"
    :center="false"
  >
    <van-grid-item
      v-for="item in productDatas"
      :key="item.id"
      :to="{
        name: 'product',
        params: {
          productId: item.id
        }
      }"
    >
      <van-image :src="item.image" />
      <p class="title" v-text="item.store_name"></p>
      <p class="price">￥{{item.price}}</p>
      <p class="sales">已售{{item.sales}}件</p>
    </van-grid-item>
  </van-grid>
</template>

<script setup>
  const { productDatas } = defineProps({
    productDatas: {
      type: Array,
      required: true
    }
  }) 

</script>

<style lang="scss" scoped>
.product-list {
  margin: 10px 0;

  :deep(.van-grid-item__content) {
    padding: 0;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;

    .title {
      font-size: 14px;
      padding: 8px 5px 0;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .price {
      color: #ee3e3e;
      font-size: 22px;
      font-weight: 700;
      padding-left: 6px;
    }

    .sales {
      font-size: 14px;
      color: #ccc;
      padding-left: 8px;
    }
  }
}
</style>