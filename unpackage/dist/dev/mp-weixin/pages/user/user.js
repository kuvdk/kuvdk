"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const PdToast = () => "../../components/pd-toast/pd-toast.js";
const _sfc_main = {
  components: {
    PdToast
  },
  data() {
    return {
      // 用户信息
      userInfo: {
        name: "张三",
        phone: "13800138000",
        deptName: "磨房",
        roleName: "生产部门"
      },
      // 统计数据
      recordCount: 0,
      cacheSize: "0MB",
      // 设置状态
      notificationEnabled: true,
      // 修改密码
      showPasswordModal: false,
      verifyCode: "",
      newPassword: "",
      confirmPassword: "",
      counting: false,
      countdown: 60
    };
  },
  computed: {
    isPasswordValid() {
      return this.verifyCode.length === 6 && this.newPassword.length >= 6 && this.newPassword === this.confirmPassword;
    }
  },
  methods: {
    // 格式化手机号
    formatPhone(phone) {
      return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    },
    // 发送验证码
    async sendVerifyCode() {
      if (this.counting)
        return;
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.counting = true;
        this.countdown = 60;
        const timer = setInterval(() => {
          this.countdown--;
          if (this.countdown <= 0) {
            clearInterval(timer);
            this.counting = false;
          }
        }, 1e3);
        this.$refs.toast.show({
          type: "success",
          message: "验证码已发送"
        });
      } catch (e) {
        this.$refs.toast.show({
          type: "error",
          message: "发送失败"
        });
      }
    },
    // 提交新密码
    async submitPassword() {
      if (!this.isPasswordValid)
        return;
      try {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        this.$refs.toast.show({
          type: "success",
          message: "密码修改成功"
        });
        this.closePasswordModal();
      } catch (e) {
        this.$refs.toast.show({
          type: "error",
          message: "修改失败"
        });
      }
    },
    // 切换通知状态
    async toggleNotification(e) {
      this.notificationEnabled = e.detail.value;
    },
    // 清除缓存
    async clearCache() {
      try {
        common_vendor.index.showLoading({ title: "清理中" });
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        this.cacheSize = "0MB";
        this.$refs.toast.show({
          type: "success",
          message: "清理完成"
        });
      } catch (e) {
        this.$refs.toast.show({
          type: "error",
          message: "清理失败"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    },
    // 退出登录
    handleLogout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.reLaunch({ url: "/pages/login/login" });
          }
        }
      });
    },
    // 页面跳转
    navigateTo(page) {
      common_vendor.index.navigateTo({ url: `/pages/user/${page}` });
    },
    // 打开修改密码弹窗
    changePassword() {
      this.showPasswordModal = true;
    },
    // 关闭修改密码弹窗
    closePasswordModal() {
      this.showPasswordModal = false;
      this.verifyCode = "";
      this.newPassword = "";
      this.confirmPassword = "";
    }
  },
  onShow() {
    common_vendor.index.getStorageInfo({
      success: (res) => {
        this.cacheSize = (res.currentSize / 1024).toFixed(2) + "MB";
      }
    });
    this.recordCount = 12;
  }
};
if (!Array) {
  const _easycom_pd_toast2 = common_vendor.resolveComponent("pd-toast");
  _easycom_pd_toast2();
}
const _easycom_pd_toast = () => "../../components/pd-toast/pd-toast.js";
if (!Math) {
  _easycom_pd_toast();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0$1,
    b: common_vendor.t($data.userInfo.name),
    c: common_vendor.t($data.userInfo.deptName),
    d: common_vendor.t($options.formatPhone($data.userInfo.phone)),
    e: common_vendor.t($data.userInfo.roleName),
    f: common_vendor.o((...args) => $options.changePassword && $options.changePassword(...args)),
    g: common_vendor.t($data.recordCount),
    h: common_vendor.o(($event) => $options.navigateTo("records")),
    i: common_vendor.o(($event) => $options.navigateTo("approvals")),
    j: $data.notificationEnabled,
    k: common_vendor.o((...args) => $options.toggleNotification && $options.toggleNotification(...args)),
    l: common_vendor.t($data.cacheSize),
    m: common_vendor.o((...args) => $options.clearCache && $options.clearCache(...args)),
    n: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args)),
    o: $data.showPasswordModal
  }, $data.showPasswordModal ? {
    p: common_vendor.o((...args) => $options.closePasswordModal && $options.closePasswordModal(...args)),
    q: $data.verifyCode,
    r: common_vendor.o(($event) => $data.verifyCode = $event.detail.value),
    s: common_vendor.t($data.counting ? `${$data.countdown}s` : "获取验证码"),
    t: $data.counting,
    v: common_vendor.o((...args) => $options.sendVerifyCode && $options.sendVerifyCode(...args)),
    w: $data.newPassword,
    x: common_vendor.o(($event) => $data.newPassword = $event.detail.value),
    y: $data.confirmPassword,
    z: common_vendor.o(($event) => $data.confirmPassword = $event.detail.value),
    A: !$options.isPasswordValid,
    B: common_vendor.o((...args) => $options.submitPassword && $options.submitPassword(...args))
  } : {}, {
    C: common_vendor.sr("toast", "76ebe9fd-0")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/user.js.map
