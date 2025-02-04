// 错误类型枚举
const ERROR_TYPES = {
  FILE_ACCESS: 'FILE_ACCESS',
  SOCKET_CLOSE: 'SOCKET_CLOSE',
  LOG_WRITE: 'LOG_WRITE'
}

// 错误处理类
export class ErrorHandler {
  constructor() {
    // 初始化错误计数器
    this.errorCount = {}
    
    // 错误重试配置
    this.retryConfig = {
      maxRetries: 3,
      retryDelay: 1000
    }
  }

  // 处理文件访问错误
  async handleFileError(error, operation) {
    console.warn('File access error:', error)
    
    // 检查是否是广告文件访问错误
    if(error.includes('interstitialAdExtInfo.txt')) {
      // 忽略广告文件错误，不影响业务
      return {
        success: true,
        ignored: true
      }
    }
    
    // 尝试创建目录
    try {
      const fs = uni.getFileSystemManager()
      await this.ensureDirectory(fs, operation.path)
      
      // 重试操作
      return await this.retryOperation(operation)
    } catch(e) {
      console.error('Failed to handle file error:', e)
      return {
        success: false,
        error: e
      }
    }
  }

  // 处理WebSocket关闭错误
  handleSocketClose(code) {
    // 规范化关闭码
    if(code !== 1000 && (code < 3000 || code > 4999)) {
      // 使用默认关闭码1000
      return {
        code: 1000,
        reason: 'Normal closure'
      }
    }
    
    return { code, reason: 'Custom close' }
  }

  // 处理日志写入错误
  async handleLogError(error, logData) {
    console.warn('Log write error:', error)
    
    try {
      // 尝试使用备用存储方案
      if(error.includes('miniprogramLog')) {
        // 使用本地存储
        const key = `log_${Date.now()}`
        uni.setStorageSync(key, {
          time: new Date().toISOString(),
          data: logData
        })
        
        // 定期清理过期日志
        this.cleanExpiredLogs()
        
        return {
          success: true,
          storage: 'local'
        }
      }
      
      return {
        success: false,
        error
      }
    } catch(e) {
      console.error('Failed to handle log error:', e)
      return {
        success: false,
        error: e
      }
    }
  }

  // 确保目录存在
  async ensureDirectory(fs, path) {
    try {
      await this.accessFile(fs, path)
    } catch(e) {
      // 目录不存在，创建目录
      await this.mkdir(fs, path)
    }
  }

  // 检查文件是否可访问
  accessFile(fs, path) {
    return new Promise((resolve, reject) => {
      fs.access({
        path,
        success: resolve,
        fail: reject
      })
    })
  }

  // 创建目录
  mkdir(fs, path) {
    return new Promise((resolve, reject) => {
      fs.mkdir({
        dirPath: path,
        recursive: true,
        success: resolve,
        fail: reject
      })
    })
  }

  // 重试操作
  async retryOperation(operation) {
    const key = operation.type
    this.errorCount[key] = (this.errorCount[key] || 0) + 1
    
    if(this.errorCount[key] > this.retryConfig.maxRetries) {
      return {
        success: false,
        error: 'Max retries exceeded'
      }
    }
    
    // 延迟重试
    await this.sleep(this.retryConfig.retryDelay)
    
    try {
      const result = await operation.execute()
      // 重置错误计数
      this.errorCount[key] = 0
      return result
    } catch(e) {
      return this.handleError(e, operation)
    }
  }

  // 清理过期日志
  cleanExpiredLogs() {
    try {
      const storage = uni.getStorageInfoSync()
      const keys = storage.keys
      
      // 清理7天前的日志
      const expireTime = Date.now() - 7 * 24 * 60 * 60 * 1000
      
      keys.forEach(key => {
        if(key.startsWith('log_')) {
          const timestamp = parseInt(key.split('_')[1])
          if(timestamp < expireTime) {
            uni.removeStorageSync(key)
          }
        }
      })
    } catch(e) {
      console.error('Failed to clean expired logs:', e)
    }
  }

  // 工具函数：延迟执行
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// 导出单例
export const errorHandler = new ErrorHandler() 