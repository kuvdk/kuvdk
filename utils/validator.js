// 数据验证类
export class DataValidator {
  // 验证订单数据
  static validateOrder(orderData) {
    const errors = []
    
    // 基础字段验证
    if(!orderData.productCode) {
      errors.push('产品编号不能为空')
    }
    
    if(!orderData.quantity || orderData.quantity < 1) {
      errors.push('数量必须大于0')
    }
    
    // 磨房订单特殊验证
    if(orderData.deptCode === 'MF') {
      if(!orderData.params?.temperature) {
        errors.push('温度参数不能为空')
      }
      if(!orderData.params?.pressure) {
        errors.push('压力参数不能为空')
      }
      if(!orderData.images?.length) {
        errors.push('至少需要上传1张检验照片')
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  // 验证质检数据
  static validateQC(qcData) {
    const errors = []
    
    if(qcData.result === 'pass') {
      if(!qcData.qualifiedQuantity || qcData.qualifiedQuantity < 1) {
        errors.push('合格数量必须大于0')
      }
      if(qcData.qualifiedQuantity > qcData.totalQuantity) {
        errors.push('合格数量不能大于总数量')
      }
    } else {
      if(!qcData.rejectReason) {
        errors.push('退回原因不能为空')
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  // 验证结算数据
  static validateSettlement(settlementData) {
    const errors = []
    
    // 验证结算金额
    const calculatedAmount = settlementData.quantity * settlementData.finalPrice
    if(Math.abs(settlementData.amount - calculatedAmount) > 0.01) {
      errors.push('结算金额计算有误')
    }
    
    // 验证审核状态
    if(!settlementData.reviewed) {
      errors.push('结算单需要管理员审核')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
} 