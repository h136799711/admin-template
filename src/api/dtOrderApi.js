/* eslint-disable */
'use strict';
import http from '../assets/plugins/http.js';

const dtOrderApi = {
    async staticsGoods (data) {
        return http.promisePost('/100/DtOrder/staticsGoods', data)
    },
    async info (data) {
        return http.promisePost('/100/DtOrder/info', data)
    },
    async pass(data) {
        return http.promisePost('/100/DtOrder/pass', data)
    },
    async deny(data) {
        return http.promisePost('/100/DtOrder/deny', data)
    },
    async query (data) {
        return http.promisePost('/100/DtOrder/query', data)
    },
    async queryVerify (data) {
        return http.promisePost('/100/DtOrder/queryVerify', data)
    },
    async setOut (data) {
        return http.promisePost('/100/DtOrder/setOut', data)
    },
    async queryComplaints (data) {
        return http.promisePost('/100/DtOrder/queryComplaints', data)
    },
    async infoEvidence(data) {
        return http.promisePost('/100/DtOrder/info', data)
    }


};

export default dtOrderApi;
