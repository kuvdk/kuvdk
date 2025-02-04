// 消息类型枚举
export const MSG_TYPES = {
  ORDER: 'order',
  APPROVAL: 'approval',
  NOTICE: 'notice'
}

// 消息优先级枚举
export const PRIORITY = {
  HIGH: 'high',    // 强提醒（震动+声音）
  NORMAL: 'normal',// 普通提醒
  LOW: 'low'       // 静默通知
}

// 消息管理类
export class NotificationService {
  constructor() {
    this.messageQueue = []
  }

  // 发送消息
  async sendMessage(message) {
    try {
      // 构建消息对象
      const msgObj = {
        id: Date.now(),
        type: message.type,
        title: message.title,
        content: message.content,
        priority: message.priority || PRIORITY.NORMAL,
        targetUsers: message.targetUsers || [],
        createTime: new Date().toISOString(),
        status: 'pending'
      }
      
      // 保存到本地队列
      this.messageQueue.push(msgObj)
      
      // 发送到服务器
      const result = await this.sendToServer(msgObj)
      
      // 更新发送状态
      msgObj.status = result.success ? 'sent' : 'failed'
      msgObj.sendTime = new Date().toISOString()
      
      // 触发本地通知
      if(result.success) {
        this.showLocalNotification(msgObj)
      }
      
      return result
      
    } catch(e) {
      console.error('发送消息失败:', e)
      return {
        success: false,
        error: e.message
      }
    }
  }

  // 发送到服务器
  async sendToServer(message) {
    // TODO: 调用消息推送API
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true })
      }, 500)
    })
  }

  // 显示本地通知
  showLocalNotification(message) {
    // 根据优先级处理
    switch(message.priority) {
      case PRIORITY.HIGH:
        // 震动提醒
        uni.vibrateShort()
        // 播放提示音
        const audio = uni.createInnerAudioContext()
        audio.src = '/static/notification.mp3'
        audio.play()
        break
        
      case PRIORITY.NORMAL:
        // 显示消息提示
        uni.showToast({
          title: message.title,
          icon: 'none'
        })
        break
        
      case PRIORITY.LOW:
        // 仅更新未读数
        break
    }
  }

  // 获取未读消息
  getUnreadMessages() {
    return this.messageQueue.filter(msg => !msg.readTime)
  }

  // 标记消息已读
  markAsRead(messageId) {
    const message = this.messageQueue.find(msg => msg.id === messageId)
    if(message) {
      message.readTime = new Date().toISOString()
    }
  }

  // 清理过期消息(90天)
  cleanExpiredMessages() {
    const expireTime = Date.now() - 90 * 24 * 60 * 60 * 1000
    this.messageQueue = this.messageQueue.filter(msg => {
      return new Date(msg.createTime).getTime() > expireTime
    })
  }
} 