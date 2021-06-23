/* eslint-disable */
'use strict';
import http from '../assets/plugins/http.js';

const dtOrderApi = {
    async info (data) {
        return http.promisePost('/100/DtOrder/info', data)
    },
    async query (data) {
        return http.promisePost('/100/DtOrder/query', data)
    },
    async setOut (data) {
        return http.promisePost('/100/DtOrder/setOut', data)
	},
    async queryComplaints (data) {
        return http.promisePost('/100/DtOrder/queryComplaints', data)
	},


};

export default dtOrderApi;
