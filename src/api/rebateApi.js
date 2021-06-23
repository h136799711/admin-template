/* eslint-disable */
'use strict';
import http from '../assets/plugins/http.js';

const rebateApi = {
  async edit (data) {
    return http.promisePost('/100/DtRechargeRebate/edit', data)
  },
  async create (data) {
    return http.promisePost('/100/DtRechargeRebate/create', data)
  },
  async query (data) {
    return http.promisePost('/100/DtRechargeRebate/query', data)
  },
  async delete (data) {
    return http.promisePost('/100/DtRechargeRebate/delete', data)
  },
};

export default rebateApi;
