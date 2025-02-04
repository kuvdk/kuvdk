<template>
  <view class="storage-chart">
    <!-- 这里需要引入实际的图表组件，这里用简单的DOM模拟 -->
    <view class="chart-ring">
      <view 
        class="ring-segment"
        v-for="(value, key) in data"
        :key="key"
        :style="{
          backgroundColor: colors[key],
          transform: `rotate(${getRotation(key)}deg)`,
          width: `${value}%`
        }"
      ></view>
    </view>
    
    <view class="chart-legend">
      <view 
        class="legend-item"
        v-for="(value, key) in data"
        :key="key"
      >
        <view 
          class="legend-color"
          :style="{backgroundColor: colors[key]}"
        ></view>
        <text class="legend-text">{{labels[key]}}</text>
        <text class="legend-value">{{value}}%</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'StorageChart',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  
  data() {
    return {
      colors: {
        supplier: '#1890ff',
        production: '#52c41a',
        management: '#faad14'
      },
      labels: {
        supplier: '供应商仓',
        production: '生产仓',
        management: '管理仓'
      }
    }
  },
  
  methods: {
    getRotation(key) {
      let rotation = 0
      for(const k in this.data) {
        if(k === key) break
        rotation += this.data[k]
      }
      return rotation * 3.6 // 将百分比转换为角度
    }
  }
}
</script>

<style>
.storage-chart {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.chart-ring {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
}

.ring-segment {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  transform-origin: 100% 50%;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.legend-color {
  width: 24rpx;
  height: 24rpx;
  border-radius: 4rpx;
}

.legend-text {
  font-size: 24rpx;
  color: #666;
}

.legend-value {
  font-size: 24rpx;
  color: #333;
  font-weight: bold;
}
</style> 