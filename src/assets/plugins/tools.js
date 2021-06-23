/* eslint-disable */
// tools.js 包含工具方法和固定的配置信息, 后期考虑移植配置信息到config.js 中

import * as types from '../../store/mutation-types'

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
    window.cache.clear()
}

const setClientId = (clientId, expire) => {
    if (!expire) {
        expire = getJwtExpireTime();
        if (expire <= 0) return;
    }
    let expireSec = expire - ((new Date()).getTime() / 1000).toFixed(0);
    expireSec = expireSec > 0 ? expireSec : 0;
    window.cache.setValue('BY_CLIENT_ID', clientId, expireSec)
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
const setUID = (uid, expire) => {
    if (!expire) {
        expire = getJwtExpireTime();
        if (expire <= 0) return;
    }
    let expireSec = expire - ((new Date()).getTime() / 1000).toFixed(0);
    expireSec = expireSec > 0 ? expireSec : 0;
    window.cache.setValue('BY_UID', uid, expireSec)
}

// 获取会话id
const getUID = () => {
    let uid = window.cache.getValue('BY_UID')
    // console.debug('getUID', uid)
    if (typeof (uid) === 'undefined' || uid === '') {
        uid = 0
    }
    setUID(uid)
    return parseInt(uid);
}

// 设置昵称
const setNick = (nick, expire) => {
    if (!expire) {
        expire = getJwtExpireTime();
        if (expire <= 0) return;
    }
    let expireSec = expire - ((new Date()).getTime() / 1000).toFixed(0);
    expireSec = expireSec > 0 ? expireSec : 0;
    window.cache.setValue('BY_NICK', nick, expireSec)
}

// 获取昵称
const getNick = () => {
    let nick = window.cache.getValue('BY_NICK')
    if (typeof (nick) === 'undefined' || nick === '') {
        nick = '';
    }
    setNick(nick)
    return nick;
}
// 设置头像地址
const setAvatar = (avatar, expire) => {
    if (!expire) {
        expire = getJwtExpireTime();
        if (expire <= 0) return;
    }
    let expireSec = expire - ((new Date()).getTime() / 1000).toFixed(0);
    expireSec = expireSec > 0 ? expireSec : 0;

    window.cache.setValue('BY_AVATAR', avatar, expireSec)
}

// 获取会话id
const getAvatar = () => {
    var avatar = window.cache.getValue('BY_AVATAR')
    if (typeof (avatar) === 'undefined' || avatar === '') {
        avatar = ''
    }
    setAvatar(avatar)
    return avatar
}
Date.prototype.getTimestamp = function () {
    return parseInt((this.getTime() / 1000).toFixed(0))
}

// 设置Jwt
const setJwt = (jwt, jwtExpire) => {
    let expireSec = jwtExpire - ((new Date()).getTime() / 1000).toFixed(0);
    expireSec = expireSec > 0 ? expireSec : 0;
    window.cache.setValue('BY_JWT', jwt, expireSec);
    window.cache.setValue('BY_JWT_TIME', jwtExpire, expireSec);
}

const getJwtExpireTime= () => {
    let jwtTime = window.cache.getValue('BY_JWT_TIME')
    if (typeof (jwtTime) === 'undefined' || jwtTime === '') {
        return 0
    }
    return parseInt(jwtTime)
}

// 获取会话id
const getJwt = () => {
    let jwt = window.cache.getValue('BY_JWT')
    if (typeof (jwt) === 'undefined' || jwt === '') {
        return ''
    }
    return jwt
}
// 设置会话id
// 会话ID 必有，随机生成的会缓存 1小时
const setSessionId = (sessionId, expire) => {
    if (!expire) {
        expire = getJwtExpireTime();
        if (expire <= 0) {
            // 默认 1小时
            expire = (new Date()).getTimestamp() + 3600;
        }
    }
    let expireSec = expire - (new Date()).getTimestamp();
    expireSec = expireSec > 0 ? expireSec : 0;

    window.cache.setValue('BY_SESSION_ID', sessionId, expireSec)
}
// 获取会话id
const getSessionId = () => {
    let sessionId = window.cache.getValue('BY_SESSION_ID')
    if (typeof (sessionId) === 'undefined' || sessionId === '') {
        let UUID = require('uuid')
        sessionId = ('DBH' + UUID.v4()).replace(/-/g, '')
        console.debug('generate session id', sessionId)
    }
    setSessionId(sessionId)
    return sessionId
}

const getApiUrl = () => {
    return getCurrentProtocol() + (`${api_url}`).replace('http:', '').replace('https:', '');
}

const getAvatarUploadUrl = () => {
    return getCurrentProtocol() + (`${picture_url}`).replace('http:', '').replace('https:', '')
}

const getImgUrl = (imgUrl) => {
    if (!imgUrl) return ''

    if (!_.startsWith(imgUrl, 'http')) {
        imgUrl = window.tools.getApiUrl() + imgUrl
    }

    return imgUrl
}
const getCurrentProtocol = () => {
    return window.location.protocol;
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
    var Sys = {}
    var ua = navigator.userAgent.toLowerCase()
    var s;
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
        (s = ua.match(/msie ([\d\.]+)/)) ? Sys.ie = s[1] :
            (s = ua.match(/edge\/([\d\.]+)/)) ? Sys.edge = s[1] :
                (s = ua.match(/firefox\/([\d\.]+)/)) ? Sys.firefox = s[1] :
                    (s = ua.match(/(?:opera|opr).([\d\.]+)/)) ? Sys.opera = s[1] :
                        (s = ua.match(/chrome\/([\d\.]+)/)) ? Sys.chrome = s[1] :
                            (s = ua.match(/version\/([\d\.]+).*safari/)) ? Sys.safari = s[1] : 0
    // 根据关系进行判断
    if (Sys.ie) return 'IE'//('IE: ' + Sys.ie);
    if (Sys.edge) return 'EDGE'//('EDGE: ' + Sys.edge);
    if (Sys.firefox) return 'Firefox'//('Firefox: ' + Sys.firefox);
    if (Sys.chrome) return 'Chrome'//('Chrome: ' + Sys.chrome);
    if (Sys.opera) return 'Opera'//('Opera: ' + Sys.opera);
    if (Sys.safari) return 'Safari'// ('Safari: ' + Sys.safari);
    return 'Unkonwn'
}

const getBrowseLanguage = () => {
    let lang = window.cache.getValue('lang')
    if (!lang) {
        if (navigator.language) {
            lang = navigator.language//获取浏览器配置语言，支持非IE浏览器
            lang = lang.substr(0, 2)//获取浏览器配置语言前两位

            let supportLanguages = ['en', 'zh']
            let isExists = supportLanguages.some(function (i) {
                return (i === lang)
            })
            if (!isExists) {
                lang = 'zh'
            }
        } else {
            lang = 'zh'
        }
    }
    window.cache.setValue('lang', lang, 24 * 3600)
    return lang
}

const getTimezone = () => {
    var timezone = (0 - ((new Date()).getTimezoneOffset()) / 60)
    window.cache.setValue('timezone', timezone, 8 * 3600)
    return timezone
}
const debug = (title, value) => {
    console.debug("%c " + title + " %c " + value + " ", "background:#606060;padding: 1px; border-radius: 3px 0px 0px 3px;color:#ffffff;", "background:#3474ad;padding: 1px; border-radius: 0px 3px 3px 0px;color:#ffffff;");
}
const setUserSessionData = (userSessionData) => {
    window.cache.setBigDataValue ('BY_USER_SESSION_DATA', userSessionData, 3600);
}
const getUserSessionData = () => {
    return window.cache.getBigDataValue ('BY_USER_SESSION_DATA');
}
const isLogin = () => {
    let sessionData = getUserSessionData();
    if (sessionData && sessionData !== '' && sessionData.data && sessionData.data.length > 0 && getJwt()) {
        return true;
    }
    return false;
}
const tools = {
    debug,
    setUserSessionData,
    getUserSessionData,
    getRouteMode,
    getImgUrl,
    getBrowseLanguage,
    getTimezone,
    clear,
    getDeviceType,
    getUID, setUID,
    getNick,setNick,
    getClientId, setClientId,
    getAvatar, setAvatar,
    getVersion, getApiUrl, getAvatarUploadUrl, getKeyInObject, returnTop, getAppId,
	getSessionId,
	getJwt, setJwt, getJwtExpireTime,
    isLogin,
}
String.prototype.trim = function (char, type) {
    if (char) {
        if (type == 'left') {
            return this.replace(new RegExp('^\\' + char + '+', 'g'), '')
        } else if (type == 'right') {
            return this.replace(new RegExp('\\' + char + '+$', 'g'), '')
        }
        return this.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '')
    }
    return this.replace(/^\s+|\s+$/g, '')
}

// 移除 removeSchema
String.prototype.removeSchema = function() {
    return this.replace("http:", "").replace("https:", "");
}

Date.prototype.format = function (fmt) {
    var o = {
        'M+': this.getMonth() + 1,                 //月份
        'd+': this.getDate(),                    //日
        'h+': this.getHours(),                   //小时
        'm+': this.getMinutes(),                 //分
        's+': this.getSeconds(),                 //秒
        'q+': Math.floor((this.getMonth() + 3) / 3), //季度
        'S': this.getMilliseconds()             //毫秒
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
    }
    return fmt
}

export default tools
