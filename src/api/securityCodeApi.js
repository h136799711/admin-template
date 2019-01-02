/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const securityCodeApi = {
  image_create (data, suc, fail) {
    let url = window.tools.getApiUrl('');
    data.service_type = 'by_SecurityCode_createImage';
    data.accepter = window.tools.getSessionId();
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

export default securityCodeApi;
