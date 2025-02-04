<template>
  <view class="quality-container">
    <!-- 顶部统计卡片 -->
    <view class="stats-cards">
      <view class="stat-card">
        <text class="stat-value">{{stats.pending}}</text>
        <text class="stat-label">待处理</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{stats.today}}</text>
        <text class="stat-label">今日完成</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{stats.rate}}%</text>
        <text class="stat-label">合格率</text>
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="order-list">
      <view class="list-header">
        <text class="title">待处理订单</text>
        <view class="filter-btns">
          <text 
            class="filter-btn"
            :class="{'active': filterType === 'all'}"
            @tap="setFilter('all')"
          >全部</text>
          <text 
            class="filter-btn"
            :class="{'active': filterType === 'urgent'}"
            @tap="setFilter('urgent')"
          >紧急</text>
        </view>
      </view>

      <!-- 列表内容 -->
      <scroll-view 
        class="list-content"
        scroll-y
        @scrolltolower="loadMore"
        :refresher-enabled="true"
        :refresher-triggered="refreshing"
        @refresherrefresh="onRefresh"
      >
        <view 
          class="order-item"
          v-for="order in filteredOrders"
          :key="order.id"
          @tap="showDetail(order)"
        >
          <view class="order-header">
            <text class="product-code">{{order.productCode}}</text>
            <text 
              class="urgent-tag"
              v-if="isUrgent(order)"
            >紧急</text>
          </view>
          <view class="order-info">
            <text class="info-item">数量：{{order.quantity}}件</text>
            <text class="info-item">温度：{{order.params.temperature}}℃</text>
            <text class="info-item">压力：{{order.params.pressure}}MPa</text>
          </view>
          <view class="order-footer">
            <text class="time">{{formatTime(order.createTime)}}</text>
            <text class="dept">{{order.deptName}}</text>
          </view>
        </view>

        <!-- 加载状态 -->
        <view class="loading-more" v-if="loading">
          <text>加载中...</text>
        </view>

        <!-- 无数据提示 -->
        <view class="empty-tip" v-if="filteredOrders.length === 0">
          <image src="/static/empty.png" mode="aspectFit"></image>
          <text>暂无待处理订单</text>
        </view>
      </scroll-view>
    </view>

    <!-- 审批操作弹窗 -->
    <view class="approval-modal" v-if="showApproval">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">质检审核</text>
          <text class="close-btn" @tap="closeApproval">×</text>
        </view>

        <!-- 图片预览 -->
        <scroll-view 
          class="image-preview"
          scroll-x
        >
          <image
            class="preview-img"
            v-for="(img, index) in currentOrder.images"
            :key="index"
            :src="img"
            mode="aspectFill"
            @tap="previewImage(index)"
          />
        </scroll-view>

        <!-- 工艺参数 -->
        <view class="params-info">
          <view class="param-item">
            <text class="param-label">温度</text>
            <text class="param-value">{{currentOrder.params.temperature}}℃</text>
          </view>
          <view class="param-item">
            <text class="param-label">压力</text>
            <text class="param-value">{{currentOrder.params.pressure}}MPa</text>
          </view>
        </view>

        <!-- 审核结果 -->
        <view class="result-section">
          <radio-group class="result-group" @change="handleResultChange">
            <label class="result-option">
              <radio value="pass" color="#52c41a" :checked="approvalResult === 'pass'" />
              <text>通过</text>
            </label>
            <label class="result-option">
              <radio value="reject" color="#ff4d4f" :checked="approvalResult === 'reject'" />
              <text>退回</text>
            </label>
          </radio-group>
        </view>

        <!-- 合格数量(通过时显示) -->
        <view class="quantity-input" v-if="approvalResult === 'pass'">
          <text class="input-label">合格数量</text>
          <view class="stepper">
            <text 
              class="step-btn"
              @tap="updateQualifiedQuantity(-1)"
            >-</text>
            <input
              class="step-input"
              type="number"
              v-model="qualifiedQuantity"
              @input="validateQuantity"
            />
            <text 
              class="step-btn"
              @tap="updateQualifiedQuantity(1)"
            >+</text>
          </view>
          <text class="total-quantity">共{{currentOrder.quantity}}件</text>
        </view>

        <!-- 退回原因(退回时显示) -->
        <view class="reject-reason" v-if="approvalResult === 'reject'">
          <text class="input-label">退回原因</text>
          <view class="reason-tags">
            <text 
              class="reason-tag"
              v-for="(reason, index) in rejectReasons"
              :key="index"
              :class="{'tag-selected': selectedReason === reason}"
              @tap="selectReason(reason)"
            >{{reason}}</text>
          </view>
          <textarea
            class="reason-input"
            v-model="rejectRemark"
            placeholder="请输入详细说明"
          />
        </view>

        <!-- 提交按钮 -->
        <button 
          class="submit-btn"
          :disabled="!isValid"
          :loading="submitting"
          @tap="handleSubmit"
        >确认</button>
      </view>
    </view>

    <!-- Toast提示 -->
    <pd-toast ref="toast" />

    <!-- 加载状态 -->
    <pd-loading 
      v-if="loading"
      type="global"
      text="加载中..."
    />
  </view>
</template>

<script>
import PdToast from '@/components/pd-toast/pd-toast'
import PdLoading from '@/components/pd-loading/pd-loading'

export default {
  components: {
    PdToast,
    PdLoading
  },

  data() {
    return {
      stats: {
        pending: 0,
        today: 0,
        rate: 0
      },
      orders: [],
      filterType: 'all',
      loading: false,
      refreshing: false,
      page: 1,
      pageSize: 10,
      showApproval: false,
      currentOrder: null,
      approvalResult: 'pass',
      qualifiedQuantity: 0,
      selectedReason: '',
      rejectRemark: '',
      rejectReasons: [
        '工艺不达标',
        '尺寸偏差',
        '表面瑕疵',
        '其他问题'
      ],
      submitting: false
    }
  },

  computed: {
    filteredOrders() {
      if(this.filterType === 'urgent') {
        return this.orders.filter(order => this.isUrgent(order))
      }
      return this.orders
    },
    isValid() {
      if(!this.currentOrder) return false
      
      if(this.approvalResult === 'pass') {
        return this.qualifiedQuantity > 0 && 
               this.qualifiedQuantity <= this.currentOrder.quantity
      } else {
        return this.selectedReason && this.rejectRemark
      }
    }
  },

  methods: {
    // 获取统计数据
    async fetchStats() {
      try {
        const res = await this.$api.quality.getStats()
        this.stats = res.data
      } catch(e) {
        console.error('获取统计数据失败:', e)
      }
    },

    // 获取订单列表
    async fetchOrders(append = false) {
      if(this.loading) return
      
      this.loading = true
      try {
        const res = await this.$api.quality.getOrders({
          page: this.page,
          pageSize: this.pageSize
        })
        
        if(append) {
          this.orders = [...this.orders, ...res.data]
        } else {
          this.orders = res.data
        }
        
        this.page++
      } catch(e) {
        console.error('获取订单列表失败:', e)
      } finally {
        this.loading = false
        this.refreshing = false
      }
    },

    // 检查是否紧急订单
    isUrgent(order) {
      // 48小时未处理视为紧急
      const hours = (Date.now() - new Date(order.createTime).getTime()) / (1000 * 60 * 60)
      return hours >= 48
    },

    // 格式化时间
    formatTime(time) {
      // ... 时间格式化逻辑
      return new Date(time).toLocaleString()
    },

    // 筛选切换
    setFilter(type) {
      this.filterType = type
    },

    // 显示订单详情
    showDetail(order) {
      this.currentOrder = order
      this.approvalResult = 'pass'
      this.qualifiedQuantity = order.quantity
      this.selectedReason = ''
      this.rejectRemark = ''
      this.showApproval = true
    },

    // 下拉刷新
    async onRefresh() {
      this.page = 1
      await this.fetchOrders()
    },

    // 加载更多
    loadMore() {
      this.fetchOrders(true)
    },

    // 关闭审批弹窗
    closeApproval() {
      this.showApproval = false
      this.currentOrder = null
    },

    // 预览图片
    previewImage(index) {
      uni.previewImage({
        urls: this.currentOrder.images,
        current: index
      })
    },

    // 审核结果变更
    handleResultChange(e) {
      this.approvalResult = e.detail.value
    },

    // 更新合格数量
    updateQualifiedQuantity(delta) {
      const newValue = this.qualifiedQuantity + delta
      if(newValue >= 0 && newValue <= this.currentOrder.quantity) {
        this.qualifiedQuantity = newValue
      }
    },

    // 验证数量输入
    validateQuantity(e) {
      const value = Number(e.detail.value)
      if(value < 0) this.qualifiedQuantity = 0
      if(value > this.currentOrder.quantity) {
        this.qualifiedQuantity = this.currentOrder.quantity
      }
    },

    // 选择退回原因
    selectReason(reason) {
      this.selectedReason = reason
    },

    // 提交审核
    async handleSubmit() {
      if(!this.isValid) return
      
      this.submitting = true
      try {
        const data = {
          orderId: this.currentOrder.id,
          result: this.approvalResult,
          qualifiedQuantity: this.qualifiedQuantity,
          rejectReason: this.selectedReason,
          rejectRemark: this.rejectRemark
        }
        
        // TODO: 调用提交API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.$refs.toast.show({
          type: 'success',
          message: '审核完成'
        })
        
        this.closeApproval()
        this.fetchOrders() // 刷新列表
        
      } catch(e) {
        this.$refs.toast.show({
          type: 'error',
          message: '提交失败'
        })
      } finally {
        this.submitting = false
      }
    }
  },

  onLoad() {
    this.fetchStats()
    this.fetchOrders()
  }
}
</script>

<style>
.quality-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

/* 统计卡片 */
.stats-cards {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.stat-card {
  flex: 1;
  margin: 0 10rpx;
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  text-align: center;
}

.stat-value {
  font-size: 36rpx;
  color: #333;
  font-weight: bold;
  display: block;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

/* 订单列表 */
.order-list {
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.title {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.filter-btns {
  display: flex;
  gap: 20rpx;
}

.filter-btn {
  font-size: 28rpx;
  color: #666;
  padding: 8rpx 20rpx;
  border-radius: 24rpx;
}

.filter-btn.active {
  background: #e6f7ff;
  color: #1890ff;
}

/* 列表内容 */
.list-content {
  height: calc(100vh - 300rpx);
}

.order-item {
  padding: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.product-code {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.urgent-tag {
  font-size: 24rpx;
  color: #ff4d4f;
  background: #fff1f0;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.order-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 16rpx;
}

.info-item {
  font-size: 28rpx;
  color: #666;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time {
  font-size: 24rpx;
  color: #999;
}

.dept {
  font-size: 24rpx;
  color: #1890ff;
  background: #e6f7ff;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
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
  padding: 100rpx 0;
  text-align: center;
}

.empty-tip image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.empty-tip text {
  font-size: 28rpx;
  color: #999;
}

/* 审批弹窗 */
.approval-modal {
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
  max-height: 90vh;
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  overflow-y: auto;
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

/* 图片预览 */
.image-preview {
  white-space: nowrap;
  margin-bottom: 30rpx;
}

.preview-img {
  width: 200rpx;
  height: 200rpx;
  margin-right: 20rpx;
  border-radius: 8rpx;
  display: inline-block;
}

/* 工艺参数 */
.params-info {
  display: flex;
  gap: 40rpx;
  margin-bottom: 30rpx;
}

.param-item {
  flex: 1;
  background: #f8f8f8;
  padding: 20rpx;
  border-radius: 8rpx;
}

.param-label {
  font-size: 24rpx;
  color: #666;
}

.param-value {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  margin-top: 8rpx;
  display: block;
}

/* 审核结果 */
.result-section {
  margin-bottom: 30rpx;
}

.result-group {
  display: flex;
  gap: 40rpx;
}

.result-option {
  font-size: 28rpx;
  color: #333;
}

/* 合格数量 */
.quantity-input {
  margin-bottom: 30rpx;
}

.input-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 12rpx;
  display: block;
}

.stepper {
  display: flex;
  align-items: center;
  width: 240rpx;
}

.step-btn {
  width: 60rpx;
  height: 60rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}

.step-input {
  flex: 1;
  height: 60rpx;
  background: #f8f8f8;
  margin: 0 20rpx;
  text-align: center;
  font-size: 28rpx;
}

.total-quantity {
  font-size: 24rpx;
  color: #999;
  margin-left: 20rpx;
}

/* 退回原因 */
.reject-reason {
  margin-bottom: 30rpx;
}

.reason-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.reason-tag {
  background: #f8f8f8;
  color: #666;
  font-size: 28rpx;
  padding: 12rpx 24rpx;
  border-radius: 8rpx;
}

.tag-selected {
  background: #e6f7ff;
  color: #1890ff;
}

.reason-input {
  width: 100%;
  height: 160rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
}

/* 提交按钮 */
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