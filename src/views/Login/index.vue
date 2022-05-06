<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <img :src="state.logoUrl" alt="">
      <van-field
        v-model="state.username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        clearable
      />
      <van-field
        v-if="state.isPassword"
        v-model="state.password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        clearable
      />
      <van-field
        v-else
        v-model="state.captcha"
        name="验证码"
        label="短信验证码"
        placeholder="短信验证码"
        clearable
      >
        <template #button>
          <van-button
            size="small"
            type="primary"
            @click="sendVerify"
            :disabled="state.isSend"  
          >{{ state.currentText }}</van-button>
        </template>
      </van-field>
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        登录
      </van-button>
      <span
        v-text="state.changeText"
        class="change-button"
        @click="changeMode"  
      ></span>
    </div>
  </van-form>
</template>

<script setup>
import { reactive } from "@vue/reactivity"
import { computed } from "@vue/runtime-core"
import { getVerifyCode, getVerify, loginByPassword, loginByCapcha } from '@/api/user'
import { Toast } from "vant"
import { useCountDown } from '@vant/use'
import { useStore } from 'vuex'
import { useRouter, useRoute } from "vue-router"
import { getLogo } from '@/api/index'

const store = useStore()
const router = useRouter()
const route = useRoute()

// 登录数据处理
const state = reactive({
  loginMode: 'password',
  isPassword: computed(() => state.loginMode === 'password'),
  username: '',
  password: '',
  captcha: '',
  changeText: '快速登录',
  isSend: false,
  countDown: null,
  currentText: computed(() => state.isSend ? state.countDown.seconds + 's后再试' : '发送验证码'),
  logoUrl: ''
})

const changeMode = () => {
  state.loginMode = state.isPassword ? 'captcha' : 'password'
  state.changeText = state.isPassword ? '快速登录' : '密码登录'
  state.password = ''
  state.captcha = ''
}

// 登录处理
const onSubmit = async () => {
  const username = state.username.trim()
  if (username === '') {
    return Toast('请输入用户名')
  }

  let data = ''
  if (state.isPassword) {
    const password = state.password.trim()
    if (password === '') {
      return Toast('请输入密码')
    }
    ({ data } = await loginByPassword({
      account: username,
      password
    }))
  } else {
    const captcha = state.captcha.trim()
    if (captcha === '') {
      return Toast('请输入验证码')
    }
    ({ data } = await loginByCapcha({
      phone: username,
      captcha
    }))
  }
  if (data.status !== 200) {
    return Toast('用户名或密码错误')
  }
  // 将信息存储到store中
  Toast('登录成功')
  store.commit('setUser', data.data.token)  
  router.push('/user')
}

// 验证码
const sendVerify = async () => {
  // 手机号校验规则
  if (!/1\d{10}$/.test(state.username)) {
    return Toast('请检查用户名')
  }
  const { data: v1 } = await getVerifyCode()
  if (v1.status !== 200) return

  const { data: v2 } = await getVerify({
    type: 'login',
    phone: state.username,
    key: v1.data.key
  })
  if (v2.status !== 200) {
    return Toast('网络出小差了，请稍后再试')    
  }
  const countDown = useCountDown({
    time: 10 * 1000,
    onFinish () {
      state.isSend = false
    }
  })
  countDown.start()
  state.countDown = countDown.current
  state.isSend = true
}

// 获取logo图
const loadLogo = async () => {
  const { data } = await getLogo()
  if (data.status !== 200) { return }
  state.logoUrl = data.data.logo_url.replace('lagou', 'lagounews')
}
loadLogo()

</script>

<style lang="scss" scoped>
.van-cell-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 100%;
    align-self: center;
    margin: 70px 0 20px;
  }
}
.change-button {
    display: block;
    text-align: center;
    font-size: 14px;
    color: #999;
    margin-top: 10px;
  }
</style>