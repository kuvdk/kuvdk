"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "UserActivityChart",
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      colors: ["#1890ff", "#52c41a", "#faad14", "#722ed1"]
    };
  },
  methods: {
    // 获取饼图旋转角度
    getRotation(index) {
      let rotation = 0;
      for (let i = 0; i < index; i++) {
        rotation += this.data.roles[i].value;
      }
      return rotation * 3.6;
    },
    // 获取总活跃度
    getTotalValue() {
      return this.data.roles.reduce((sum, role) => sum + role.value, 0);
    },
    // 获取时段柱状图高度
    getTimelineHeight(hour) {
      var _a;
      const value = ((_a = this.data.timeline) == null ? void 0 : _a[hour]) || 0;
      return Math.max(value * 2, 20);
    },
    // 获取时段柱状图颜色
    getTimelineColor(hour) {
      var _a;
      const value = ((_a = this.data.timeline) == null ? void 0 : _a[hour]) || 0;
      if (value > 80)
        return "#ff4d4f";
      if (value > 50)
        return "#faad14";
      return "#1890ff";
    },
    // 获取时段值
    getTimelineValue(hour) {
      var _a;
      return ((_a = this.data.timeline) == null ? void 0 : _a[hour]) || 0;
    },
    // 获取高峰时段
    getPeakTime() {
      if (!this.data.timeline)
        return "--:--";
      let peakHour = 0;
      let peakValue = 0;
      for (let hour = 0; hour < 24; hour++) {
        const value = this.data.timeline[hour] || 0;
        if (value > peakValue) {
          peakValue = value;
          peakHour = hour;
        }
      }
      return `${peakHour.toString().padStart(2, "0")}:00`;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.data.roles, (role, index, i0) => {
      return {
        a: role.name,
        b: $data.colors[index],
        c: `rotate(${$options.getRotation(index)}deg)`,
        d: `${role.value}%`
      };
    }),
    b: common_vendor.t($options.getTotalValue()),
    c: common_vendor.f($props.data.roles, (role, index, i0) => {
      return {
        a: $data.colors[index],
        b: common_vendor.t(role.name),
        c: common_vendor.t(role.value),
        d: role.name
      };
    }),
    d: common_vendor.t($options.getPeakTime()),
    e: common_vendor.f(24, (hour, index, i0) => {
      return common_vendor.e({
        a: $options.getTimelineHeight(index) > 60
      }, $options.getTimelineHeight(index) > 60 ? {
        b: common_vendor.t($options.getTimelineValue(index))
      } : {}, {
        c: hour,
        d: `${$options.getTimelineHeight(index)}rpx`,
        e: $options.getTimelineColor(index)
      });
    }),
    f: common_vendor.f([0, 6, 12, 18, 23], (hour, k0, i0) => {
      return {
        a: common_vendor.t(hour),
        b: hour
      };
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/admin/components/user-activity-chart.js.map
