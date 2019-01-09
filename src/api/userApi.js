/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const userApi = {
  logout: (data, cb, failCb) => {
    console.debug('[ajax] userApi::logout 用户登出', data);
    let url = window.tools.getApiUrl('user/logout');
    http.methods.apiPost(url, data).then((res) => {
      if (res.code === 0) {
        cb(res);
      } else {
        failCb(res);
      }
    });
  },
  login: (data, cb, failCb) => {
    console.debug('[ajax] userApi::login 用户登录', data);
    let url = window.tools.getApiUrl();
    data.loginInfo = '';
    data.service_type = "by_UserLoginSession_loginByMobilePassword";
    http.methods.apiPost(url, data).then((res) => {
      if (res.code === 0) {
        cb(res);
      } else {
        failCb(res);
      }
    });
  },
  getUserData (cb, failCb) {
    console.debug('[ajax] userApi::getUserData 获取用户数据');
    let url = window.tools.getApiUrl();
    let data = {'service_type': 'by_UserLoginSession_adminData'};
    http.methods.apiPost(url, data).then((res) => {
      console.log(res);
      if (res.code === 0) {
        cb(res);
      } else {
        failCb(res);
      }
    });
  }
};

export default userApi;
