// utils/util.js

/**
 * 格式化时间
 * @param {Date} date 日期对象
 * @param {string} format 格式字符串
 * @returns {string} 格式化后的时间字符串
 */
function formatTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month.toString().padStart(2, '0'))
    .replace('DD', day.toString().padStart(2, '0'))
    .replace('HH', hour.toString().padStart(2, '0'))
    .replace('mm', minute.toString().padStart(2, '0'))
    .replace('ss', second.toString().padStart(2, '0'))
}

/**
 * 相对时间格式化
 * @param {Date|string} time 时间
 * @returns {string} 相对时间字符串
 */
function formatRelativeTime(time) {
  if (typeof time === 'string') {
    time = new Date(time)
  }
  
  const now = new Date()
  const diff = now - time
  
  if (diff < 60000) { // 1分钟内
    return '刚刚'
  } else if (diff < 3600000) { // 1小时内
    return Math.floor(diff / 60000) + '分钟前'
  } else if (diff < 86400000) { // 1天内
    return Math.floor(diff / 3600000) + '小时前'
  } else if (diff < 604800000) { // 1周内
    return Math.floor(diff / 86400000) + '天前'
  } else {
    return formatTime(time, 'MM月DD日')
  }
}

/**
 * 验证手机号
 * @param {string} phone 手机号
 * @returns {boolean} 是否有效
 */
function validatePhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 验证邮箱
 * @param {string} email 邮箱
 * @returns {boolean} 是否有效
 */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * 联系方式脱敏
 * @param {string} contact 联系方式
 * @returns {string} 脱敏后的联系方式
 */
function maskContact(contact) {
  if (!contact) return ''
  
  if (validatePhone(contact)) { // 手机号
    return contact.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  } else if (validateEmail(contact)) { // 邮箱
    const parts = contact.split('@')
    const username = parts[0]
    if (username.length <= 2) {
      return '*'.repeat(username.length) + '@' + parts[1]
    } else {
      return username.substring(0, 2) + '***@' + parts[1]
    }
  } else { // 微信号等其他联系方式
    if (contact.length <= 3) {
      return '*'.repeat(contact.length)
    } else {
      return contact.substring(0, 2) + '***' + contact.substring(contact.length - 2)
    }
  }
}

/**
 * 防抖函数
 * @param {Function} func 要防抖的函数
 * @param {number} wait 等待时间
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 节流函数
 * @param {Function} func 要节流的函数
 * @param {number} limit 时间限制
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 显示成功提示
 * @param {string} title 提示标题
 * @param {number} duration 持续时间
 */
function showSuccess(title, duration = 2000) {
  wx.showToast({
    title: title,
    icon: 'success',
    duration: duration
  })
}

/**
 * 显示错误提示
 * @param {string} title 提示标题
 * @param {number} duration 持续时间
 */
function showError(title, duration = 2000) {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: duration
  })
}

/**
 * 显示加载提示
 * @param {string} title 提示标题
 */
function showLoading(title = '加载中...') {
  wx.showLoading({
    title: title,
    mask: true
  })
}

/**
 * 隐藏加载提示
 */
function hideLoading() {
  wx.hideLoading()
}

/**
 * 确认对话框
 * @param {string} content 内容
 * @param {string} title 标题
 * @returns {Promise<boolean>} 用户是否确认
 */
function confirm(content, title = '提示') {
  return new Promise((resolve) => {
    wx.showModal({
      title: title,
      content: content,
      success: (res) => {
        resolve(res.confirm)
      }
    })
  })
}

module.exports = {
  formatTime,
  formatRelativeTime,
  validatePhone,
  validateEmail,
  maskContact,
  debounce,
  throttle,
  showSuccess,
  showError,
  showLoading,
  hideLoading,
  confirm
}