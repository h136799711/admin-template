/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const rebateApi = {
  async edit (data) {
    return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtRechargeRebate/edit')
  },
  async create (data) {
    return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtRechargeRebate/create')
  },
  async query (data) {
    return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtRechargeRebate/query')
  },
  async delete (data) {
    return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtRechargeRebate/delete')
  },
};

export default rebateApi;
