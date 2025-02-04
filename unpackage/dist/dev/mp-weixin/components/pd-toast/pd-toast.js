"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "PdToast",
  data() {
    return {
      visible: false,
      message: "",
      type: "success",
      timer: null,
      showClose: false
    };
  },
  computed: {
    icon() {
      const icons = {
        success: "✓",
        warning: "!",
        error: "×"
      };
      return icons[this.type];
    }
  },
  methods: {
    show(options = {}) {
      this.message = options.message || "";
      this.type = options.type || "success";
      this.visible = true;
      this.showClose = this.type !== "success";
      if (this.type === "success") {
        if (this.timer)
          clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.close();
        }, 2e3);
      }
    },
    close() {
      this.visible = false;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.visible
  }, $data.visible ? common_vendor.e({
    b: common_vendor.t($options.icon),
    c: common_vendor.t($data.message),
    d: $data.showClose
  }, $data.showClose ? {
    e: common_vendor.o((...args) => $options.close && $options.close(...args))
  } : {}, {
    f: common_vendor.n($data.type)
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/pd-toast/pd-toast.js.map
