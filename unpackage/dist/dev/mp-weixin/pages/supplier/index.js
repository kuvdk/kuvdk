"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      // 表单数据
      formData: {
        productName: "",
        quantity: 1,
        price: ""
      },
      // 今日统计
      todayStats: {
        count: 0,
        amount: 0
      },
      // 历史记录
      historyList: [],
      showHistory: false,
      // 价格信息
      priceInfo: {
        show: false,
        avgPrice: 0,
        lastPrice: 0,
        minPrice: 0
        // 成本价
      },
      // 网络状态
      isOffline: false
    };
  },
  computed: {
    // 过滤后的历史记录
    filteredHistory() {
      if (!this.formData.productName)
        return [];
      return this.historyList.filter((item) => item.name.includes(this.formData.productName)).slice(0, 5);
    },
    // 总价
    totalAmount() {
      return this.formData.quantity * (Number(this.formData.price) || 0);
    },
    // 价格是否超出预警
    isPriceWarning() {
      if (!this.formData.price)
        return false;
      return Math.abs(this.formData.price - this.priceInfo.avgPrice) / this.priceInfo.avgPrice > 0.15;
    },
    // 是否可提交
    canSubmit() {
      return this.formData.productName.length >= 2 && this.formData.quantity >= 1 && this.formData.price >= this.priceInfo.minPrice;
    }
  },
  onLoad() {
    this.initData();
    common_vendor.index.onNetworkStatusChange((res) => {
      this.isOffline = !res.isConnected;
      if (res.isConnected) {
        this.syncOfflineData();
      }
    });
    this.restoreDraft();
  },
  methods: {
    // 初始化数据
    async initData() {
      try {
        this.todayStats = {
          count: 5,
          amount: 12345.67
        };
        this.historyList = [
          { name: "示例产品1", price: 100 },
          { name: "示例产品2", price: 200 }
        ];
        this.priceInfo = {
          show: false,
          avgPrice: 150,
          lastPrice: 160,
          minPrice: 80
        };
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/supplier/index.vue:195", e);
        common_vendor.index.showToast({
          title: "数据加载失败",
          icon: "none"
        });
      }
    },
    // 扫码处理
    handleScan() {
      common_vendor.index.scanCode({
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/supplier/index.vue:208", "扫码结果：", res);
        }
      });
    },
    // 产品名称输入
    onProductNameInput() {
      this.showHistory = true;
      this.saveDraft();
    },
    // 产品名称失焦
    onProductNameBlur() {
      setTimeout(() => {
        this.showHistory = false;
      }, 200);
    },
    // 选择历史记录
    selectHistory(item) {
      this.formData.productName = item.name;
      this.formData.price = item.price;
      this.showHistory = false;
      this.priceInfo.show = true;
      this.saveDraft();
    },
    // 更新数量
    updateQuantity(delta) {
      const newValue = Number(this.formData.quantity) + delta;
      if (newValue >= 1 && newValue <= 9999) {
        this.formData.quantity = newValue;
        this.saveDraft();
      }
    },
    // 验证数量
    validateQuantity(e) {
      const value = e.detail.value;
      if (value < 1)
        this.formData.quantity = 1;
      if (value > 9999)
        this.formData.quantity = 9999;
      this.saveDraft();
    },
    // 验证价格
    validatePrice() {
      this.priceInfo.show = true;
      this.saveDraft();
    },
    // 格式化价格
    formatPrice(price) {
      return Number(price).toLocaleString("zh", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    // 提交订单
    async handleSubmit() {
      if (!this.canSubmit)
        return;
      if (this.isPriceWarning) {
        const confirmed = await new Promise((resolve) => {
          common_vendor.index.showModal({
            title: "价格异常提醒",
            content: "当前单价与历史均价相差超过15%，是否继续提交？",
            success: (res) => resolve(res.confirm)
          });
        });
        if (!confirmed)
          return;
      }
      try {
        common_vendor.index.showLoading({ title: "提交中" });
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "提交成功",
          icon: "success"
        });
        this.formData = {
          productName: "",
          quantity: 1,
          price: ""
        };
        this.clearDraft();
      } catch (e) {
        common_vendor.index.hideLoading();
        if (this.isOffline) {
          this.saveOfflineData();
          common_vendor.index.showToast({
            title: "已保存至离线数据",
            icon: "none"
          });
        } else {
          common_vendor.index.showToast({
            title: "提交失败，请重试",
            icon: "none"
          });
        }
      }
    },
    // 保存草稿
    saveDraft() {
      common_vendor.index.setStorageSync("supplierDraft", this.formData);
    },
    // 恢复草稿
    restoreDraft() {
      const draft = common_vendor.index.getStorageSync("supplierDraft");
      if (draft) {
        this.formData = draft;
      }
    },
    // 清除草稿
    clearDraft() {
      common_vendor.index.removeStorageSync("supplierDraft");
    },
    // 保存离线数据
    saveOfflineData() {
      const offlineData = common_vendor.index.getStorageSync("offlineData") || [];
      offlineData.push({
        ...this.formData,
        timestamp: Date.now()
      });
      common_vendor.index.setStorageSync("offlineData", offlineData);
    },
    // 同步离线数据
    async syncOfflineData() {
      const offlineData = common_vendor.index.getStorageSync("offlineData");
      if (!(offlineData == null ? void 0 : offlineData.length))
        return;
      try {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        common_vendor.index.removeStorageSync("offlineData");
        common_vendor.index.showToast({
          title: "离线数据同步成功",
          icon: "success"
        });
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/supplier/index.vue:362", "离线数据同步失败", e);
      }
    },
    // 跳转历史记录
    toHistory() {
      common_vendor.index.navigateTo({
        url: "/pages/supplier/history"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.handleScan && $options.handleScan(...args)),
    b: common_vendor.t($data.todayStats.count),
    c: common_vendor.t($options.formatPrice($data.todayStats.amount)),
    d: common_vendor.o([($event) => $data.formData.productName = $event.detail.value, (...args) => $options.onProductNameInput && $options.onProductNameInput(...args)]),
    e: common_vendor.o(($event) => $data.showHistory = true),
    f: common_vendor.o((...args) => $options.onProductNameBlur && $options.onProductNameBlur(...args)),
    g: $data.formData.productName,
    h: $data.showHistory && $options.filteredHistory.length
  }, $data.showHistory && $options.filteredHistory.length ? {
    i: common_vendor.f($options.filteredHistory, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t($options.formatPrice(item.price)),
        c: index,
        d: common_vendor.o(($event) => $options.selectHistory(item), index)
      };
    })
  } : {}, {
    j: common_vendor.o(($event) => $options.updateQuantity(-1)),
    k: common_vendor.o([($event) => $data.formData.quantity = $event.detail.value, (...args) => $options.validateQuantity && $options.validateQuantity(...args)]),
    l: $data.formData.quantity,
    m: common_vendor.o(($event) => $options.updateQuantity(1)),
    n: $options.isPriceWarning ? 1 : "",
    o: common_vendor.o([($event) => $data.formData.price = $event.detail.value, (...args) => $options.validatePrice && $options.validatePrice(...args)]),
    p: $data.formData.price,
    q: $data.priceInfo.show
  }, $data.priceInfo.show ? {
    r: common_vendor.t($options.formatPrice($data.priceInfo.avgPrice)),
    s: common_vendor.t($options.formatPrice($data.priceInfo.lastPrice))
  } : {}, {
    t: common_vendor.t($options.formatPrice($options.totalAmount)),
    v: !$options.canSubmit,
    w: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args)),
    x: common_vendor.o((...args) => $options.toHistory && $options.toHistory(...args)),
    y: $data.isOffline
  }, $data.isOffline ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/supplier/index.js.map
