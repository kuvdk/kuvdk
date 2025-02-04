"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "StorageChart",
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      colors: {
        supplier: "#1890ff",
        production: "#52c41a",
        management: "#faad14"
      },
      labels: {
        supplier: "供应商仓",
        production: "生产仓",
        management: "管理仓"
      }
    };
  },
  methods: {
    getRotation(key) {
      let rotation = 0;
      for (const k in this.data) {
        if (k === key)
          break;
        rotation += this.data[k];
      }
      return rotation * 3.6;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.data, (value, key, i0) => {
      return {
        a: key,
        b: $data.colors[key],
        c: `rotate(${$options.getRotation(key)}deg)`,
        d: `${value}%`
      };
    }),
    b: common_vendor.f($props.data, (value, key, i0) => {
      return {
        a: $data.colors[key],
        b: common_vendor.t($data.labels[key]),
        c: common_vendor.t(value),
        d: key
      };
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/admin/components/storage-chart.js.map
