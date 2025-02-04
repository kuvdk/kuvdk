// 部门枚举
export const DEPARTMENTS = {
  // 磨房(需要品控审核)
  MF: {
    code: 'MF',
    name: '磨房',
    color: '#ff9800',
    needQC: true
  },
  // 车床(直接管理员审核)
  CB: {
    code: 'CB', 
    name: '车床',
    color: '#2196f3',
    needQC: false
  },
  // 钻床(直接管理员审核)
  ZC: {
    code: 'ZC',
    name: '钻床',
    color: '#4caf50',
    needQC: false
  }
}

// 订单状态
export const ORDER_STATUS = {
  PENDING: 'pending',    // 待处理
  QC_REVIEW: 'qc_review',// 品控审核中
  REJECTED: 'rejected',  // 已退回
  APPROVED: 'approved',  // 已通过
  FINISHED: 'finished'   // 已完成
}

// 审核结果
export const REVIEW_RESULT = {
  PASS: 'pass',     // 通过
  REJECT: 'reject'  // 退回
}

// 消息类型
export const MESSAGE_TYPE = {
  ORDER: 'order',     // 订单消息
  REVIEW: 'review',   // 审核消息
  SYSTEM: 'system'    // 系统消息
}

// 用户角色
export const USER_ROLES = {
  ADMIN: 'admin',         // 管理员
  QUALITY: 'quality',     // 品控
  PRODUCTION: 'production',// 生产部门
  SUPPLIER: 'supplier'    // 供应商
}

// 权限定义
export const PERMISSIONS = {
  // 查看权限
  VIEW_ALL_ORDERS: [USER_ROLES.ADMIN],
  VIEW_QC_REPORT: [USER_ROLES.QUALITY, USER_ROLES.ADMIN],
  
  // 操作权限
  SUBMIT_ORDER: [USER_ROLES.PRODUCTION, USER_ROLES.SUPPLIER],
  REVIEW_ORDER: [USER_ROLES.QUALITY, USER_ROLES.ADMIN],
  MODIFY_ORDER: [USER_ROLES.ADMIN],
  
  // 导出权限
  EXPORT_REPORT: [USER_ROLES.QUALITY, USER_ROLES.ADMIN]
} 