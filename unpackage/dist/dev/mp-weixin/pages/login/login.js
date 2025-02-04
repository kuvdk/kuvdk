"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      phone: "",
      verifyCode: "",
      isPhoneValid: false,
      counting: false,
      counter: 60,
      timer: null,
      failCount: 0
    };
  },
  computed: {
    canLogin() {
      return this.isPhoneValid && this.verifyCode.length === 6;
    }
  },
  onLoad() {
    const cachedPhone = common_vendor.index.getStorageSync("lastPhone");
    if (cachedPhone) {
      this.phone = cachedPhone;
      this.validatePhone();
    }
  },
  methods: {
    validatePhone() {
      const phoneReg = /^1[3-9]\d{9}$/;
      this.isPhoneValid = phoneReg.test(this.phone);
    },
    focusCodeInput() {
      this.$refs.codeInput.focus();
    },
    onCodeInput(e) {
      this.verifyCode = e.detail.value.replace(/\D/g, "");
      if (this.verifyCode.length === 6) {
        this.handleLogin();
      }
    },
    getVerifyCode() {
      if (!this.isPhoneValid || this.counting)
        return;
      this.counting = true;
      this.counter = 60;
      this.timer = setInterval(() => {
        if (this.counter > 0) {
          this.counter--;
        } else {
          this.counting = false;
          clearInterval(this.timer);
        }
      }, 1e3);
      common_vendor.index.showLoading({ title: "发送中" });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "验证码已发送",
          icon: "none"
        });
      }, 1e3);
    },
    async handleLogin() {
      if (!this.canLogin)
        return;
      try {
        common_vendor.index.showLoading({ title: "登录中" });
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        common_vendor.index.setStorageSync("lastPhone", this.phone);
        this.failCount = 0;
        common_vendor.index.hideLoading();
        common_vendor.index.reLaunch({
          url: "/pages/index/index"
        });
      } catch (e) {
        this.failCount++;
        this.verifyCode = "";
        common_vendor.index.hideLoading();
        if (this.failCount >= 3) {
          common_vendor.index.showModal({
            title: "提示",
            content: "登录失败次数过多,请1小时后再试",
            showCancel: false
          });
          return;
        }
        common_vendor.index.showToast({
          title: "登录失败,请重试",
          icon: "none"
        });
      }
    }
  },
  onUnload() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: common_vendor.o([($event) => $data.phone = $event.detail.value, (...args) => $options.validatePhone && $options.validatePhone(...args)]),
    c: $data.phone,
    d: common_vendor.f(6, (item, index, i0) => {
      return {
        a: common_vendor.t($data.verifyCode[index] || ""),
        b: index,
        c: common_vendor.o((...args) => $options.focusCodeInput && $options.focusCodeInput(...args), index)
      };
    }),
    e: common_vendor.o([($event) => $data.verifyCode = $event.detail.value, (...args) => $options.onCodeInput && $options.onCodeInput(...args)]),
    f: $data.verifyCode,
    g: common_vendor.t($data.counting ? `${$data.counter}s后重试` : "获取验证码"),
    h: !$data.isPhoneValid || $data.counting,
    i: !$data.isPhoneValid || $data.counting ? 1 : "",
    j: common_vendor.o((...args) => $options.getVerifyCode && $options.getVerifyCode(...args)),
    k: !$options.canLogin,
    l: !$options.canLogin ? 1 : "",
    m: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
