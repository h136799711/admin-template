/* eslint-disable */
'use strict'
import http from '../assets/js/http.js'

const dtCateApi = {
    async query (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtCate/query')
    },
    async update (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtCate/update');
    },
    async add (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtCate/add');
    },
    async delete (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtCate/delete');
    },
    async addGoods (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtCate/addGoods')
    },
    async removeGoods (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtCate/removeGoods');
    },
    async queryGoods (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtCate/queryGoods');
    }
};

export default dtCateApi
