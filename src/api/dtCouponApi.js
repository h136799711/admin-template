/* eslint-disable */
'use strict'
import http from '../assets/js/http.js'

const dtCouponApi = {
    async query (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtCoupon/query')
    },
    async edit (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtCoupon/edit');
    },
    async create (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtCoupon/create');
    },
    async give (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtCoupon/give');
    },
    async delete (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtCoupon/delete');
    },
    async queryByUserId (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtCoupon/queryByUserId');
    },
    async queryByCouponId (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtCoupon/queryByCouponId');
    },
};

export default dtCouponApi
