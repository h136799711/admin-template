/* eslint-disable */
// tools.js 包含工具方法和固定的配置信息, 后期考虑移植配置信息到config.js 中

const api_url = process.env.API_ROOT_URI
const picture_url = process.env.PICTURE_UPLOAD_URI
const client_id = process.env.CLIENT_ID

const getRouteMode = () => {
  return process.env.ROUTE_MODE
}
const getVersion = () => {
	return process.env.APP_VERSION
}
const getAppId = () => {
  return getClientId()
}
const clear = () => {
	window.cache.clear ();
}

const setClientId = (clientId) => {
  window.cache.setValue('BY_CLIENT_ID', clientId, 3600)
}

const getClientId = () => {
  let cId = window.cache.getValue('BY_CLIENT_ID')
  if (typeof (cId) === 'undefined' || cId === '') {
    cId = client_id
  }
  setClientId(cId)
  return cId
}
// 设置会话id
const setUID = (uid) => {
  // console.debug('set uid', uid)
	window.cache.setValue ('BY_UID', uid, 3600)
}

// 获取会话id
const getUID = () => {
	var uid = window.cache.getValue ('BY_UID')
  // console.debug('getUID', uid)
	if (typeof (uid) === 'undefined' || uid === '') {
		uid = 0
      console.debug('generate uid', uid)
	}
	setUID (uid)
	return uid
}
// 设置头像地址
const setAvatar = (avatar) => {
  // console.debug('set avatar', avatar)
	window.cache.setValue ('BY_AVATAR', avatar, 3600)
}

// 获取会话id
const getAvatar = () => {
	var avatar = window.cache.getValue ('BY_AVATAR')
  // console.debug('getAvatar', avatar)
	if (typeof (avatar) === 'undefined' || avatar === '') {
		avatar = 0
	}
	setAvatar (avatar)
	return avatar
}

// 设置会话id
const setSessionId = (sessionId) => {
  // console.debug('set session_id', sessionId)
	window.cache.setValue ('BY_SESSION_ID', sessionId, 3600)
}

// 获取会话id
const getSessionId = () => {
	let sessionId = window.cache.getValue ('BY_SESSION_ID')
  // console.debug('getSessionId', sessionId)
	if (typeof (sessionId) === 'undefined' || sessionId === '') {
		let UUID = require ('uuid')
		sessionId = ('BY' + UUID.v4 ()).replace (/-/g, '')
      console.debug('generate session id', sessionId)
	}
	setSessionId (sessionId)
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

const getAvatarUploadUrl = () => {
	return `${picture_url}`
}

const getImgUrl = (imgUrl) => {
	if (!imgUrl) return "";

	if (!_.startsWith(imgUrl, 'http')) {
		imgUrl = window.tools.getApiUrl() + imgUrl
	}

	return imgUrl
}

const getKeyInObject = (object, exp) => {
	if (typeof object === 'undefined') return undefined
	let args = exp.split ('.')
	let o = object
	for (let val of args) {
		if (typeof o === 'undefined' || !o.hasOwnProperty (val)) return undefined
		o = o[val]
	}
	return o
}

const returnTop = () => {
	window.scrollBy (0, -100)
	if (document.body.scrollTop > 0) {
		setTimeout (returnTop, 50)
	}
}

const getDeviceType = () => {
	var Sys = {};
	var ua = navigator.userAgent.toLowerCase ();
	var s;
	(s = ua.match (/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
		(s = ua.match (/msie ([\d\.]+)/)) ? Sys.ie = s[1] :
			(s = ua.match (/edge\/([\d\.]+)/)) ? Sys.edge = s[1] :
				(s = ua.match (/firefox\/([\d\.]+)/)) ? Sys.firefox = s[1] :
					(s = ua.match (/(?:opera|opr).([\d\.]+)/)) ? Sys.opera = s[1] :
						(s = ua.match (/chrome\/([\d\.]+)/)) ? Sys.chrome = s[1] :
							(s = ua.match (/version\/([\d\.]+).*safari/)) ? Sys.safari = s[1] : 0;
	// 根据关系进行判断
	if (Sys.ie) return 'IE';//('IE: ' + Sys.ie);
	if (Sys.edge) return 'EDGE';//('EDGE: ' + Sys.edge);
	if (Sys.firefox) return 'Firefox';//('Firefox: ' + Sys.firefox);
	if (Sys.chrome) return 'Chrome';//('Chrome: ' + Sys.chrome);
	if (Sys.opera) return 'Opera';//('Opera: ' + Sys.opera);
	if (Sys.safari) return'Safari';// ('Safari: ' + Sys.safari);
	return 'Unkonwn';
}

const getBrowseLanguage = () => {
	let lang = window.cache.getValue ('lang');
	console.debug('缓存语言设置', lang)
	if (!lang) {
		if (navigator.language) {
			lang = navigator.language;//获取浏览器配置语言，支持非IE浏览器
			lang = lang.substr (0, 2);//获取浏览器配置语言前两位
			// if (inArray)
          	let supportLanguages = ['en', 'zh']
			let isExists = supportLanguages.some(function (i) {
              return (i === lang)
			})
			if (isExists) {
              return lang
			} else {
              return 'zh'
			}
		} else {
          lang = 'zh'
		}
	} else {
		window.cache.setValue('lang', lang.value, 24 * 3600)
	}

	return lang;
}

const getTimezone = () => {
	var timezone = (0 - ((new Date ()).getTimezoneOffset ()) / 60);
	window.cache.setValue ('timezone', timezone, 8*3600);
	console.log ("时差", timezone, '小时');
	return timezone;
}

const tools = {
  getRouteMode,
	getImgUrl,
	getBrowseLanguage,
	getTimezone,
	clear,
	getDeviceType,
	getUID, setUID,
  getClientId, setClientId,
	getAvatar, setAvatar,
	getVersion, getApiUrl, getAvatarUploadUrl, getKeyInObject, returnTop, getAppId, getSessionId, setSessionId
}
String.prototype.trim = function (char, type) {
	if (char) {
		if (type == 'left') {
			return this.replace(new RegExp('^\\'+char+'+', 'g'), '');
		} else if (type == 'right') {
			return this.replace(new RegExp('\\'+char+'+$', 'g'), '');
		}
		return this.replace(new RegExp('^\\'+char+'+|\\'+char+'+$', 'g'), '');
	}
	return this.replace(/^\s+|\s+$/g, '');
};

Date.prototype.format = function(fmt) {
	var o = {
		"M+" : this.getMonth()+1,                 //月份
		"d+" : this.getDate(),                    //日
		"h+" : this.getHours(),                   //小时
		"m+" : this.getMinutes(),                 //分
		"s+" : this.getSeconds(),                 //秒
		"q+" : Math.floor((this.getMonth()+3)/3), //季度
		"S"  : this.getMilliseconds()             //毫秒
	};
	if(/(y+)/.test(fmt)) {
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("("+ k +")").test(fmt)){
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		}
	}
	return fmt;
}

export default tools
