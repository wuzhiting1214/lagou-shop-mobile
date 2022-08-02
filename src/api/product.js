import request from '@/utils/request'

// 获取商品列表
export const getProductsData = params => request({
  method: 'GET',
  url: '/products',
  params
})

// 获取商品详情
export const getProductDetails = productId => request({
  method: 'GET',
  url: `/product/detail/${productId}`
})

// 获取商品评论数量接口
export const getCommentCount = productId => request({
  method: 'GET',
  url: `/reply/config/${productId}`
})

// 请求不同类型的评论数据
export const getCommentByTag = (productId, params) => request({
  method: 'GET',
  url: `/reply/list/${productId}`,
  params
})
