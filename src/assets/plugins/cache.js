/* eslint-disable */
'use strict';

// 设置cookie , 过期时间 单位秒
const setCookie = (name, value, expireTime) => {
    // name = tools.md5Utils.hex_hmac_md5('asasi', name);
	if (expireTime) {
		var date = new Date();
		date.setTime(date.getTime()+(expireTime * 1000));
		var expires = "; expires="+date.toGMTString();
	} else {
		var expires = "";
	}
	document.cookie = name+"="+value+expires+"; path=/";
  // var d = new Date();
  // var newDate = new Date((d.getTime() + expireTime * 1000));
  // var expires = 'expires=' + newDate.toGMTString();
  // document.cookie = name + '=' + escape(value) + '; ' + expires;
};
// 获取cookie
const getCookie = (name) => {
    // var nameEQ = tools.md5Utils.hex_hmac_md5('asasi', name) + '=';
	var nameEQ = name + '=';
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return '';
};
// 清除cookie
const clearCookie = () => {
	var keys = document.cookie.match (/[^ =;]+(?=\=)/g);
	if (keys) {
		for (var i = keys.length; i > 0; i--) {
			document.cookie = keys[i] + '=0;expires=' + new Date (0).toUTCString ()
		}
	}
}

// 缓存设置
const getBigDataValue = (key) => {
    key = tools.md5Utils.hex_hmac_md5('asasi', key)
  var expireDateTime = Lockr.get(key + '_time');
  if (expireDateTime < (new Date()).getTime()) {
    return '';
  }
  return Lockr.get(key);
};
const setBigDataValue = (key, value, expireSeconds) => {
    key = tools.md5Utils.hex_hmac_md5('asasi', key)
  Lockr.set(key, value);
  var expireDateTime = ((new Date()).getTime() + expireSeconds * 1000);
  Lockr.set(key + '_time', expireDateTime);
};

// 缓存设置
const setValue = (key, value, expireSeconds) => {
  setCookie(key, value, expireSeconds);
};
// 缓存获取
const getValue = (key) => {
  return getCookie(key);
};
// 清除缓存
const clear = () => {
  clearCookie();
  Lockr.flush();
};

const cache = {
  setValue, getValue, clear, setBigDataValue, getBigDataValue
};

export default cache;
