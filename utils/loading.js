class LoadingManager {
  constructor() {
    this.count = 0
    this.lastTimer = null
  }

  // 显示加载
  show(title = '加载中...') {
    this.count++
    
    // 清除上一次的定时器
    if(this.lastTimer) {
      clearTimeout(this.lastTimer)
      this.lastTimer = null
    }

    try {
      uni.showLoading({
        title,
        mask: true
      })
    } catch(e) {
      console.error('显示loading失败:', e)
    }
  }

  // 隐藏加载
  hide() {
    this.count--
    
    // 只有当计数为0时才真正隐藏
    if(this.count <= 0) {
      this.count = 0
      
      // 延迟关闭，避免闪烁
      this.lastTimer = setTimeout(() => {
        try {
          uni.hideLoading()
        } catch(e) {
          // 忽略hideLoading的错误
          console.warn('隐藏loading失败:', e)
        }
        this.lastTimer = null
      }, 100)
    }
  }

  // 强制隐藏所有loading
  hideAll() {
    this.count = 0
    try {
      uni.hideLoading()
    } catch(e) {
      console.warn('强制隐藏loading失败:', e)
    }
  }
}

export const loading = new LoadingManager()

// 请求拦截器中间件
export function loadingInterceptor(options = {}) {
  const title = options.title || '加载中...'
  
  return {
    // 请求前显示loading
    request(config) {
      if(config.loading !== false) {
        loading.show(title)
      }
      return config
    },
    
    // 响应后隐藏loading
    response(response) {
      if(response.config && response.config.loading !== false) {
        loading.hide()
      }
      return response
    },
    
    // 错误时也要隐藏loading
    error(error) {
      loading.hide()
      return Promise.reject(error)
    }
  }
} 