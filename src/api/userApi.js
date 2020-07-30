/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const userApi = {
    disable: (data, suc, fail) => {
        data.service_type = 'by_UserAccount_disable'
        http.methods.defaultPost('', data, suc, fail)
    },
    enable: (data, suc, fail) => {
        data.service_type = 'by_UserAccount_enable'
        http.methods.defaultPost('', data, suc, fail)
    },
  updatePassword(data, suc, fail) {
		data.service_type = 'by_UserLoginSession_updatePassword';
		http.methods.defaultPost('', data, suc, fail);
  },
	queryByPagingNoCount: (data, suc, fail) => {
		data.service_type = 'by_UserAccount_query';
		http.methods.defaultPost('', data, suc, fail);
  },
  logout: (data, cb, failCb) => {
    console.debug('[ajax] userApi::logout 用户登出', data);
    let url = window.tools.getApiUrl('user/logout');
		data.service_type = "by_UserLoginSession_logout";
    http.methods.apiPost(url, data).then((res) => {
      if (res.code === 0) {
        cb(res);
      } else {
        failCb(res);
      }
    });
    window.tools.clear();
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
