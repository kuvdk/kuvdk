<template>
  <view class="production-container">
    <!-- 部门选择 -->
    <view class="dept-select">
      <text class="select-title">请选择部门</text>
      <view class="dept-options">
        <!-- 磨房部门 -->
        <view 
          class="dept-item"
          :class="{'dept-active': selectedDept === 'MF'}"
          @tap="selectDept('MF')"
        >
          <image class="dept-icon" src="/static/mf.png" mode="aspectFit"></image>
          <text class="dept-name">磨房部门</text>
          <text class="dept-desc">数据流转至品控部审核</text>
        </view>

        <!-- 其他部门 -->
        <view 
          class="dept-item"
          :class="{'dept-active': selectedDept === 'OTHER'}"
          @tap="selectDept('OTHER')"
        >
          <image class="dept-icon" src="/static/other.png" mode="aspectFit"></image>
          <text class="dept-name">其他部门</text>
          <text class="dept-desc">数据直接提交管理员审核</text>
        </view>
      </view>
    </view>

    <!-- 表单区域 -->
    <view class="form-content" v-if="selectedDept">
      <!-- 产品编号 -->
      <view class="form-item">
        <text class="label required">产品编号</text>
        <input
          class="input"
          v-model="formData.productCode"
          placeholder="请输入产品编号"
        />
      </view>

      <!-- 生产数量 -->
      <view class="form-item">
        <text class="label required">生产数量</text>
        <view class="stepper">
          <text 
            class="step-btn"
            @tap="updateQuantity('minus')"
          >-</text>
          <input
            class="step-input"
            type="number"
            v-model="formData.quantity"
          />
          <text 
            class="step-btn"
            @tap="updateQuantity('plus')"
          >+</text>
        </view>
      </view>

      <!-- 单价 -->
      <view class="form-item">
        <text class="label required">单价(元)</text>
        <input
          class="input price-input"
          type="digit"
          v-model="formData.unitPrice"
          @input="calculateTotal"
          placeholder="请输入单价"
        />
      </view>

      <!-- 总价 -->
      <view class="form-item">
        <text class="label">总价(元)</text>
        <view class="total-price">
          <text>¥ {{totalPrice}}</text>
          <text class="price-tip" v-if="formData.unitPrice && formData.quantity">
            {{formData.quantity}} × {{formData.unitPrice}}
          </text>
        </view>
      </view>

      <!-- 备注信息 -->
      <view class="form-item">
        <text class="label">备注说明</text>
        <textarea
          class="textarea"
          v-model="formData.remark"
          placeholder="请输入备注说明"
        />
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="footer" v-if="selectedDept">
      <button 
        class="submit-btn"
        :disabled="!isValid || submitting"
        @tap="handleSubmit"
      >
        提交{{selectedDept === 'MF' ? '(待品控审核)' : '(待管理审核)'}}
      </button>
    </view>

    <!-- 提示组件 -->
    <pd-toast ref="toast" />
    <pd-loading v-if="submitting" type="global" text="提交中..." />
  </view>
</template>

<script>
import { ORDER_STATUS } from '@/utils/constants'
import PdToast from '@/components/pd-toast/pd-toast'
import PdLoading from '@/components/pd-loading/pd-loading'

export default {
  components: {
    PdToast,
    PdLoading
  },

  data() {
    return {
      selectedDept: '', // MF: 磨房, OTHER: 其他部门
      formData: {
        productCode: '',
        quantity: 1,
        unitPrice: '',
        totalPrice: 0,
        remark: ''
      },
      submitting: false
    }
  },

  computed: {
    isValid() {
      const { productCode, quantity, unitPrice } = this.formData
      return this.selectedDept && 
             productCode && 
             quantity > 0 && 
             unitPrice && 
             !isNaN(parseFloat(unitPrice))
    },
    
    totalPrice() {
      if(!this.formData.unitPrice || !this.formData.quantity) return '0.00'
      const total = this.formData.quantity * parseFloat(this.formData.unitPrice)
      return total.toFixed(2)
    }
  },

  methods: {
    // 选择部门
    selectDept(dept) {
      this.selectedDept = dept
      this.resetForm()
    },

    // 更新数量
    updateQuantity(type) {
      if(type === 'minus' && this.formData.quantity > 1) {
        this.formData.quantity--
      } else if(type === 'plus') {
        this.formData.quantity++
      }
      this.calculateTotal()
    },

    // 计算总价
    calculateTotal() {
      this.formData.totalPrice = this.totalPrice
    },

    // 提交表单
    async handleSubmit() {
      if(!this.isValid || this.submitting) return
      
      this.submitting = true
      try {
        const orderData = {
          ...this.formData,
          deptCode: this.selectedDept,
          // 磨房部门提交到品控审核，其他部门直接到管理员审核
          status: this.selectedDept === 'MF' ? 
            ORDER_STATUS.QC_REVIEW : 
            ORDER_STATUS.PENDING
        }

        const res = await this.$api.production.submitOrder(orderData)

        if(res.success) {
          this.$refs.toast.show({
            type: 'success',
            message: this.selectedDept === 'MF' ? 
              '提交成功，等待品控审核' : 
              '提交成功，等待管理审核'
          })
          this.resetForm()
        }
      } catch(e) {
        this.$refs.toast.show({
          type: 'error',
          message: '提交失败'
        })
      } finally {
        this.submitting = false
      }
    },

    // 重置表单
    resetForm() {
      this.formData = {
        productCode: '',
        quantity: 1,
        unitPrice: '',
        totalPrice: 0,
        remark: ''
      }
    }
  }
}
</script>

<style>
/* 页面容器 */
.production-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120rpx;
}

/* 部门标识区 */
.dept-header {
  padding: 40rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dept-info {
  color: #fff;
}

.dept-name {
  font-size: 40rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
  display: block;
}

.dept-code {
  font-size: 28rpx;
  opacity: 0.8;
}

.progress-circle {
  width: 120rpx;
  height: 120rpx;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.progress-text {
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
}

.progress-label {
  color: #fff;
  font-size: 24rpx;
  opacity: 0.8;
}

/* 表单区域 */
.form-content {
  background: #fff;
  border-radius: 12rpx;
  margin: 20rpx;
  padding: 30rpx;
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

.required::before {
  content: '*';
  color: #ff4d4f;
  margin-right: 4rpx;
}

.input {
  width: 100%;
  height: 80rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

/* 数量步进器 */
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

/* 备注文本框 */
.textarea {
  width: 100%;
  height: 160rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
}

/* 底部提交 */
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 20rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
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

/* 价格输入框 */
.price-input {
  width: 300rpx;
}

/* 总价展示 */
.total-price {
  background: #f8f8f8;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.price-tip {
  font-size: 24rpx;
  color: #999;
  margin-left: 20rpx;
  font-weight: normal;
}

/* 部门选择样式 */
.dept-select {
  padding: 30rpx;
}

.select-title {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
}

.dept-options {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.dept-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  transition: all 0.3s;
}

.dept-active {
  background: #e6f7ff;
  border: 2rpx solid #1890ff;
}

.dept-icon {
  width: 80rpx;
  height: 80rpx;
}

.dept-name {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.dept-desc {
  font-size: 24rpx;
  color: #666;
  margin-left: auto;
}

/* 表单区域在选择部门后显示 */
.form-content {
  margin-top: 30rpx;
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
}
</style> 