"use strict";
const utils_constants = require("../../utils/constants.js");
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
      selectedDept: "",
      // MF: 磨房, OTHER: 其他部门
      formData: {
        productCode: "",
        quantity: 1,
        unitPrice: "",
        totalPrice: 0,
        remark: ""
      },
      submitting: false
    };
  },
  computed: {
    isValid() {
      const { productCode, quantity, unitPrice } = this.formData;
      return this.selectedDept && productCode && quantity > 0 && unitPrice && !isNaN(parseFloat(unitPrice));
    },
    totalPrice() {
      if (!this.formData.unitPrice || !this.formData.quantity)
        return "0.00";
      const total = this.formData.quantity * parseFloat(this.formData.unitPrice);
      return total.toFixed(2);
    }
  },
  methods: {
    // 选择部门
    selectDept(dept) {
      this.selectedDept = dept;
      this.resetForm();
    },
    // 更新数量
    updateQuantity(type) {
      if (type === "minus" && this.formData.quantity > 1) {
        this.formData.quantity--;
      } else if (type === "plus") {
        this.formData.quantity++;
      }
      this.calculateTotal();
    },
    // 计算总价
    calculateTotal() {
      this.formData.totalPrice = this.totalPrice;
    },
    // 提交表单
    async handleSubmit() {
      if (!this.isValid || this.submitting)
        return;
      this.submitting = true;
      try {
        const orderData = {
          ...this.formData,
          deptCode: this.selectedDept,
          // 磨房部门提交到品控审核，其他部门直接到管理员审核
          status: this.selectedDept === "MF" ? utils_constants.ORDER_STATUS.QC_REVIEW : utils_constants.ORDER_STATUS.PENDING
        };
        const res = await this.$api.production.submitOrder(orderData);
        if (res.success) {
          this.$refs.toast.show({
            type: "success",
            message: this.selectedDept === "MF" ? "提交成功，等待品控审核" : "提交成功，等待管理审核"
          });
          this.resetForm();
        }
      } catch (e) {
        this.$refs.toast.show({
          type: "error",
          message: "提交失败"
        });
      } finally {
        this.submitting = false;
      }
    },
    // 重置表单
    resetForm() {
      this.formData = {
        productCode: "",
        quantity: 1,
        unitPrice: "",
        totalPrice: 0,
        remark: ""
      };
    }
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
    a: common_assets._imports_0$2,
    b: $data.selectedDept === "MF" ? 1 : "",
    c: common_vendor.o(($event) => $options.selectDept("MF")),
    d: common_assets._imports_1$1,
    e: $data.selectedDept === "OTHER" ? 1 : "",
    f: common_vendor.o(($event) => $options.selectDept("OTHER")),
    g: $data.selectedDept
  }, $data.selectedDept ? common_vendor.e({
    h: $data.formData.productCode,
    i: common_vendor.o(($event) => $data.formData.productCode = $event.detail.value),
    j: common_vendor.o(($event) => $options.updateQuantity("minus")),
    k: $data.formData.quantity,
    l: common_vendor.o(($event) => $data.formData.quantity = $event.detail.value),
    m: common_vendor.o(($event) => $options.updateQuantity("plus")),
    n: common_vendor.o([($event) => $data.formData.unitPrice = $event.detail.value, (...args) => $options.calculateTotal && $options.calculateTotal(...args)]),
    o: $data.formData.unitPrice,
    p: common_vendor.t($options.totalPrice),
    q: $data.formData.unitPrice && $data.formData.quantity
  }, $data.formData.unitPrice && $data.formData.quantity ? {
    r: common_vendor.t($data.formData.quantity),
    s: common_vendor.t($data.formData.unitPrice)
  } : {}, {
    t: $data.formData.remark,
    v: common_vendor.o(($event) => $data.formData.remark = $event.detail.value)
  }) : {}, {
    w: $data.selectedDept
  }, $data.selectedDept ? {
    x: common_vendor.t($data.selectedDept === "MF" ? "(待品控审核)" : "(待管理审核)"),
    y: !$options.isValid || $data.submitting,
    z: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args))
  } : {}, {
    A: common_vendor.sr("toast", "1d1acf04-0"),
    B: $data.submitting
  }, $data.submitting ? {
    C: common_vendor.p({
      type: "global",
      text: "提交中..."
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/production/index.js.map
