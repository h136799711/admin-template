/* eslint-disable */
'use strict';
import {promisePost} from '../assets/plugins/http.js';

const rebateApi = {
  async edit (data) {
    return promisePost('/100/DtRechargeRebate/edit', data)
  },
  async create (data) {
    return promisePost('/100/DtRechargeRebate/create', data)
  },
  async query (data) {
    return promisePost('/100/DtRechargeRebate/query', data)
  },
  async delete (data) {
    return promisePost('/100/DtRechargeRebate/delete', data)
  },
};

export default rebateApi;
