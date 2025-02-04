"use strict";
const common_vendor = require("../common/vendor.js");
const LOG_LEVEL = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};
const LOG_CONFIG = {
  maxSize: 1024 * 1024,
  // 1MB
  maxDays: 7,
  // 保存7天
  prefix: "pd_log_"
  // 日志文件前缀
};
class Logger {
  constructor() {
    this.level = LOG_LEVEL.INFO;
    this.queue = [];
    this.timer = null;
  }
  // 初始化
  init() {
    try {
      const fs = common_vendor.index.getFileSystemManager();
      const userPath = `${common_vendor.index.env.USER_DATA_PATH}/logs`;
      fs.access({
        path: userPath,
        fail: () => {
          fs.mkdir({
            dirPath: userPath,
            recursive: true,
            fail: (err) => {
              common_vendor.index.__f__("error", "at utils/logger.js:37", "创建日志目录失败:", err);
              this.useLocalStorage = true;
            }
          });
        }
      });
    } catch (e) {
      common_vendor.index.__f__("error", "at utils/logger.js:45", "初始化日志系统失败:", e);
      this.useLocalStorage = true;
    }
    this.startTimer();
    this.cleanExpiredLogs();
  }
  // 写入日志
  async write(level, ...args) {
    if (level < this.level)
      return;
    const log = {
      time: (/* @__PURE__ */ new Date()).toISOString(),
      level: Object.keys(LOG_LEVEL)[level],
      content: args.map((arg) => {
        if (typeof arg === "object") {
          return JSON.stringify(arg);
        }
        return String(arg);
      }).join(" ")
    };
    this.queue.push(log);
    if (this.queue.length >= 10) {
      await this.flush();
    }
  }
  // 立即写入日志
  async flush() {
    if (!this.queue.length)
      return;
    const logs = this.queue.splice(0);
    if (this.useLocalStorage) {
      await this.writeToStorage(logs);
    } else {
      await this.writeToFile(logs);
    }
  }
  // 写入本地存储
  async writeToStorage(logs) {
    try {
      const key = `${LOG_CONFIG.prefix}${Date.now()}`;
      common_vendor.index.setStorageSync(key, logs);
    } catch (e) {
      common_vendor.index.__f__("error", "at utils/logger.js:100", "写入日志到存储失败:", e);
    }
  }
  // 写入文件
  async writeToFile(logs) {
    try {
      const fs = common_vendor.index.getFileSystemManager();
      const fileName = `${common_vendor.index.env.USER_DATA_PATH}/logs/${LOG_CONFIG.prefix}${Date.now()}.log`;
      const content = logs.map(
        (log) => `[${log.time}] [${log.level}] ${log.content}`
      ).join("\n") + "\n";
      await new Promise((resolve, reject) => {
        fs.appendFile({
          filePath: fileName,
          data: content,
          encoding: "utf8",
          success: resolve,
          fail: reject
        });
      });
    } catch (e) {
      common_vendor.index.__f__("error", "at utils/logger.js:124", "写入日志文件失败:", e);
      this.useLocalStorage = true;
      await this.writeToStorage(logs);
    }
  }
  // 清理过期日志
  async cleanExpiredLogs() {
    try {
      const now = Date.now();
      const expireTime = now - LOG_CONFIG.maxDays * 24 * 60 * 60 * 1e3;
      if (this.useLocalStorage) {
        const storage = common_vendor.index.getStorageInfoSync();
        storage.keys.forEach((key) => {
          if (key.startsWith(LOG_CONFIG.prefix)) {
            const timestamp = parseInt(key.split("_").pop());
            if (timestamp < expireTime) {
              common_vendor.index.removeStorageSync(key);
            }
          }
        });
      } else {
        const fs = common_vendor.index.getFileSystemManager();
        const logPath = `${common_vendor.index.env.USER_DATA_PATH}/logs`;
        fs.readdir({
          dirPath: logPath,
          success: (res) => {
            res.files.forEach((file) => {
              if (file.startsWith(LOG_CONFIG.prefix)) {
                const filePath = `${logPath}/${file}`;
                fs.stat({
                  path: filePath,
                  success: (stat) => {
                    if (stat.lastModifiedTime < expireTime) {
                      fs.unlink({
                        filePath,
                        fail: (err) => common_vendor.index.__f__("error", "at utils/logger.js:165", "删除过期日志失败:", err)
                      });
                    }
                  }
                });
              }
            });
          }
        });
      }
    } catch (e) {
      common_vendor.index.__f__("error", "at utils/logger.js:176", "清理过期日志失败:", e);
    }
  }
  // 启动定时写入
  startTimer() {
    if (this.timer)
      return;
    this.timer = setInterval(() => {
      this.flush();
    }, 5e3);
  }
  // 停止定时写入
  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  // 日志方法
  debug(...args) {
    this.write(LOG_LEVEL.DEBUG, ...args);
  }
  info(...args) {
    this.write(LOG_LEVEL.INFO, ...args);
  }
  warn(...args) {
    this.write(LOG_LEVEL.WARN, ...args);
  }
  error(...args) {
    this.write(LOG_LEVEL.ERROR, ...args);
  }
}
const logger = new Logger();
logger.init();
exports.logger = logger;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/logger.js.map
