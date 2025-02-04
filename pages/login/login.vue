<template>
  <view class="login-container">
    <!-- Logo区域 -->
    <view class="logo-section">
      <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
      <text class="app-name">平德管理系统</text>
    </view>

    <!-- 登录表单区域 -->
    <view class="form-section">
      <!-- 手机号输入 -->
      <view class="input-group">
        <text class="label">手机号</text>
        <input 
          class="input" 
          type="number" 
          maxlength="11"
          placeholder="请输入手机号"
          v-model="phone"
          @input="validatePhone"
        />
      </view>

      <!-- 验证码输入 -->
      <view class="input-group">
        <text class="label">验证码</text>
        <view class="code-input-wrap">
          <view 
            class="code-input-box" 
            v-for="(item, index) in 6" 
            :key="index"
            @tap="focusCodeInput"
          >
            <text class="code-number">{{verifyCode[index] || ''}}</text>
          </view>
          <input
            class="code-input"
            type="number"
            maxlength="6"
            v-model="verifyCode"
            @input="onCodeInput"
            ref="codeInput"
          />
        </view>
      </view>

      <!-- 获取验证码按钮 -->
      <view class="verify-btn-wrap">
        <button 
          class="verify-btn"
          :disabled="!isPhoneValid || counting"
          :class="{'btn-disabled': !isPhoneValid || counting}"
          @tap="getVerifyCode"
        >
          {{counting ? `${counter}s后重试` : '获取验证码'}}
        </button>
      </view>

      <!-- 登录按钮 -->
      <button 
        class="login-btn"
        :disabled="!canLogin"
        :class="{'btn-disabled': !canLogin}"
        @tap="handleLogin"
      >
        登录
      </button>
    </view>

    <!-- 底部版权信息 -->
    <view class="footer">
      <text class="copyright">Copyright © 2024 平德科技</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      phone: '',
      verifyCode: '',
      isPhoneValid: false,
      counting: false,
      counter: 60,
      timer: null,
      failCount: 0
    }
  },
  computed: {
    canLogin() {
      return this.isPhoneValid && this.verifyCode.length === 6
    }
  },
  onLoad() {
    // 获取缓存的手机号
    const cachedPhone = uni.getStorageSync('lastPhone')
    if(cachedPhone) {
      this.phone = cachedPhone
      this.validatePhone()
    }
  },
  methods: {
    validatePhone() {
      const phoneReg = /^1[3-9]\d{9}$/
      this.isPhoneValid = phoneReg.test(this.phone)
    },
    
    focusCodeInput() {
      this.$refs.codeInput.focus()
    },
    
    onCodeInput(e) {
      // 限制只能输入数字
      this.verifyCode = e.detail.value.replace(/\D/g, '')
      
      // 验证码输满6位自动登录
      if(this.verifyCode.length === 6) {
        this.handleLogin()
      }
    },
    
    getVerifyCode() {
      if(!this.isPhoneValid || this.counting) return
      
      // 开始倒计时
      this.counting = true
      this.counter = 60
      this.timer = setInterval(() => {
        if(this.counter > 0) {
          this.counter--
        } else {
          this.counting = false
          clearInterval(this.timer)
        }
      }, 1000)
      
      // 调用发送验证码接口
      uni.showLoading({title: '发送中'})
      // TODO: 对接验证码发送接口
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '验证码已发送',
          icon: 'none'
        })
      }, 1000)
    },
    
    async handleLogin() {
      if(!this.canLogin) return
      
      try {
        uni.showLoading({title: '登录中'})
        // TODO: 对接登录接口
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 登录成功
        uni.setStorageSync('lastPhone', this.phone)
        this.failCount = 0
        uni.hideLoading()
        uni.reLaunch({
          url: '/pages/index/index'
        })
      } catch(e) {
        this.failCount++
        this.verifyCode = ''
        uni.hideLoading()
        
        if(this.failCount >= 3) {
          // 失败超过3次,锁定1小时
          uni.showModal({
            title: '提示',
            content: '登录失败次数过多,请1小时后再试',
            showCancel: false
          })
          return
        }
        
        uni.showToast({
          title: '登录失败,请重试',
          icon: 'none'
        })
      }
    }
  },
  onUnload() {
    // 清除定时器
    if(this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>

<style>
.login-container {
  min-height: 100vh;
  padding: 0 40rpx;
  background: #fff;
}

.logo-section {
  height: 20vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 0;
}

.logo {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 20rpx;
}

.app-name {
  font-size: 36rpx;
  color: #333;
  font-weight: bold;
}

.form-section {
  padding: 60rpx 0;
}

.input-group {
  margin-bottom: 40rpx;
}

.label {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
  display: block;
}

.input {
  height: 90rpx;
  background: #f8f8f8;
  border-radius: 45rpx;
  padding: 0 40rpx;
  font-size: 32rpx;
}

.code-input-wrap {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.code-input-box {
  width: 80rpx;
  height: 80rpx;
  border: 2rpx solid #ddd;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.code-number {
  font-size: 36rpx;
  color: #333;
}

.code-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.verify-btn-wrap {
  margin: 40rpx 0;
}

.verify-btn {
  height: 80rpx;
  line-height: 80rpx;
  background: #3cc51f;
  color: #fff;
  font-size: 28rpx;
  border-radius: 40rpx;
}

.login-btn {
  height: 90rpx;
  line-height: 90rpx;
  background: #3cc51f;
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
  margin-top: 60rpx;
}

.btn-disabled {
  opacity: 0.5;
}

.footer {
  position: fixed;
  left: 0;
  bottom: 40rpx;
  width: 100%;
  text-align: center;
}

.copyright {
  font-size: 24rpx;
  color: #999;
}
</style> 