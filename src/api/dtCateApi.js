/* eslint-disable */
'use strict'
import http from '../assets/plugins/http.js'

const dtCateApi = {
    async query (data) {
        return http.promisePost('/100/DtCate/query', data)
    },
    async update (data) {
        return http.promisePost('/100/DtCate/update', data);
    },
    async add (data) {
        return http.promisePost('/100/DtCate/add', data);
    },
    async delete (data) {
        return http.promisePost('/100/DtCate/delete', data);
    },
    async addGoods (data) {
        return http.promisePost('/100/DtCate/addGoods', data)
    },
    async removeGoods (data) {
        return http.promisePost('/100/DtCate/removeGoods', data);
    },
    async queryGoods (data) {
        return http.promisePost('/100/DtCate/queryGoods', data);
    }
};

export default dtCateApi
