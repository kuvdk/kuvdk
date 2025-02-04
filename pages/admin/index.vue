<template>
  <view class="admin-container">
    <!-- 顶部快捷操作 -->
    <view class="quick-actions">
      <view 
        class="action-item"
        v-for="(action, index) in quickActions"
        :key="index"
        @tap="handleQuickAction(action.type)"
      >
        <text class="action-icon">{{action.icon}}</text>
        <view class="action-info">
          <text class="action-name">{{action.name}}</text>
          <text class="action-desc">{{action.desc}}</text>
        </view>
      </view>
    </view>

    <!-- 数据概览 -->
    <view class="data-overview">
      <view class="section-header">
        <text class="section-title">数据概览</text>
        <text class="refresh-btn" @tap="refreshData">刷新</text>
      </view>
      
      <!-- 仓库状态 -->
      <view class="chart-card">
        <view class="card-header">
          <text class="card-title">仓库状态</text>
          <text class="more-btn" @tap="navigateTo('/pages/admin/storage')">详情</text>
        </view>
        <view class="chart-container">
          <storage-chart 
            :data="storageData"
            @tap="showStorageDetail"
          />
        </view>
      </view>
      
      <!-- 用户活跃度 -->
      <view class="chart-card">
        <view class="card-header">
          <text class="card-title">用户活跃度</text>
          <text class="more-btn" @tap="navigateTo('/pages/admin/users')">详情</text>
        </view>
        <view class="chart-container">
          <user-activity-chart :data="activityData" />
        </view>
      </view>
    </view>

    <!-- 待办事项 -->
    <view class="todo-section">
      <view class="section-header">
        <text class="section-title">待办事项</text>
        <text class="count-badge">{{todoList.length}}</text>
      </view>
      
      <view class="todo-list">
        <view 
          class="todo-item"
          v-for="(item, index) in todoList"
          :key="index"
          @tap="handleTodo(item)"
        >
          <view class="todo-content">
            <text class="todo-tag" :class="item.type">{{item.tag}}</text>
            <text class="todo-text">{{item.content}}</text>
          </view>
          <text class="todo-time">{{item.time}}</text>
        </view>
      </view>
    </view>

    <!-- 功能模块入口 -->
    <view class="module-grid">
      <view 
        class="module-item"
        v-for="(module, index) in modules"
        :key="index"
        @tap="navigateTo(module.path)"
      >
        <text class="module-icon">{{module.icon}}</text>
        <text class="module-name">{{module.name}}</text>
        <text class="module-desc">{{module.desc}}</text>
      </view>
    </view>

    <!-- 权限确认弹窗 -->
    <view class="auth-modal" v-if="showAuth">
      <view class="modal-content">
        <text class="modal-title">权限验证</text>
        <input 
          class="auth-input"
          type="password"
          v-model="authPassword"
          placeholder="请输入管理密码"
        />
        <view class="modal-btns">
          <button 
            class="cancel-btn"
            @tap="cancelAuth"
          >取消</button>
          <button 
            class="confirm-btn"
            @tap="confirmAuth"
          >确认</button>
        </view>
      </view>
    </view>

    <!-- Toast提示 -->
    <pd-toast ref="toast" />
  </view>
</template>

<script>
import PdToast from '@/components/pd-toast/pd-toast'
import StorageChart from './components/storage-chart.vue'
import UserActivityChart from './components/user-activity-chart.vue'

export default {
  components: {
    PdToast,
    StorageChart,
    UserActivityChart
  },

  data() {
    return {
      // 快捷操作
      quickActions: [
        {
          icon: '📦',
          name: '库存调整',
          desc: '快速调整库存',
          type: 'storage'
        },
        {
          icon: '📝',
          name: '订单审核',
          desc: '待处理订单',
          type: 'order'
        },
        {
          icon: '💰',
          name: '结算处理',
          desc: '本月待结算',
          type: 'settlement'
        }
      ],

      // 仓库数据
      storageData: {
        supplier: 30,
        production: 45,
        management: 25
      },

      // 活跃度数据
      activityData: {
        roles: [
          { name: '供应商', value: 40 },
          { name: '生产部', value: 35 },
          { name: '品控部', value: 15 },
          { name: '管理员', value: 10 }
        ],
        timeline: [
          /* 时段数据 */
        ]
      },

      // 待办事项
      todoList: [
        {
          type: 'warning',
          tag: '库存',
          content: '原料库存不足，请及时处理',
          time: '10:30'
        },
        {
          type: 'info',
          tag: '订单',
          content: '新订单待审核',
          time: '09:45'
        }
      ],

      // 功能模块
      modules: [
        {
          icon: '📊',
          name: '订单管理',
          desc: '订单查询与处理',
          path: '/pages/admin/orders'
        },
        {
          icon: '👥',
          name: '用户管理',
          desc: '用户权限控制',
          path: '/pages/admin/users'
        },
        {
          icon: '🏭',
          name: '仓库监控',
          desc: '库存实时监控',
          path: '/pages/admin/storage'
        },
        {
          icon: '💳',
          name: '财务中心',
          desc: '结算与对账',
          path: '/pages/admin/finance'
        }
      ],

      // 权限验证
      showAuth: false,
      authPassword: '',
      pendingAction: null
    }
  },

  methods: {
    // 刷新数据
    async refreshData() {
      try {
        // TODO: 调用API获取最新数据
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.$refs.toast.show({
          type: 'success',
          message: '数据已更新'
        })
      } catch(e) {
        this.$refs.toast.show({
          type: 'error',
          message: '更新失败'
        })
      }
    },

    // 处理快捷操作
    handleQuickAction(type) {
      switch(type) {
        case 'storage':
          this.showAuthModal(() => {
            uni.navigateTo({ url: '/pages/admin/storage' })
          })
          break
        case 'order':
          uni.navigateTo({ url: '/pages/admin/orders' })
          break
        case 'settlement':
          this.showAuthModal(() => {
            uni.navigateTo({ url: '/pages/admin/finance' })
          })
          break
      }
    },

    // 显示权限验证
    showAuthModal(callback) {
      this.pendingAction = callback
      this.showAuth = true
    },

    // 取消验证
    cancelAuth() {
      this.showAuth = false
      this.authPassword = ''
      this.pendingAction = null
    },

    // 确认验证
    async confirmAuth() {
      if(!this.authPassword) {
        this.$refs.toast.show({
          type: 'warning',
          message: '请输入密码'
        })
        return
      }

      try {
        // TODO: 验证密码
        await new Promise(resolve => setTimeout(resolve, 500))
        
        this.showAuth = false
        this.authPassword = ''
        
        if(this.pendingAction) {
          this.pendingAction()
          this.pendingAction = null
        }
      } catch(e) {
        this.$refs.toast.show({
          type: 'error',
          message: '验证失败'
        })
      }
    },

    // 处理待办
    handleTodo(item) {
      // TODO: 根据待办类型处理
      console.log('处理待办:', item)
    },

    // 页面跳转
    navigateTo(url) {
      uni.navigateTo({ url })
    }
  },

  onShow() {
    this.refreshData()
  }
}
</script>

<style>
.admin-container {
  min-height: 100vh;
  background: #f8f8f8;
  padding: 20rpx;
}

/* 快捷操作 */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.action-item {
  background: #fff;
  padding: 20rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
}

.action-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.action-info {
  flex: 1;
}

.action-name {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  display: block;
}

.action-desc {
  font-size: 24rpx;
  color: #999;
}

/* 数据概览 */
.data-overview {
  margin-bottom: 30rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.refresh-btn {
  font-size: 28rpx;
  color: #1890ff;
}

.chart-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.card-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.more-btn {
  font-size: 24rpx;
  color: #666;
}

.chart-container {
  height: 300rpx;
}

/* 待办事项 */
.todo-section {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
}

.count-badge {
  background: #1890ff;
  color: #fff;
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.todo-list {
  margin-top: 20rpx;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.todo-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.todo-tag {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  margin-right: 12rpx;
}

.todo-tag.warning {
  background: #fff7e6;
  color: #faad14;
}

.todo-tag.info {
  background: #e6f7ff;
  color: #1890ff;
}

.todo-text {
  font-size: 28rpx;
  color: #333;
}

.todo-time {
  font-size: 24rpx;
  color: #999;
}

/* 功能模块 */
.module-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.module-item {
  background: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
}

.module-icon {
  font-size: 48rpx;
  margin-bottom: 16rpx;
  display: block;
}

.module-name {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 8rpx;
  display: block;
}

.module-desc {
  font-size: 24rpx;
  color: #999;
}

/* 权限弹窗 */
.auth-modal {
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
  width: 600rpx;
  background: #fff;
  border-radius: 12rpx;
  padding: 40rpx;
}

.modal-title {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30rpx;
}

.auth-input {
  height: 80rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  margin-bottom: 30rpx;
}

.modal-btns {
  display: flex;
  gap: 20rpx;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.confirm-btn {
  background: #1890ff;
  color: #fff;
}
</style> 