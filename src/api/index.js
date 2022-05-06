import request from '@/utils/request'

export const getDafaultDate = () => request({
  method: 'GET',
  url: 'v2/diy/get_diy/moren'
})

// 请求 logo 图
export const getLogo = () => request({
  method: 'GET',
  url: '/wechat/get_logo'
})
