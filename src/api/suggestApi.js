/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const suggestApi = {
  reply(data, suc, fail) {
    data.service_type = 'by_Suggest_reply';
    http.methods.defaultPost('', data, suc, fail);
  },
  query (data, suc, fail) {
    let url = window.tools.getApiUrl();
    data.service_type = 'by_Suggest_query';
    http.methods.apiPost(url, data).then((res) => {
      if (res.code === 0) {
        if (typeof suc === 'function') {
          suc(res.data);
        } else {
          tools.alertSuc(res.msg);
        }
      } else {
        if (typeof fail === 'function') {
          fail(res);
        } else {
          tools.alertError(res.msg);
        }
      }
    });
  }
};

export default suggestApi;
