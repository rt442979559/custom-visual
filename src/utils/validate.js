/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 *
 */
//  非空校验
export function validate_notNull(rule, value, callback) {
  if (undefined === value || value === null || value === '' || !/^[\s\S]*.*[^\s][\s\S]*$/.test(value)) {
    callback(new Error('请输入必填项'))
  } else {
    callback()
  }
}

//  整数校验
export function validate_integer(rule, value, callback) {
  if (!Number.isInteger(+value) || value < 0) {
    callback(new Error('请输入有效整数'))
  } else {
    callback()
  }
}

//  有效金额校验
export function validate_money(rule, value, callback) {
  if (!Number.isInteger(+value)) {
    callback(new Error('请输入有效金额'))
  } else {
    callback()
  }
}

//  身份证校验
export function validate_sfz(rule, value, callback) {
  if (!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value)) {
    callback(new Error('请输入有效身份证'))
  } else {
    callback()
  }
}

//  手机号|座机 校验
export function validate_sjh(rule, value, callback) {
  if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(value) && !/^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(value)) {
    callback(new Error('请输入有效手机号'))
  } else {
    callback()
  }
}

//  手机号校验
export function validate_sjh2(rule, value, callback) {
  if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(value)) {
    callback(new Error('请输入有效手机号'))
  } else {
    callback()
  }
}

// 简单中文姓名校验  2位以上中文
export function validate_xm(rule, value, callback) {
  if (!/^[\u4e00-\u9fa5]{2,}$/.test(value)) {
    callback(new Error('请输入有效中文姓名'))
  } else {
    callback()
  }
}

// 简单密码校验  6位以上不包含特殊符号
export function validate_password(rule, value, callback) {
  if (!/^[a-zA-Z0-9]{6,}$/.test(value)) {
    callback(new Error('请输入6位以上密码'))
  } else {
    callback()
  }
}

// 合法uri
export function validate_url(rule, value, callback) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  if (!reg.test(value)) {
    callback(new Error('请输入合法uri'))
  } else {
    callback()
  }
}

/* select 正则表达式 */
export function validate_sql_select(rule, value, callback) {
  const reg = /^(select)\s+.*(\s+from\s+.+)*(where*\s+.+)*$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确查询sql'))
  } else {
    callback()
  }
}
