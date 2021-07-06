/* eslint-disable */
'use strict'
import {promisePost} from '../assets/plugins/http.js'

const dtGoodsApi = {
    async query (data) {
        return promisePost('/100/DtGoods/query', data)
    },
    async edit (data) {
        return promisePost('/100/DtGoods/edit', data);
    },
    async create (data) {
        return promisePost('/100/DtGoods/create', data);
    },
    async info (data) {
        return promisePost('/100/DtGoods/info', data);
    },
    async delete (data) {
        return promisePost('/100/DtGoods/delete', data);
    },
    async shelfOn (data) {
        return promisePost('/100/DtGoods/shelfOn', data);
    },
    async shelfOff (data) {
        return promisePost('/100/DtGoods/shelfOff', data);
    },
    async querySku (data) {
        return promisePost('/100/DtGoods/querySku', data)
    },
    async editSku (data) {
        return promisePost('/100/DtGoods/editSku', data);
    },
    async addSku (data) {
        return promisePost('/100/DtGoods/addSku', data);
    },
    async removeSku (data) {
        return promisePost('/100/DtGoods/removeSku', data);
    }
};

export default dtGoodsApi
