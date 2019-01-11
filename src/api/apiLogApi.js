/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const apiLogApi = {
  query (data, suc, fail) {
    let url = window.tools.getApiUrl();
    data.service_type = 'by_Log_queryApi';
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

export default apiLogApi;
