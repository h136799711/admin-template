/* eslint-disable */
'use strict'
import {defaultPost, promisePost} from '../assets/plugins/http.js'

const goodsApi = {
    create (data, suc, fail) {
        defaultPost('/100/SpGoods/create', data, suc, fail)
    },
    update (data, suc, fail) {
        defaultPost('/100/SpGoods/update' , data, suc, fail)
    },
    query (data) {
        return promisePost('/100/SpGoods/query', data)
    },
    queryGoodsId (data) {
        return promisePost('/100/SpGoods/queryGoodsId', data)
    },
    delete (data, suc, fail) {
        defaultPost('/100/SpGoods/delete' , data, suc, fail)
    },
    setShelfStatus (data, suc, fail) {
        defaultPost('/100/SpGoods/setShelfStatus' , data, suc, fail)
    },
    info (data, suc, fail) {
        defaultPost('/100/SpGoods/info' , data, suc, fail)
    }

}

export default goodsApi
