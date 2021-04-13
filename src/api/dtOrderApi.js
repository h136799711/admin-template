/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const dtOrderApi = {
    async query (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtOrder/query')
    },
    async setOut (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtOrder/setOut')
	},
    async queryComplaints (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtOrder/queryComplaints')
	},
	
	
};

export default dtOrderApi;
