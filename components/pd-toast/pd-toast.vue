<template>
  <view 
    class="pd-toast"
    v-if="visible"
    :class="type"
  >
    <text class="toast-icon">{{icon}}</text>
    <text class="toast-text">{{message}}</text>
    <text 
      class="close-btn"
      v-if="showClose"
      @tap="close"
    >×</text>
  </view>
</template>

<script>
export default {
  name: 'PdToast',
  data() {
    return {
      visible: false,
      message: '',
      type: 'success',
      timer: null,
      showClose: false
    }
  },
  
  computed: {
    icon() {
      const icons = {
        success: '✓',
        warning: '!',
        error: '×'
      }
      return icons[this.type]
    }
  },
  
  methods: {
    show(options = {}) {
      this.message = options.message || ''
      this.type = options.type || 'success'
      this.visible = true
      this.showClose = this.type !== 'success'
      
      // 成功提示自动关闭
      if(this.type === 'success') {
        if(this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.close()
        }, 2000)
      }
    },
    
    close() {
      this.visible = false
      if(this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    }
  }
}
</script>

<style>
.pd-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  padding: 20rpx 40rpx;
  border-radius: 8rpx;
  background: rgba(0,0,0,0.7);
  z-index: 9999;
}

.pd-toast.success {
  background: rgba(82,196,26,0.9);
}

.pd-toast.warning {
  background: rgba(250,173,20,0.9);
}

.pd-toast.error {
  background: rgba(255,77,79,0.9);
}

.toast-icon {
  font-size: 32rpx;
  color: #fff;
  margin-right: 12rpx;
}

.toast-text {
  font-size: 28rpx;
  color: #fff;
}

.close-btn {
  font-size: 32rpx;
  color: #fff;
  margin-left: 20rpx;
  padding: 0 10rpx;
}
</style> 