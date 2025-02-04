// 角色枚举
export const ROLES = {
  SUPPLIER: 'supplier',
  PRODUCTION: 'production',
  QUALITY: 'quality',
  ADMIN: 'admin'
}

// 部门枚举
export const DEPARTMENTS = {
  MF: { code: 'MF', name: '磨房', needQC: true },
  CB: { code: 'CB', name: '车床', needQC: false },
  ZC: { code: 'ZC', name: '钻床', needQC: false }
}

// 权限矩阵
const PERMISSIONS = {
  // 查看权限
  VIEW_OTHERS_ORDER: [ROLES.ADMIN],
  VIEW_QC_REPORT: [ROLES.QUALITY, ROLES.ADMIN],
  VIEW_SETTLEMENT: [ROLES.SUPPLIER, ROLES.ADMIN],
  
  // 操作权限
  MODIFY_HISTORY: [ROLES.ADMIN],
  EXPORT_QC_REPORT: [ROLES.QUALITY, ROLES.ADMIN],
  MANAGE_USERS: [ROLES.ADMIN],
  
  // 基础权限
  RECEIVE_NOTIFICATION: [ROLES.SUPPLIER, ROLES.PRODUCTION, ROLES.QUALITY, ROLES.ADMIN],
  SUBMIT_ORDER: [ROLES.SUPPLIER, ROLES.PRODUCTION]
}

// 权限检查类
export class AuthService {
  constructor() {
    // 从本地存储获取用户信息
    this.userInfo = uni.getStorageSync('userInfo') || {}
  }

  // 检查是否有权限
  hasPermission(permissionKey) {
    const allowedRoles = PERMISSIONS[permissionKey] || []
    return allowedRoles.includes(this.userInfo.role)
  }

  // 检查是否是管理员
  isAdmin() {
    return this.userInfo.role === ROLES.ADMIN
  }

  // 检查是否是品控
  isQC() {
    return this.userInfo.role === ROLES.QUALITY
  }

  // 检查部门是否需要质检
  isDeptNeedQC(deptCode) {
    return DEPARTMENTS[deptCode]?.needQC || false
  }

  // 获取用户可访问的功能模块
  getAccessibleModules() {
    const modules = []
    
    if(this.hasPermission('SUBMIT_ORDER')) {
      modules.push({
        id: 'order',
        name: '订单管理',
        path: '/pages/order/index'
      })
    }
    
    if(this.hasPermission('VIEW_QC_REPORT')) {
      modules.push({
        id: 'quality',
        name: '质检管理',
        path: '/pages/quality/index'
      })
    }
    
    if(this.isAdmin()) {
      modules.push({
        id: 'admin',
        name: '系统管理',
        path: '/pages/admin/index'
      })
    }
    
    return modules
  }
} 