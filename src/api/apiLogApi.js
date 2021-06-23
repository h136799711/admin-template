/* eslint-disable */
'use strict';
import http from '../assets/plugins/http.js';

const apiLogApi = {
  query (data, suc, fail) {
    http.defaultPost('/100/Log/queryApi', data, suc, fail);
  }
};

export default apiLogApi;
