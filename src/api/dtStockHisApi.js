/* eslint-disable */
'use strict'
import {promisePost} from '../assets/plugins/http.js'

const dtStockHisApi = {
    async query (data) {
        return promisePost('/100/DtStockHistory/query', data)
    },
    async querySku (data) {
        return promisePost('/100/DtStockHistory/querySku', data)
    },
    async create (data) {
        return promisePost('/100/DtStockHistory/create', data);
    },
    async staticsGoods (data) {
        return promisePost('/100/DtStockHistory/staticsGoods', data);
    }
};

export default dtStockHisApi
