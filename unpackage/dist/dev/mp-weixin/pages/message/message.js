"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      // 消息类型
      tabs: [
        { name: "全部", unread: 5 },
        { name: "订单", unread: 2 },
        { name: "审批", unread: 3 },
        { name: "公告", unread: 0 }
      ],
      activeTab: 0,
      // 消息列表
      messages: [
        {
          id: 1,
          type: "order",
          title: "订单状态更新",
          content: "您的订单MF-20240315-001已入库",
          time: Date.now() - 36e5,
          read: false
        },
        {
          id: 2,
          type: "approval",
          title: "待审批提醒",
          content: "您有2笔订单待质检，请及时处理",
          time: Date.now() - 72e5,
          read: false,
          urgent: true
        },
        {
          id: 3,
          type: "notice",
          title: "系统公告",
          content: "本月结算时间调整通知",
          time: Date.now() - 864e5,
          read: true
        }
      ],
      loading: false,
      refreshing: false,
      hasMore: true
    };
  },
  computed: {
    // 过滤后的消息列表
    filteredMessages() {
      if (this.activeTab === 0)
        return this.messages;
      const type = ["", "order", "approval", "notice"][this.activeTab];
      return this.messages.filter((msg) => msg.type === type);
    },
    // 是否有未读消息
    hasUnread() {
      return this.messages.some((msg) => !msg.read);
    }
  },
  methods: {
    // 切换消息类型
    switchTab(index) {
      this.activeTab = index;
    },
    // 获取消息图标
    getIcon(type) {
      const icons = {
        order: "📦",
        approval: "📝",
        notice: "📢"
      };
      return icons[type];
    },
    // 阅读消息
    async readMessage(msg) {
      if (msg.read)
        return;
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        msg.read = true;
        this.updateUnreadCount();
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/message/message.vue:160", "标记已读失败:", e);
      }
    },
    // 全部已读
    async markAllRead() {
      try {
        common_vendor.index.showLoading({ title: "处理中" });
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        this.messages.forEach((msg) => msg.read = true);
        this.updateUnreadCount();
        common_vendor.index.showToast({ title: "已全部标记为已读" });
      } catch (e) {
        common_vendor.index.showToast({
          title: "操作失败",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    },
    // 更新未读数量
    updateUnreadCount() {
      const counts = {
        order: 0,
        approval: 0,
        notice: 0
      };
      this.messages.forEach((msg) => {
        if (!msg.read) {
          counts[msg.type]++;
        }
      });
      this.tabs[0].unread = Object.values(counts).reduce((a, b) => a + b, 0);
      this.tabs[1].unread = counts.order;
      this.tabs[2].unread = counts.approval;
      this.tabs[3].unread = counts.notice;
    },
    // 加载更多
    async loadMore() {
      if (this.loading || !this.hasMore)
        return;
      this.loading = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        const newMessages = [];
        this.messages.push(...newMessages);
        this.hasMore = newMessages.length === 10;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/message/message.vue:220", "加载失败:", e);
      } finally {
        this.loading = false;
      }
    },
    // 下拉刷新
    async refresh() {
      this.refreshing = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        this.messages = [];
        this.hasMore = true;
        await this.loadMore();
      } finally {
        this.refreshing = false;
      }
    },
    // 格式化时间
    formatTime(timestamp) {
      const now = Date.now();
      const diff = now - timestamp;
      if (diff < 36e5) {
        return Math.floor(diff / 6e4) + "分钟前";
      }
      if (diff < 864e5) {
        return Math.floor(diff / 36e5) + "小时前";
      }
      const date = new Date(timestamp);
      return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    }
  },
  onShow() {
    this.refresh();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.tabs, (tab, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(tab.name),
        b: tab.unread
      }, tab.unread ? {
        c: common_vendor.t(tab.unread)
      } : {}, {
        d: index,
        e: $data.activeTab === index ? 1 : "",
        f: common_vendor.o(($event) => $options.switchTab(index), index)
      });
    }),
    b: common_vendor.f($options.filteredMessages, (msg, index, i0) => {
      return {
        a: common_vendor.t($options.getIcon(msg.type)),
        b: common_vendor.n(msg.type),
        c: common_vendor.t(msg.title),
        d: common_vendor.t($options.formatTime(msg.time)),
        e: common_vendor.t(msg.content),
        f: msg.id,
        g: !msg.read ? 1 : "",
        h: common_vendor.o(($event) => $options.readMessage(msg), msg.id)
      };
    }),
    c: $data.loading
  }, $data.loading ? {} : {}, {
    d: $options.filteredMessages.length === 0
  }, $options.filteredMessages.length === 0 ? {} : {}, {
    e: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    f: $data.refreshing,
    g: common_vendor.o((...args) => $options.refresh && $options.refresh(...args)),
    h: $options.hasUnread
  }, $options.hasUnread ? {
    i: common_vendor.o((...args) => $options.markAllRead && $options.markAllRead(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/message.js.map
