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

const getDeviceType = () => {
  var Sys = {};
  var ua = navigator.userAgent.toLowerCase();
  var s;
  (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
    (s = ua.match(/msie ([\d\.]+)/)) ? Sys.ie = s[1] :
      (s = ua.match(/edge\/([\d\.]+)/)) ? Sys.edge = s[1] :
        (s = ua.match(/firefox\/([\d\.]+)/)) ? Sys.firefox = s[1] :
          (s = ua.match(/(?:opera|opr).([\d\.]+)/)) ? Sys.opera = s[1] :
            (s = ua.match(/chrome\/([\d\.]+)/)) ? Sys.chrome = s[1] :
              (s = ua.match(/version\/([\d\.]+).*safari/)) ? Sys.safari = s[1] : 0;
  // 根据关系进行判断
  if (Sys.ie) return ('IE: ' + Sys.ie);
  if (Sys.edge) return ('EDGE: ' + Sys.edge);
  if (Sys.firefox) return ('Firefox: ' + Sys.firefox);
  if (Sys.chrome) return ('Chrome: ' + Sys.chrome);
  if (Sys.opera) return ('Opera: ' + Sys.opera);
  if (Sys.safari) return ('Safari: ' + Sys.safari);
  return 'Unkonwn';
}

const tools = {
  getDeviceType,
	getVersion, getApiUrl, getAvatarUrl, getKeyInObject, returnTop, getAppId, getSessionId, setSessionId
}

export default tools
