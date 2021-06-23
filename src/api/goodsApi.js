/* eslint-disable */
'use strict'
import http from '../assets/plugins/http.js'

const goodsApi = {
    create (data, suc, fail) {
        http.defaultPost('/100/SpGoods/create', data, suc, fail)
    },
    update (data, suc, fail) {
        http.defaultPost('/100/SpGoods/update' , data, suc, fail)
    },
    query (data) {
        return http.promisePost('/100/SpGoods/query', data)
    },
    queryGoodsId (data) {
        return http.promisePost('/100/SpGoods/queryGoodsId', data)
    },
    delete (data, suc, fail) {
        http.defaultPost('/100/SpGoods/delete' , data, suc, fail)
    },
    setShelfStatus (data, suc, fail) {
        http.defaultPost('/100/SpGoods/setShelfStatus' , data, suc, fail)
    },
    info (data, suc, fail) {
        http.defaultPost('/100/SpGoods/info' , data, suc, fail)
    }

}

export default goodsApi
