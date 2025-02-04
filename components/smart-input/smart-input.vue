<template>
  <view class="smart-input">
    <text class="label" v-if="label">{{label}}</text>
    <view class="input-wrap" :class="{'input-error': error}">
      <input
        class="input"
        :value="displayValue"
        :type="inputType"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <text class="unit" v-if="unit">{{unit}}</text>
    </view>
    
    <!-- 历史记录下拉框 -->
    <view class="history-dropdown" v-if="showHistory && history.length">
      <view 
        class="history-item"
        v-for="(item, index) in history"
        :key="index"
        @tap="selectHistory(item)"
      >
        <text>{{item}}</text>
      </view>
    </view>
    
    <!-- 错误提示 -->
    <text class="error-text" v-if="error">{{error}}</text>
  </view>
</template>

<script>
export default {
  name: 'SmartInput',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text', // text/number/money
      validator: value => ['text', 'number', 'money'].includes(value)
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    unit: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    history: {
      type: Array,
      default: () => []
    }
  },
  
  data() {
    return {
      showHistory: false,
      error: ''
    }
  },
  
  computed: {
    inputType() {
      return this.type === 'text' ? 'text' : 'digit'
    },
    
    displayValue() {
      if(this.type === 'money' && this.value) {
        return this.formatMoney(this.value)
      }
      return this.value
    }
  },
  
  methods: {
    handleInput(e) {
      let value = e.detail.value
      
      // 根据类型处理输入
      if(this.type === 'number') {
        value = value.replace(/[^\d]/g, '')
      } else if(this.type === 'money') {
        value = value.replace(/[^\d.]/g, '')
        // 保留两位小数
        const parts = value.split('.')
        if(parts[1]?.length > 2) {
          value = `${parts[0]}.${parts[1].slice(0, 2)}`
        }
      }
      
      this.error = ''
      this.$emit('input', value)
      this.$emit('change', value)
    },
    
    handleFocus() {
      this.showHistory = true
      this.$emit('focus')
    },
    
    handleBlur() {
      // 延迟隐藏历史记录，以便点击选择
      setTimeout(() => {
        this.showHistory = false
      }, 200)
      this.$emit('blur')
    },
    
    selectHistory(value) {
      this.$emit('input', value)
      this.$emit('change', value)
      this.showHistory = false
    },
    
    formatMoney(value) {
      if(!value) return ''
      // 添加千分位
      const parts = value.toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return parts.join('.')
    },
    
    setError(msg) {
      this.error = msg
    }
  }
}
</script>

<style>
.smart-input {
  position: relative;
  margin-bottom: 20rpx;
}

.label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 12rpx;
  display: block;
}

.input-wrap {
  display: flex;
  align-items: center;
  height: 80rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 0 20rpx;
  border: 2rpx solid transparent;
}

.input-error {
  border-color: #ff4d4f;
}

.input {
  flex: 1;
  height: 100%;
  font-size: 28rpx;
}

.unit {
  font-size: 24rpx;
  color: #999;
  margin-left: 10rpx;
}

.history-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
  z-index: 100;
}

.history-item {
  padding: 20rpx;
  font-size: 28rpx;
  color: #333;
  border-bottom: 1rpx solid #f0f0f0;
}

.error-text {
  font-size: 24rpx;
  color: #ff4d4f;
  margin-top: 8rpx;
}
</style> 