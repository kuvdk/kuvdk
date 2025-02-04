<template>
  <view>
    <!-- 局部加载 -->
    <view 
      class="button-loading"
      v-if="type === 'button'"
    >
      <view class="loading-spinner"></view>
      <text v-if="text">{{text}}</text>
    </view>
    
    <!-- 全局加载 -->
    <view 
      class="global-loading"
      v-if="type === 'global'"
    >
      <view class="loading-mask"></view>
      <view class="loading-content">
        <view class="loading-spinner"></view>
        <view class="progress-bar">
          <view 
            class="progress-inner"
            :style="{width: `${progress}%`}"
          ></view>
        </view>
        <text v-if="text">{{text}}</text>
      </view>
    </view>
    
    <!-- 骨架屏 -->
    <view 
      class="skeleton"
      v-if="type === 'skeleton'"
    >
      <view 
        class="skeleton-item"
        v-for="i in count"
        :key="i"
      >
        <view class="skeleton-avatar"></view>
        <view class="skeleton-content">
          <view class="skeleton-title"></view>
          <view class="skeleton-text"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PdLoading',
  props: {
    type: {
      type: String,
      default: 'button',
      validator: value => ['button', 'global', 'skeleton'].includes(value)
    },
    text: {
      type: String,
      default: ''
    },
    progress: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 3 // 骨架屏项目数
    }
  }
}
</script>

<style>
/* 按钮加载 */
.button-loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
}

/* 全局加载 */
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.loading-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.9);
}

.loading-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #f3f3f3;
  border-top: 4rpx solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.progress-bar {
  width: 400rpx;
  height: 6rpx;
  background: #f0f0f0;
  border-radius: 3rpx;
  overflow: hidden;
}

.progress-inner {
  height: 100%;
  background: #1890ff;
  transition: width 0.3s;
}

/* 骨架屏 */
.skeleton {
  padding: 20rpx;
}

.skeleton-item {
  display: flex;
  margin-bottom: 30rpx;
  animation: skeleton-loading 1.5s ease infinite;
}

.skeleton-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #f0f0f0;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.skeleton-content {
  flex: 1;
}

.skeleton-title {
  height: 32rpx;
  background: #f0f0f0;
  margin-bottom: 16rpx;
  width: 50%;
}

.skeleton-text {
  height: 24rpx;
  background: #f0f0f0;
  width: 100%;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes skeleton-loading {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style> 