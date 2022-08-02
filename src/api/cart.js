import request from '@/utils/request'

// 加入购物车请求
export const addCart = data => request({
  method: 'POST',
  url: '/cart/add',
  data
})

// 获取购物车数据接口
export const getCartList = params => request({
  method: 'GET',
  url: '/cart/list',
  params
})

// 修改商品个数
export const changeCartNum = data => request({
  method: 'POST',
  url: '/cart/num',
  data
})
