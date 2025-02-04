"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const PdToast = () => "../../components/pd-toast/pd-toast.js";
const PdLoading = () => "../../components/pd-loading/pd-loading.js";
const _sfc_main = {
  components: {
    PdToast,
    PdLoading
  },
  data() {
    return {
      stats: {
        pending: 0,
        today: 0,
        rate: 0
      },
      orders: [],
      filterType: "all",
      loading: false,
      refreshing: false,
      page: 1,
      pageSize: 10,
      showApproval: false,
      currentOrder: null,
      approvalResult: "pass",
      qualifiedQuantity: 0,
      selectedReason: "",
      rejectRemark: "",
      rejectReasons: [
        "工艺不达标",
        "尺寸偏差",
        "表面瑕疵",
        "其他问题"
      ],
      submitting: false
    };
  },
  computed: {
    filteredOrders() {
      if (this.filterType === "urgent") {
        return this.orders.filter((order) => this.isUrgent(order));
      }
      return this.orders;
    },
    isValid() {
      if (!this.currentOrder)
        return false;
      if (this.approvalResult === "pass") {
        return this.qualifiedQuantity > 0 && this.qualifiedQuantity <= this.currentOrder.quantity;
      } else {
        return this.selectedReason && this.rejectRemark;
      }
    }
  },
  methods: {
    // 获取统计数据
    async fetchStats() {
      try {
        const res = await this.$api.quality.getStats();
        this.stats = res.data;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/quality/index.vue:260", "获取统计数据失败:", e);
      }
    },
    // 获取订单列表
    async fetchOrders(append = false) {
      if (this.loading)
        return;
      this.loading = true;
      try {
        const res = await this.$api.quality.getOrders({
          page: this.page,
          pageSize: this.pageSize
        });
        if (append) {
          this.orders = [...this.orders, ...res.data];
        } else {
          this.orders = res.data;
        }
        this.page++;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/quality/index.vue:283", "获取订单列表失败:", e);
      } finally {
        this.loading = false;
        this.refreshing = false;
      }
    },
    // 检查是否紧急订单
    isUrgent(order) {
      const hours = (Date.now() - new Date(order.createTime).getTime()) / (1e3 * 60 * 60);
      return hours >= 48;
    },
    // 格式化时间
    formatTime(time) {
      return new Date(time).toLocaleString();
    },
    // 筛选切换
    setFilter(type) {
      this.filterType = type;
    },
    // 显示订单详情
    showDetail(order) {
      this.currentOrder = order;
      this.approvalResult = "pass";
      this.qualifiedQuantity = order.quantity;
      this.selectedReason = "";
      this.rejectRemark = "";
      this.showApproval = true;
    },
    // 下拉刷新
    async onRefresh() {
      this.page = 1;
      await this.fetchOrders();
    },
    // 加载更多
    loadMore() {
      this.fetchOrders(true);
    },
    // 关闭审批弹窗
    closeApproval() {
      this.showApproval = false;
      this.currentOrder = null;
    },
    // 预览图片
    previewImage(index) {
      common_vendor.index.previewImage({
        urls: this.currentOrder.images,
        current: index
      });
    },
    // 审核结果变更
    handleResultChange(e) {
      this.approvalResult = e.detail.value;
    },
    // 更新合格数量
    updateQualifiedQuantity(delta) {
      const newValue = this.qualifiedQuantity + delta;
      if (newValue >= 0 && newValue <= this.currentOrder.quantity) {
        this.qualifiedQuantity = newValue;
      }
    },
    // 验证数量输入
    validateQuantity(e) {
      const value = Number(e.detail.value);
      if (value < 0)
        this.qualifiedQuantity = 0;
      if (value > this.currentOrder.quantity) {
        this.qualifiedQuantity = this.currentOrder.quantity;
      }
    },
    // 选择退回原因
    selectReason(reason) {
      this.selectedReason = reason;
    },
    // 提交审核
    async handleSubmit() {
      if (!this.isValid)
        return;
      this.submitting = true;
      try {
        const data = {
          orderId: this.currentOrder.id,
          result: this.approvalResult,
          qualifiedQuantity: this.qualifiedQuantity,
          rejectReason: this.selectedReason,
          rejectRemark: this.rejectRemark
        };
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        this.$refs.toast.show({
          type: "success",
          message: "审核完成"
        });
        this.closeApproval();
        this.fetchOrders();
      } catch (e) {
        this.$refs.toast.show({
          type: "error",
          message: "提交失败"
        });
      } finally {
        this.submitting = false;
      }
    }
  },
  onLoad() {
    this.fetchStats();
    this.fetchOrders();
  }
};
if (!Array) {
  const _easycom_pd_toast2 = common_vendor.resolveComponent("pd-toast");
  const _easycom_pd_loading2 = common_vendor.resolveComponent("pd-loading");
  (_easycom_pd_toast2 + _easycom_pd_loading2)();
}
const _easycom_pd_toast = () => "../../components/pd-toast/pd-toast.js";
const _easycom_pd_loading = () => "../../components/pd-loading/pd-loading.js";
if (!Math) {
  (_easycom_pd_toast + _easycom_pd_loading)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.stats.pending),
    b: common_vendor.t($data.stats.today),
    c: common_vendor.t($data.stats.rate),
    d: $data.filterType === "all" ? 1 : "",
    e: common_vendor.o(($event) => $options.setFilter("all")),
    f: $data.filterType === "urgent" ? 1 : "",
    g: common_vendor.o(($event) => $options.setFilter("urgent")),
    h: common_vendor.f($options.filteredOrders, (order, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(order.productCode),
        b: $options.isUrgent(order)
      }, $options.isUrgent(order) ? {} : {}, {
        c: common_vendor.t(order.quantity),
        d: common_vendor.t(order.params.temperature),
        e: common_vendor.t(order.params.pressure),
        f: common_vendor.t($options.formatTime(order.createTime)),
        g: common_vendor.t(order.deptName),
        h: order.id,
        i: common_vendor.o(($event) => $options.showDetail(order), order.id)
      });
    }),
    i: $data.loading
  }, $data.loading ? {} : {}, {
    j: $options.filteredOrders.length === 0
  }, $options.filteredOrders.length === 0 ? {
    k: common_assets._imports_0$3
  } : {}, {
    l: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    m: $data.refreshing,
    n: common_vendor.o((...args) => $options.onRefresh && $options.onRefresh(...args)),
    o: $data.showApproval
  }, $data.showApproval ? common_vendor.e({
    p: common_vendor.o((...args) => $options.closeApproval && $options.closeApproval(...args)),
    q: common_vendor.f($data.currentOrder.images, (img, index, i0) => {
      return {
        a: index,
        b: img,
        c: common_vendor.o(($event) => $options.previewImage(index), index)
      };
    }),
    r: common_vendor.t($data.currentOrder.params.temperature),
    s: common_vendor.t($data.currentOrder.params.pressure),
    t: $data.approvalResult === "pass",
    v: $data.approvalResult === "reject",
    w: common_vendor.o((...args) => $options.handleResultChange && $options.handleResultChange(...args)),
    x: $data.approvalResult === "pass"
  }, $data.approvalResult === "pass" ? {
    y: common_vendor.o(($event) => $options.updateQualifiedQuantity(-1)),
    z: common_vendor.o([($event) => $data.qualifiedQuantity = $event.detail.value, (...args) => $options.validateQuantity && $options.validateQuantity(...args)]),
    A: $data.qualifiedQuantity,
    B: common_vendor.o(($event) => $options.updateQualifiedQuantity(1)),
    C: common_vendor.t($data.currentOrder.quantity)
  } : {}, {
    D: $data.approvalResult === "reject"
  }, $data.approvalResult === "reject" ? {
    E: common_vendor.f($data.rejectReasons, (reason, index, i0) => {
      return {
        a: common_vendor.t(reason),
        b: index,
        c: $data.selectedReason === reason ? 1 : "",
        d: common_vendor.o(($event) => $options.selectReason(reason), index)
      };
    }),
    F: $data.rejectRemark,
    G: common_vendor.o(($event) => $data.rejectRemark = $event.detail.value)
  } : {}, {
    H: !$options.isValid,
    I: $data.submitting,
    J: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args))
  }) : {}, {
    K: common_vendor.sr("toast", "c0068ca0-0"),
    L: $data.loading
  }, $data.loading ? {
    M: common_vendor.p({
      type: "global",
      text: "加载中..."
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/quality/index.js.map
