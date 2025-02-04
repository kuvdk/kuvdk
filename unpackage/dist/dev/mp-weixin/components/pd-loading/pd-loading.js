"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "PdLoading",
  props: {
    type: {
      type: String,
      default: "button",
      validator: (value) => ["button", "global", "skeleton"].includes(value)
    },
    text: {
      type: String,
      default: ""
    },
    progress: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 3
      // 骨架屏项目数
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.type === "button"
  }, $props.type === "button" ? common_vendor.e({
    b: $props.text
  }, $props.text ? {
    c: common_vendor.t($props.text)
  } : {}) : {}, {
    d: $props.type === "global"
  }, $props.type === "global" ? common_vendor.e({
    e: `${$props.progress}%`,
    f: $props.text
  }, $props.text ? {
    g: common_vendor.t($props.text)
  } : {}) : {}, {
    h: $props.type === "skeleton"
  }, $props.type === "skeleton" ? {
    i: common_vendor.f($props.count, (i, k0, i0) => {
      return {
        a: i
      };
    })
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/pd-loading/pd-loading.js.map
