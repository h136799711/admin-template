/* eslint-disable */
'use strict'
import http from '../assets/plugins/http.js'

const goodsPlaceApi = {
    create (data, suc, fail) {
        http.defaultPost('/100/SpGoodsPlace/create', data, suc, fail)
    },
    update (data, suc, fail) {
        http.defaultPost('/100/SpGoodsPlace/update' , data, suc, fail)
    },
    query (data) {
        return http.promisePost('/100/SpGoodsPlace/query', data)
    },
    delete (data, suc, fail) {
        http.defaultPost('/100/SpGoodsPlace/delete' , data, suc, fail)
    }
}

export default goodsPlaceApi
