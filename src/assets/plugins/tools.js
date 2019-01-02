/* eslint-disable */
// tools.js 包含工具方法和固定的配置信息, 后期考虑移植配置信息到config.js 中
const api_url = process.env.API_ROOT_URI
const picture_url = process.env.PICTURE_UPLOAD_URI
const client_id = process.env.CLIENT_ID

const getVersion = () => {
  return process.env.APP_VERSION
}
const getAppId = () => {
  return client_id
}

// 设置会话id
const setSessionId = (sessionId) => {
  console.debug('set session_id', sessionId)
  window.cache.setValue('BY_SESSION_ID', sessionId, 3600)
}

// 获取会话id
const getSessionId = () => {
  let sessionId = window.cache.getValue('BY_SESSION_ID')
  console.debug('getSessionId', sessionId)
  if (typeof (sessionId) === 'undefined' || sessionId === '') {
    let UUID = require('uuid')
    sessionId = ('BY' + UUID.v4()).replace(/-/g, '')
		console.debug('generate session id', sessionId)
  }
  setSessionId(sessionId)
  return sessionId
}

const getApiUrl = url => {

	return `${api_url}`
  // 除去(Admin or admin)
//  url = url.replace(/(A|a)dmin\//, '')

  // 替换控制器驼峰为下划线
  //let func = url.substr(url.indexOf('/'))
  //let controller = url.substr(0, url.indexOf('/')).replace(/([a-zA-Z])([A-Z])/g, '$1_$2').toLowerCase()

 // return `${api_url}/${controller}${func}`
}

const getAvatarUrl = (id, size = 120) => {
  return `${picture_url}?uid=${id}&size=${size}`
}

const getKeyInObject = (object, exp) => {
  if (typeof object === 'undefined') return undefined
  let args = exp.split('.')
  let o = object
  for (let val of args) {
    if (typeof o === 'undefined' || !o.hasOwnProperty(val)) return undefined
    o = o[val]
  }
  return o
}

const returnTop = () => {
  window.scrollBy(0, -100)
  if (document.body.scrollTop > 0) {
    setTimeout(returnTop, 50)
  }
}

const tools = {
	getVersion, getApiUrl, getAvatarUrl, getKeyInObject, returnTop, getAppId, getSessionId, setSessionId
}

export default tools
