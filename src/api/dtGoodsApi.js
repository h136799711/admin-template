/* eslint-disable */
'use strict'
import http from '../assets/js/http.js'

const dtGoodsApi = {

    async saveStock (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtGoods/saveStock')
    },
    async query (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtGoods/query')
    },
    async edit (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtGoods/edit');
    },
    async create (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtGoods/create');
    },
    async info (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtGoods/info');
    },
    async delete (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtGoods/delete');
    },
    async shelfOn (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtGoods/shelfOn');
    },
    async shelfOff (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtGoods/shelfOff');
    },
    async querySku (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtGoods/querySku')
    },
    async editSku (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtGoods/editSku');
    },
    async addSku (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtGoods/addSku');
    },
    async removeSku (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/DtGoods/removeSku');
    }
};

export default dtGoodsApi
