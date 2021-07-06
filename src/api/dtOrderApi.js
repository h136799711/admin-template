/* eslint-disable */
'use strict';
import {promisePost} from '../assets/plugins/http.js';

const dtOrderApi = {
    async staticsGoods (data) {
        return promisePost('/100/DtOrder/staticsGoods', data)
    },
    async info (data) {
        return promisePost('/100/DtOrder/info', data)
    },
    async pass(data) {
        return promisePost('/100/DtOrder/pass', data)
    },
    async deny(data) {
        return promisePost('/100/DtOrder/deny', data)
    },
    async query (data) {
        return promisePost('/100/DtOrder/query', data)
    },
    async queryVerify (data) {
        return promisePost('/100/DtOrder/queryVerify', data)
    },
    async setOut (data) {
        return promisePost('/100/DtOrder/setOut', data)
    },
    async queryComplaints (data) {
        return promisePost('/100/DtOrder/queryComplaints', data)
    },
    async infoEvidence(data) {
        return promisePost('/100/DtOrder/info', data)
    }


};

export default dtOrderApi;
