/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const suggestApi = {
  reply(data, suc, fail) {
    data.service_type = 'by_Suggest_reply';
    http.methods.defaultPost('', data, suc, fail);
  },
  query (data, suc, fail) {
    data.service_type = 'by_Suggest_query';
    http.methods.defaultPost('', data, suc, fail);
  }
};

export default suggestApi;
