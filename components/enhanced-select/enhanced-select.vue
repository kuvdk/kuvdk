<template>
  <view class="enhanced-select">
    <text class="label" v-if="label">{{label}}</text>
    <view 
      class="select-wrap"
      :class="{'select-active': showDropdown}"
      @tap="toggleDropdown"
    >
      <view class="selected-value">
        <text v-if="selectedLabel">{{selectedLabel}}</text>
        <text class="placeholder" v-else>{{placeholder}}</text>
      </view>
      <text class="arrow">▼</text>
    </view>
    
    <!-- 下拉面板 -->
    <view class="dropdown" v-if="showDropdown">
      <!-- 搜索框 -->
      <view class="search-box" v-if="searchable">
        <input
          class="search-input"
          v-model="searchText"
          placeholder="搜索"
          @input="handleSearch"
        />
      </view>
      
      <!-- 选项列表 -->
      <scroll-view 
        class="options-list"
        scroll-y
      >
        <view 
          class="option-item"
          v-for="item in filteredOptions"
          :key="item.value"
          :class="{'option-selected': item.value === value}"
          @tap="selectOption(item)"
        >
          <text class="option-label">{{item.label}}</text>
          <text class="option-tag" v-if="item.tag">{{item.tag}}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'EnhancedSelect',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    searchable: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      showDropdown: false,
      searchText: ''
    }
  },
  
  computed: {
    selectedLabel() {
      const selected = this.options.find(item => item.value === this.value)
      return selected?.label || ''
    },
    
    filteredOptions() {
      if(!this.searchText) return this.options
      const searchLower = this.searchText.toLowerCase()
      return this.options.filter(item => 
        item.label.toLowerCase().includes(searchLower) ||
        item.tag?.toLowerCase().includes(searchLower)
      )
    }
  },
  
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
      if(!this.showDropdown) {
        this.searchText = ''
      }
    },
    
    selectOption(item) {
      this.$emit('input', item.value)
      this.$emit('change', item)
      this.showDropdown = false
    },
    
    handleSearch() {
      // 实时搜索，无需额外处理
    }
  },
  
  mounted() {
    // 点击外部关闭下拉框
    const handleClickOutside = (e) => {
      if(!this.$el.contains(e.target)) {
        this.showDropdown = false
        this.searchText = ''
      }
    }
    document.addEventListener('click', handleClickOutside)
    this.$once('hook:beforeDestroy', () => {
      document.removeEventListener('click', handleClickOutside)
    })
  }
}
</script>

<style>
.enhanced-select {
  position: relative;
  margin-bottom: 20rpx;
}

.label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 12rpx;
  display: block;
}

.select-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 0 20rpx;
  border: 2rpx solid transparent;
}

.select-active {
  border-color: #1890ff;
}

.selected-value {
  font-size: 28rpx;
  color: #333;
}

.placeholder {
  color: #999;
}

.arrow {
  font-size: 24rpx;
  color: #999;
  transition: transform 0.3s;
}

.select-active .arrow {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
  z-index: 100;
  margin-top: 4rpx;
}

.search-box {
  padding: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.search-input {
  height: 60rpx;
  background: #f8f8f8;
  border-radius: 30rpx;
  padding: 0 20rpx;
  font-size: 24rpx;
}

.options-list {
  max-height: 400rpx;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.option-selected {
  background: #e6f7ff;
}

.option-label {
  font-size: 28rpx;
  color: #333;
}

.option-tag {
  font-size: 24rpx;
  color: #666;
  background: #f0f0f0;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}
</style> 