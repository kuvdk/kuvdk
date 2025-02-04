"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      title: "平德管理系统"
    };
  },
  onLoad() {
  },
  methods: {
    navigateTo(url) {
      common_vendor.index.navigateTo({
        url
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: common_assets._imports_1,
    c: common_vendor.o(($event) => $options.navigateTo("/pages/supplier/index")),
    d: common_assets._imports_2,
    e: common_vendor.o(($event) => $options.navigateTo("/pages/production/index")),
    f: common_assets._imports_3,
    g: common_vendor.o(($event) => $options.navigateTo("/pages/quality/index")),
    h: common_assets._imports_4,
    i: common_vendor.o(($event) => $options.navigateTo("/pages/admin/index"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
