/* eslint-disable */
'use strict'
import {promisePost} from '../assets/plugins/http.js'

const dtCateApi = {
    async query (data) {
        return promisePost('/100/DtCate/query', data)
    },
    async update (data) {
        return promisePost('/100/DtCate/update', data);
    },
    async add (data) {
        return promisePost('/100/DtCate/add', data);
    },
    async delete (data) {
        return promisePost('/100/DtCate/delete', data);
    },
    async addGoods (data) {
        return promisePost('/100/DtCate/addGoods', data)
    },
    async removeGoods (data) {
        return promisePost('/100/DtCate/removeGoods', data);
    },
    async queryGoods (data) {
        return promisePost('/100/DtCate/queryGoods', data);
    }
};

export default dtCateApi
