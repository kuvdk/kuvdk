"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_logger = require("./utils/logger.js");
if (!Math) {
  "./pages/login/login.js";
  "./pages/index/index.js";
  "./pages/message/message.js";
  "./pages/user/user.js";
  "./pages/supplier/index.js";
  "./pages/production/index.js";
  "./pages/quality/index.js";
  "./pages/admin/index.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:6", "App Launch");
    const _this = this;
    common_vendor.index.onError(function(err) {
      if (err.includes("interstitialAdExtInfo.txt")) {
        return;
      }
      utils_logger.logger.error("App Error:", err);
      _this.reportError(err);
    });
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:23", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:26", "App Hide");
  },
  methods: {
    // 错误上报方法
    reportError(error) {
      {
        utils_logger.logger.warn("Error reported:", error);
      }
    }
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
