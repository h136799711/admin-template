/* eslint-disable */
'use strict'
import {defaultPost,promisePost} from '../assets/plugins/http.js'

const goodsPlaceApi = {
    create (data, suc, fail) {
        defaultPost('/100/SpGoodsPlace/create', data, suc, fail)
    },
    update (data, suc, fail) {
        defaultPost('/100/SpGoodsPlace/update' , data, suc, fail)
    },
    query (data) {
        return promisePost('/100/SpGoodsPlace/query', data)
    },
    delete (data, suc, fail) {
        defaultPost('/100/SpGoodsPlace/delete' , data, suc, fail)
    }
}

export default goodsPlaceApi
