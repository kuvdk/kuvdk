// 日志级别
const LOG_LEVEL = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

// 日志存储配置
const LOG_CONFIG = {
  maxSize: 1024 * 1024, // 1MB
  maxDays: 7,           // 保存7天
  prefix: 'pd_log_'     // 日志文件前缀
}

class Logger {
  constructor() {
    this.level = LOG_LEVEL.INFO // 默认日志级别
    this.queue = []             // 日志队列
    this.timer = null          // 定时写入计时器
  }

  // 初始化
  init() {
    // 创建日志目录
    try {
      const fs = uni.getFileSystemManager()
      const userPath = `${uni.env.USER_DATA_PATH}/logs`
      
      fs.access({
        path: userPath,
        fail: () => {
          fs.mkdir({
            dirPath: userPath,
            recursive: true,
            fail: (err) => {
              console.error('创建日志目录失败:', err)
              // 使用备用存储方案
              this.useLocalStorage = true
            }
          })
        }
      })
    } catch(e) {
      console.error('初始化日志系统失败:', e)
      this.useLocalStorage = true
    }

    // 启动定时写入
    this.startTimer()
    
    // 清理过期日志
    this.cleanExpiredLogs()
  }

  // 写入日志
  async write(level, ...args) {
    if(level < this.level) return

    const log = {
      time: new Date().toISOString(),
      level: Object.keys(LOG_LEVEL)[level],
      content: args.map(arg => {
        if(typeof arg === 'object') {
          return JSON.stringify(arg)
        }
        return String(arg)
      }).join(' ')
    }

    this.queue.push(log)

    // 队列达到一定长度时立即写入
    if(this.queue.length >= 10) {
      await this.flush()
    }
  }

  // 立即写入日志
  async flush() {
    if(!this.queue.length) return

    const logs = this.queue.splice(0)
    
    if(this.useLocalStorage) {
      // 使用本地存储
      await this.writeToStorage(logs)
    } else {
      // 写入文件
      await this.writeToFile(logs)
    }
  }

  // 写入本地存储
  async writeToStorage(logs) {
    try {
      const key = `${LOG_CONFIG.prefix}${Date.now()}`
      uni.setStorageSync(key, logs)
    } catch(e) {
      console.error('写入日志到存储失败:', e)
    }
  }

  // 写入文件
  async writeToFile(logs) {
    try {
      const fs = uni.getFileSystemManager()
      const fileName = `${uni.env.USER_DATA_PATH}/logs/${LOG_CONFIG.prefix}${Date.now()}.log`
      
      const content = logs.map(log => 
        `[${log.time}] [${log.level}] ${log.content}`
      ).join('\n') + '\n'

      await new Promise((resolve, reject) => {
        fs.appendFile({
          filePath: fileName,
          data: content,
          encoding: 'utf8',
          success: resolve,
          fail: reject
        })
      })
    } catch(e) {
      console.error('写入日志文件失败:', e)
      // 失败时切换到本地存储
      this.useLocalStorage = true
      await this.writeToStorage(logs)
    }
  }

  // 清理过期日志
  async cleanExpiredLogs() {
    try {
      const now = Date.now()
      const expireTime = now - LOG_CONFIG.maxDays * 24 * 60 * 60 * 1000

      if(this.useLocalStorage) {
        // 清理存储中的日志
        const storage = uni.getStorageInfoSync()
        storage.keys.forEach(key => {
          if(key.startsWith(LOG_CONFIG.prefix)) {
            const timestamp = parseInt(key.split('_').pop())
            if(timestamp < expireTime) {
              uni.removeStorageSync(key)
            }
          }
        })
      } else {
        // 清理文件日志
        const fs = uni.getFileSystemManager()
        const logPath = `${uni.env.USER_DATA_PATH}/logs`
        
        fs.readdir({
          dirPath: logPath,
          success: (res) => {
            res.files.forEach(file => {
              if(file.startsWith(LOG_CONFIG.prefix)) {
                const filePath = `${logPath}/${file}`
                fs.stat({
                  path: filePath,
                  success: (stat) => {
                    if(stat.lastModifiedTime < expireTime) {
                      fs.unlink({
                        filePath,
                        fail: (err) => console.error('删除过期日志失败:', err)
                      })
                    }
                  }
                })
              }
            })
          }
        })
      }
    } catch(e) {
      console.error('清理过期日志失败:', e)
    }
  }

  // 启动定时写入
  startTimer() {
    if(this.timer) return
    
    this.timer = setInterval(() => {
      this.flush()
    }, 5000) // 每5秒写入一次
  }

  // 停止定时写入
  stopTimer() {
    if(this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  // 日志方法
  debug(...args) {
    this.write(LOG_LEVEL.DEBUG, ...args)
  }

  info(...args) {
    this.write(LOG_LEVEL.INFO, ...args)
  }

  warn(...args) {
    this.write(LOG_LEVEL.WARN, ...args)
  }

  error(...args) {
    this.write(LOG_LEVEL.ERROR, ...args)
  }
}

// 导出单例
export const logger = new Logger()

// 初始化日志系统
logger.init() 