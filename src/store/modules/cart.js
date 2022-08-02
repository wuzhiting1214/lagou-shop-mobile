import { changeCartNum } from '@/api/cart'

const state = {
  // 购物车信息(sku 的 id， checked， count， image， title， price， stock)
  cartList: []
}
const getters = {
  // 筛选选中的选项
  checkItems: state => {
    return state.cartList.filter(item => item.checked === true)
  },
  // 选中商品价格总和
  sumPrice (state, getters) {
    return getters.checkItems.reduce((sum, item) => sum + item.price * item.count, 0).toFixed(2)
  },
  // 全选
  checkedAll (state, getters) {
    return state.cartList.length === getters.checkItems.length
  }
}
const mutations = {
  // 添加商品
  addToCart (state, payload) {
    // payload 应该包含sku相关信息的对象
    state.cartList.push(payload)
  },
  // 清除数据
  clear (state) {
    state.cartList = []
  },
  // 商品状态更改
  checkedChange (state, { id, checked }) {
    const currentItem = state.cartList.find(item => item.id === id)
    currentItem.checked = checked
  },
  // 更改商品数量
  countChange (state, { id, count }) {
    state.cartList.find(item => item.id === id).count = count
  },
  // 更改全选状态
  changeChecked (state, { checked }) {
    state.cartList.forEach(item => item.checked = checked)
  }
}
const actions = {
  async countChange ({ commit }, payload) {
    commit('countChange', payload)
    const { data } = await changeCartNum({
      id: payload.id,
      number: payload.count
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
