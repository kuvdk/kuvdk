<template>
  <view class="activity-chart">
    <!-- 角色活跃度饼图 -->
    <view class="pie-chart">
      <view 
        class="pie-segment"
        v-for="(role, index) in data.roles"
        :key="role.name"
        :style="{
          backgroundColor: colors[index],
          transform: `rotate(${getRotation(index)}deg)`,
          width: `${role.value}%`
        }"
      ></view>
      <view class="pie-center">
        <text class="total-text">总活跃</text>
        <text class="total-value">{{getTotalValue()}}</text>
      </view>
    </view>

    <!-- 图例 -->
    <view class="chart-legend">
      <view 
        class="legend-item"
        v-for="(role, index) in data.roles"
        :key="role.name"
      >
        <view 
          class="legend-color"
          :style="{backgroundColor: colors[index]}"
        ></view>
        <text class="legend-text">{{role.name}}</text>
        <text class="legend-value">{{role.value}}%</text>
      </view>
    </view>

    <!-- 时段活跃度 -->
    <view class="timeline-chart">
      <view class="timeline-header">
        <text>时段活跃度</text>
        <text class="peak-time">高峰: {{getPeakTime()}}</text>
      </view>
      <view class="timeline-bars">
        <view 
          class="time-bar"
          v-for="(hour, index) in 24"
          :key="hour"
          :style="{
            height: `${getTimelineHeight(index)}rpx`,
            backgroundColor: getTimelineColor(index)
          }"
        >
          <text class="bar-value" v-if="getTimelineHeight(index) > 60">
            {{getTimelineValue(index)}}
          </text>
        </view>
      </view>
      <view class="timeline-labels">
        <text 
          class="time-label"
          v-for="hour in [0,6,12,18,23]"
          :key="hour"
        >{{hour}}:00</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'UserActivityChart',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  
  data() {
    return {
      colors: ['#1890ff', '#52c41a', '#faad14', '#722ed1']
    }
  },
  
  methods: {
    // 获取饼图旋转角度
    getRotation(index) {
      let rotation = 0
      for(let i = 0; i < index; i++) {
        rotation += this.data.roles[i].value
      }
      return rotation * 3.6 // 将百分比转换为角度
    },
    
    // 获取总活跃度
    getTotalValue() {
      return this.data.roles.reduce((sum, role) => sum + role.value, 0)
    },
    
    // 获取时段柱状图高度
    getTimelineHeight(hour) {
      const value = this.data.timeline?.[hour] || 0
      return Math.max(value * 2, 20) // 最小高度20rpx
    },
    
    // 获取时段柱状图颜色
    getTimelineColor(hour) {
      const value = this.data.timeline?.[hour] || 0
      if(value > 80) return '#ff4d4f'
      if(value > 50) return '#faad14'
      return '#1890ff'
    },
    
    // 获取时段值
    getTimelineValue(hour) {
      return this.data.timeline?.[hour] || 0
    },
    
    // 获取高峰时段
    getPeakTime() {
      if(!this.data.timeline) return '--:--'
      
      let peakHour = 0
      let peakValue = 0
      
      for(let hour = 0; hour < 24; hour++) {
        const value = this.data.timeline[hour] || 0
        if(value > peakValue) {
          peakValue = value
          peakHour = hour
        }
      }
      
      return `${peakHour.toString().padStart(2, '0')}:00`
    }
  }
}
</script>

<style>
.activity-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 饼图 */
.pie-chart {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  position: relative;
  margin: 0 auto;
}

.pie-segment {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  transform-origin: 100% 50%;
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120rpx;
  height: 120rpx;
  background: #fff;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.total-text {
  font-size: 20rpx;
  color: #999;
}

.total-value {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

/* 图例 */
.chart-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20rpx;
  margin: 20rpx 0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.legend-color {
  width: 20rpx;
  height: 20rpx;
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

/* 时段图表 */
.timeline-chart {
  flex: 1;
  padding: 20rpx 0;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding: 0 20rpx;
}

.timeline-header text {
  font-size: 24rpx;
  color: #666;
}

.peak-time {
  color: #ff4d4f;
}

.timeline-bars {
  height: 200rpx;
  display: flex;
  align-items: flex-end;
  gap: 4rpx;
  padding: 0 20rpx;
}

.time-bar {
  flex: 1;
  min-height: 20rpx;
  background: #1890ff;
  position: relative;
  transition: height 0.3s;
}

.bar-value {
  position: absolute;
  top: -30rpx;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20rpx;
  color: #666;
}

.timeline-labels {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 20rpx 0;
}

.time-label {
  font-size: 20rpx;
  color: #999;
}
</style> 