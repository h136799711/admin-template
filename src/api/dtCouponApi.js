/* eslint-disable */
'use strict'
import http from '../assets/plugins/http.js'

const dtCouponApi = {
    async query (data) {
        return http.promisePost('/100/DtCoupon/query', data)
    },
    async edit (data) {
        return http.promisePost('/100/DtCoupon/edit', data);
    },
    async create (data) {
        return http.promisePost('/100/DtCoupon/create', data);
    },
    async give (data) {
        return http.promisePost('/100/DtCoupon/give', data);
    },
    async delete (data) {
        return http.promisePost('/100/DtCoupon/delete', data);
    },
    async queryByUserId (data) {
        return http.promisePost('/100/DtCoupon/queryByUserId', data);
    },
    async queryByCouponId (data) {
        return http.promisePost('/100/DtCoupon/queryByCouponId', data);
    },
};

export default dtCouponApi
