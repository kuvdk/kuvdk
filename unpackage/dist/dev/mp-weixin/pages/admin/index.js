"use strict";
const common_vendor = require("../../common/vendor.js");
const PdToast = () => "../../components/pd-toast/pd-toast.js";
const StorageChart = () => "./components/storage-chart.js";
const UserActivityChart = () => "./components/user-activity-chart.js";
const _sfc_main = {
  components: {
    PdToast,
    StorageChart,
    UserActivityChart
  },
  data() {
    return {
      // 快捷操作
      quickActions: [
        {
          icon: "📦",
          name: "库存调整",
          desc: "快速调整库存",
          type: "storage"
        },
        {
          icon: "📝",
          name: "订单审核",
          desc: "待处理订单",
          type: "order"
        },
        {
          icon: "💰",
          name: "结算处理",
          desc: "本月待结算",
          type: "settlement"
        }
      ],
      // 仓库数据
      storageData: {
        supplier: 30,
        production: 45,
        management: 25
      },
      // 活跃度数据
      activityData: {
        roles: [
          { name: "供应商", value: 40 },
          { name: "生产部", value: 35 },
          { name: "品控部", value: 15 },
          { name: "管理员", value: 10 }
        ],
        timeline: [
          /* 时段数据 */
        ]
      },
      // 待办事项
      todoList: [
        {
          type: "warning",
          tag: "库存",
          content: "原料库存不足，请及时处理",
          time: "10:30"
        },
        {
          type: "info",
          tag: "订单",
          content: "新订单待审核",
          time: "09:45"
        }
      ],
      // 功能模块
      modules: [
        {
          icon: "📊",
          name: "订单管理",
          desc: "订单查询与处理",
          path: "/pages/admin/orders"
        },
        {
          icon: "👥",
          name: "用户管理",
          desc: "用户权限控制",
          path: "/pages/admin/users"
        },
        {
          icon: "🏭",
          name: "仓库监控",
          desc: "库存实时监控",
          path: "/pages/admin/storage"
        },
        {
          icon: "💳",
          name: "财务中心",
          desc: "结算与对账",
          path: "/pages/admin/finance"
        }
      ],
      // 权限验证
      showAuth: false,
      authPassword: "",
      pendingAction: null
    };
  },
  methods: {
    // 刷新数据
    async refreshData() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        this.$refs.toast.show({
          type: "success",
          message: "数据已更新"
        });
      } catch (e) {
        this.$refs.toast.show({
          type: "error",
          message: "更新失败"
        });
      }
    },
    // 处理快捷操作
    handleQuickAction(type) {
      switch (type) {
        case "storage":
          this.showAuthModal(() => {
            common_vendor.index.navigateTo({ url: "/pages/admin/storage" });
          });
          break;
        case "order":
          common_vendor.index.navigateTo({ url: "/pages/admin/orders" });
          break;
        case "settlement":
          this.showAuthModal(() => {
            common_vendor.index.navigateTo({ url: "/pages/admin/finance" });
          });
          break;
      }
    },
    // 显示权限验证
    showAuthModal(callback) {
      this.pendingAction = callback;
      this.showAuth = true;
    },
    // 取消验证
    cancelAuth() {
      this.showAuth = false;
      this.authPassword = "";
      this.pendingAction = null;
    },
    // 确认验证
    async confirmAuth() {
      if (!this.authPassword) {
        this.$refs.toast.show({
          type: "warning",
          message: "请输入密码"
        });
        return;
      }
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.showAuth = false;
        this.authPassword = "";
        if (this.pendingAction) {
          this.pendingAction();
          this.pendingAction = null;
        }
      } catch (e) {
        this.$refs.toast.show({
          type: "error",
          message: "验证失败"
        });
      }
    },
    // 处理待办
    handleTodo(item) {
      common_vendor.index.__f__("log", "at pages/admin/index.vue:307", "处理待办:", item);
    },
    // 页面跳转
    navigateTo(url) {
      common_vendor.index.navigateTo({ url });
    }
  },
  onShow() {
    this.refreshData();
  }
};
if (!Array) {
  const _component_storage_chart = common_vendor.resolveComponent("storage-chart");
  const _component_user_activity_chart = common_vendor.resolveComponent("user-activity-chart");
  const _easycom_pd_toast2 = common_vendor.resolveComponent("pd-toast");
  (_component_storage_chart + _component_user_activity_chart + _easycom_pd_toast2)();
}
const _easycom_pd_toast = () => "../../components/pd-toast/pd-toast.js";
if (!Math) {
  _easycom_pd_toast();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.quickActions, (action, index, i0) => {
      return {
        a: common_vendor.t(action.icon),
        b: common_vendor.t(action.name),
        c: common_vendor.t(action.desc),
        d: index,
        e: common_vendor.o(($event) => $options.handleQuickAction(action.type), index)
      };
    }),
    b: common_vendor.o((...args) => $options.refreshData && $options.refreshData(...args)),
    c: common_vendor.o(($event) => $options.navigateTo("/pages/admin/storage")),
    d: common_vendor.o(_ctx.showStorageDetail),
    e: common_vendor.p({
      data: $data.storageData
    }),
    f: common_vendor.o(($event) => $options.navigateTo("/pages/admin/users")),
    g: common_vendor.p({
      data: $data.activityData
    }),
    h: common_vendor.t($data.todoList.length),
    i: common_vendor.f($data.todoList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.tag),
        b: common_vendor.n(item.type),
        c: common_vendor.t(item.content),
        d: common_vendor.t(item.time),
        e: index,
        f: common_vendor.o(($event) => $options.handleTodo(item), index)
      };
    }),
    j: common_vendor.f($data.modules, (module, index, i0) => {
      return {
        a: common_vendor.t(module.icon),
        b: common_vendor.t(module.name),
        c: common_vendor.t(module.desc),
        d: index,
        e: common_vendor.o(($event) => $options.navigateTo(module.path), index)
      };
    }),
    k: $data.showAuth
  }, $data.showAuth ? {
    l: $data.authPassword,
    m: common_vendor.o(($event) => $data.authPassword = $event.detail.value),
    n: common_vendor.o((...args) => $options.cancelAuth && $options.cancelAuth(...args)),
    o: common_vendor.o((...args) => $options.confirmAuth && $options.confirmAuth(...args))
  } : {}, {
    p: common_vendor.sr("toast", "f1ff1500-2")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/admin/index.js.map
