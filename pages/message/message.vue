<template>
  <view class="message-container">
    <!-- 消息类型切换 -->
    <view class="type-tabs">
      <view 
        class="tab-item"
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{'tab-active': activeTab === index}"
        @tap="switchTab(index)"
      >
        <text class="tab-name">{{tab.name}}</text>
        <text 
          class="unread-badge"
          v-if="tab.unread"
        >{{tab.unread}}</text>
      </view>
    </view>

    <!-- 消息列表 -->
    <scroll-view 
      class="message-list"
      scroll-y
      @scrolltolower="loadMore"
      :refresher-enabled="true"
      :refresher-triggered="refreshing"
      @refresherrefresh="refresh"
    >
      <view 
        class="message-item"
        v-for="(msg, index) in filteredMessages"
        :key="msg.id"
        :class="{'msg-unread': !msg.read}"
        @tap="readMessage(msg)"
      >
        <view class="msg-icon" :class="msg.type">
          <text class="icon">{{getIcon(msg.type)}}</text>
        </view>
        <view class="msg-content">
          <view class="msg-header">
            <text class="msg-title">{{msg.title}}</text>
            <text class="msg-time">{{formatTime(msg.time)}}</text>
          </view>
          <text class="msg-desc">{{msg.content}}</text>
        </view>
      </view>

      <!-- 加载状态 -->
      <view class="loading-more" v-if="loading">
        <text>加载中...</text>
      </view>
      
      <!-- 无数据提示 -->
      <view class="empty-tip" v-if="filteredMessages.length === 0">
        <text>暂无消息</text>
      </view>
    </scroll-view>

    <!-- 批量操作栏 -->
    <view class="action-bar" v-if="hasUnread">
      <button 
        class="action-btn"
        @tap="markAllRead"
      >全部已读</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 消息类型
      tabs: [
        { name: '全部', unread: 5 },
        { name: '订单', unread: 2 },
        { name: '审批', unread: 3 },
        { name: '公告', unread: 0 }
      ],
      activeTab: 0,

      // 消息列表
      messages: [
        {
          id: 1,
          type: 'order',
          title: '订单状态更新',
          content: '您的订单MF-20240315-001已入库',
          time: Date.now() - 3600000,
          read: false
        },
        {
          id: 2,
          type: 'approval',
          title: '待审批提醒',
          content: '您有2笔订单待质检，请及时处理',
          time: Date.now() - 7200000,
          read: false,
          urgent: true
        },
        {
          id: 3,
          type: 'notice',
          title: '系统公告',
          content: '本月结算时间调整通知',
          time: Date.now() - 86400000,
          read: true
        }
      ],

      loading: false,
      refreshing: false,
      hasMore: true
    }
  },

  computed: {
    // 过滤后的消息列表
    filteredMessages() {
      if(this.activeTab === 0) return this.messages
      
      const type = ['', 'order', 'approval', 'notice'][this.activeTab]
      return this.messages.filter(msg => msg.type === type)
    },

    // 是否有未读消息
    hasUnread() {
      return this.messages.some(msg => !msg.read)
    }
  },

  methods: {
    // 切换消息类型
    switchTab(index) {
      this.activeTab = index
    },

    // 获取消息图标
    getIcon(type) {
      const icons = {
        order: '📦',
        approval: '📝',
        notice: '📢'
      }
      return icons[type]
    },

    // 阅读消息
    async readMessage(msg) {
      if(msg.read) return
      
      try {
        // TODO: 调用已读API
        await new Promise(resolve => setTimeout(resolve, 500))
        
        msg.read = true
        // 更新未读数
        this.updateUnreadCount()
      } catch(e) {
        console.error('标记已读失败:', e)
      }
    },

    // 全部已读
    async markAllRead() {
      try {
        uni.showLoading({ title: '处理中' })
        // TODO: 调用批量已读API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.messages.forEach(msg => msg.read = true)
        this.updateUnreadCount()
        
        uni.showToast({ title: '已全部标记为已读' })
      } catch(e) {
        uni.showToast({ 
          title: '操作失败',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    },

    // 更新未读数量
    updateUnreadCount() {
      const counts = {
        order: 0,
        approval: 0,
        notice: 0
      }
      
      this.messages.forEach(msg => {
        if(!msg.read) {
          counts[msg.type]++
        }
      })
      
      this.tabs[0].unread = Object.values(counts).reduce((a, b) => a + b, 0)
      this.tabs[1].unread = counts.order
      this.tabs[2].unread = counts.approval
      this.tabs[3].unread = counts.notice
    },

    // 加载更多
    async loadMore() {
      if(this.loading || !this.hasMore) return
      
      this.loading = true
      try {
        // TODO: 调用加载更多API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 模拟加载数据
        const newMessages = []
        this.messages.push(...newMessages)
        
        this.hasMore = newMessages.length === 10
      } catch(e) {
        console.error('加载失败:', e)
      } finally {
        this.loading = false
      }
    },

    // 下拉刷新
    async refresh() {
      this.refreshing = true
      try {
        // TODO: 调用刷新API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 重置数据
        this.messages = []
        this.hasMore = true
        await this.loadMore()
        
      } finally {
        this.refreshing = false
      }
    },

    // 格式化时间
    formatTime(timestamp) {
      const now = Date.now()
      const diff = now - timestamp
      
      if(diff < 3600000) {
        return Math.floor(diff / 60000) + '分钟前'
      }
      if(diff < 86400000) {
        return Math.floor(diff / 3600000) + '小时前'
      }
      
      const date = new Date(timestamp)
      return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
    }
  },

  onShow() {
    this.refresh()
  }
}
</script>

<style>
.message-container {
  min-height: 100vh;
  background: #f8f8f8;
  padding-bottom: 100rpx;
}

/* 类型切换 */
.type-tabs {
  display: flex;
  background: #fff;
  padding: 20rpx 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.tab-item {
  flex: 1;
  text-align: center;
  position: relative;
}

.tab-name {
  font-size: 28rpx;
  color: #666;
  padding: 10rpx 0;
}

.tab-active .tab-name {
  color: #1890ff;
  font-weight: bold;
}

.tab-active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -10rpx;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background: #1890ff;
  border-radius: 2rpx;
}

.unread-badge {
  position: absolute;
  top: -10rpx;
  right: 50%;
  transform: translateX(20rpx);
  background: #ff4d4f;
  color: #fff;
  font-size: 24rpx;
  padding: 0 8rpx;
  border-radius: 20rpx;
  min-width: 32rpx;
  height: 32rpx;
  line-height: 32rpx;
}

/* 消息列表 */
.message-list {
  height: calc(100vh - 88rpx - 100rpx);
}

.message-item {
  display: flex;
  padding: 30rpx;
  background: #fff;
  margin-bottom: 2rpx;
}

.msg-unread {
  background: #f6f6f6;
}

.msg-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.msg-icon.order {
  background: #e6f7ff;
  color: #1890ff;
}

.msg-icon.approval {
  background: #fff7e6;
  color: #faad14;
}

.msg-icon.notice {
  background: #f6ffed;
  color: #52c41a;
}

.icon {
  font-size: 40rpx;
}

.msg-content {
  flex: 1;
}

.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.msg-title {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.msg-time {
  font-size: 24rpx;
  color: #999;
}

.msg-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
}

/* 加载更多 */
.loading-more {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 24rpx;
}

/* 空状态 */
.empty-tip {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

/* 底部操作栏 */
.action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 20rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
}

.action-btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background: #1890ff;
  color: #fff;
  font-size: 32rpx;
  border-radius: 40rpx;
  margin: 0;
}
</style> 