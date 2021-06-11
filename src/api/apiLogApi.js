/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const apiLogApi = {
  query (data, suc, fail) {
    data.service_type = 'by_Log_queryApi';
    http.methods.defaultPost('', data, suc, fail);
  }
};

export default apiLogApi;
