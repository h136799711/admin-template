/* eslint-disable */
'use strict';
import http from '../assets/plugins/http.js';

const suggestApi = {
  reply(data, suc, fail) {
    http.defaultPost('/100/Suggest/reply', data, suc, fail);
  },
  query (data, suc, fail) {
    http.defaultPost('/100/Suggest/query', data, suc, fail);
  }
};

export default suggestApi;
