/* eslint-disable */
'use strict'
import http from '../assets/plugins/http.js'

const dtStockHisApi = {
    async query (data) {
        return http.promisePost('/100/DtStockHistory/query', data)
    },
    async querySku (data) {
        return http.promisePost('/100/DtStockHistory/querySku', data)
    },
    async create (data) {
        return http.promisePost('/100/DtStockHistory/create', data);
    },
    async staticsGoods (data) {
        return http.promisePost('/100/DtStockHistory/staticsGoods', data);
    }
};

export default dtStockHisApi
