<template>
  <view class="user-container">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-info">
        <image class="avatar" src="/static/avatar.png" mode="aspectFill"></image>
        <view class="info-content">
          <text class="username">{{userInfo.name}}</text>
          <text class="dept">{{userInfo.deptName}}</text>
        </view>
      </view>
      <view class="account-info">
        <text class="phone">{{formatPhone(userInfo.phone)}}</text>
        <text class="role-tag">{{userInfo.roleName}}</text>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="menu-list">
      <!-- 账户安全 -->
      <view class="menu-group">
        <view class="group-title">账户安全</view>
        <view class="menu-item" @tap="changePassword">
          <text class="item-name">修改密码</text>
          <text class="arrow">></text>
        </view>
      </view>

      <!-- 操作记录 -->
      <view class="menu-group">
        <view class="group-title">操作记录</view>
        <view class="menu-item" @tap="navigateTo('records')">
          <text class="item-name">提交记录</text>
          <text class="count-tag">{{recordCount}}</text>
          <text class="arrow">></text>
        </view>
        <view class="menu-item" @tap="navigateTo('approvals')">
          <text class="item-name">审批历史</text>
          <text class="arrow">></text>
        </view>
      </view>

      <!-- 系统设置 -->
      <view class="menu-group">
        <view class="group-title">系统设置</view>
        <view class="menu-item">
          <text class="item-name">通知设置</text>
          <switch 
            :checked="notificationEnabled"
            @change="toggleNotification"
          />
        </view>
        <view class="menu-item" @tap="clearCache">
          <text class="item-name">清除缓存</text>
          <text class="cache-size">{{cacheSize}}</text>
          <text class="arrow">></text>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <button class="logout-btn" @tap="handleLogout">退出登录</button>

    <!-- 修改密码弹窗 -->
    <view class="password-modal" v-if="showPasswordModal">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">修改密码</text>
          <text class="close-btn" @tap="closePasswordModal">×</text>
        </view>
        <view class="form-item">
          <text class="label">验证码</text>
          <view class="verify-input">
            <input 
              type="number"
              maxlength="6"
              v-model="verifyCode"
              placeholder="请输入验证码"
            />
            <button 
              class="verify-btn"
              :disabled="counting"
              @tap="sendVerifyCode"
            >{{counting ? `${countdown}s` : '获取验证码'}}</button>
          </view>
        </view>
        <view class="form-item">
          <text class="label">新密码</text>
          <input 
            type="password"
            v-model="newPassword"
            placeholder="请输入新密码"
          />
        </view>
        <view class="form-item">
          <text class="label">确认密码</text>
          <input 
            type="password"
            v-model="confirmPassword"
            placeholder="请再次输入新密码"
          />
        </view>
        <button 
          class="submit-btn"
          :disabled="!isPasswordValid"
          @tap="submitPassword"
        >确认修改</button>
      </view>
    </view>

    <!-- Toast提示 -->
    <pd-toast ref="toast" />
  </view>
</template>

<script>
import PdToast from '@/components/pd-toast/pd-toast'

export default {
  components: {
    PdToast
  },

  data() {
    return {
      // 用户信息
      userInfo: {
        name: '张三',
        phone: '13800138000',
        deptName: '磨房',
        roleName: '生产部门'
      },

      // 统计数据
      recordCount: 0,
      cacheSize: '0MB',

      // 设置状态
      notificationEnabled: true,

      // 修改密码
      showPasswordModal: false,
      verifyCode: '',
      newPassword: '',
      confirmPassword: '',
      counting: false,
      countdown: 60
    }
  },

  computed: {
    isPasswordValid() {
      return this.verifyCode.length === 6 &&
             this.newPassword.length >= 6 &&
             this.newPassword === this.confirmPassword
    }
  },

  methods: {
    // 格式化手机号
    formatPhone(phone) {
      return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    },

    // 发送验证码
    async sendVerifyCode() {
      if(this.counting) return
      
      try {
        // TODO: 调用发送验证码API
        await new Promise(resolve => setTimeout(resolve, 500))
        
        this.counting = true
        this.countdown = 60
        
        const timer = setInterval(() => {
          this.countdown--
          if(this.countdown <= 0) {
            clearInterval(timer)
            this.counting = false
          }
        }, 1000)
        
        this.$refs.toast.show({
          type: 'success',
          message: '验证码已发送'
        })
      } catch(e) {
        this.$refs.toast.show({
          type: 'error',
          message: '发送失败'
        })
      }
    },

    // 提交新密码
    async submitPassword() {
      if(!this.isPasswordValid) return
      
      try {
        // TODO: 调用修改密码API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.$refs.toast.show({
          type: 'success',
          message: '密码修改成功'
        })
        
        this.closePasswordModal()
      } catch(e) {
        this.$refs.toast.show({
          type: 'error',
          message: '修改失败'
        })
      }
    },

    // 切换通知状态
    async toggleNotification(e) {
      this.notificationEnabled = e.detail.value
      // TODO: 保存设置
    },

    // 清除缓存
    async clearCache() {
      try {
        uni.showLoading({ title: '清理中' })
        // TODO: 清除本地缓存
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.cacheSize = '0MB'
        this.$refs.toast.show({
          type: 'success',
          message: '清理完成'
        })
      } catch(e) {
        this.$refs.toast.show({
          type: 'error',
          message: '清理失败'
        })
      } finally {
        uni.hideLoading()
      }
    },

    // 退出登录
    handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if(res.confirm) {
            // TODO: 清除登录状态
            uni.reLaunch({ url: '/pages/login/login' })
          }
        }
      })
    },

    // 页面跳转
    navigateTo(page) {
      uni.navigateTo({ url: `/pages/user/${page}` })
    },

    // 打开修改密码弹窗
    changePassword() {
      this.showPasswordModal = true
    },

    // 关闭修改密码弹窗
    closePasswordModal() {
      this.showPasswordModal = false
      this.verifyCode = ''
      this.newPassword = ''
      this.confirmPassword = ''
    }
  },

  onShow() {
    // 获取缓存大小
    uni.getStorageInfo({
      success: (res) => {
        this.cacheSize = (res.currentSize / 1024).toFixed(2) + 'MB'
      }
    })
    
    // 获取记录数量
    this.recordCount = 12 // TODO: 从后端获取
  }
}
</script>

<style>
.user-container {
  min-height: 100vh;
  background: #f8f8f8;
  padding-bottom: 40rpx;
}

/* 用户信息卡片 */
.user-card {
  background: #fff;
  padding: 40rpx 30rpx;
  margin-bottom: 20rpx;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.info-content {
  flex: 1;
}

.username {
  font-size: 36rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 8rpx;
  display: block;
}

.dept {
  font-size: 28rpx;
  color: #666;
}

.account-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.phone {
  font-size: 28rpx;
  color: #999;
}

.role-tag {
  background: #e6f7ff;
  color: #1890ff;
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

/* 功能列表 */
.menu-list {
  background: #fff;
  margin-bottom: 40rpx;
}

.menu-group {
  padding: 0 30rpx;
}

.group-title {
  font-size: 28rpx;
  color: #999;
  padding: 20rpx 0;
}

.menu-item {
  display: flex;
  align-items: center;
  height: 100rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.item-name {
  flex: 1;
  font-size: 32rpx;
  color: #333;
}

.count-tag {
  background: #ff4d4f;
  color: #fff;
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  margin-right: 12rpx;
}

.cache-size {
  font-size: 28rpx;
  color: #999;
  margin-right: 12rpx;
}

.arrow {
  font-size: 32rpx;
  color: #999;
}

/* 退出按钮 */
.logout-btn {
  width: 90%;
  height: 90rpx;
  line-height: 90rpx;
  background: #ff4d4f;
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
  margin: 0 auto;
}

/* 修改密码弹窗 */
.password-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.modal-title {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.close-btn {
  font-size: 40rpx;
  color: #999;
  padding: 10rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 12rpx;
  display: block;
}

.verify-input {
  display: flex;
  gap: 20rpx;
}

.verify-input input {
  flex: 1;
  height: 80rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

.verify-btn {
  width: 200rpx;
  height: 80rpx;
  line-height: 80rpx;
  background: #1890ff;
  color: #fff;
  font-size: 28rpx;
  border-radius: 8rpx;
  margin: 0;
}

.verify-btn[disabled] {
  opacity: 0.5;
}

.submit-btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background: #1890ff;
  color: #fff;
  font-size: 32rpx;
  border-radius: 40rpx;
  margin: 0;
}

.submit-btn[disabled] {
  opacity: 0.5;
}
</style> 