/* eslint-disable */
'use strict'
import http from '../assets/plugins/http.js'

const goodsSkuApi = {
    create (data, suc, fail) {
        http.defaultPost('/100/SpGoodsSku/create', data, suc, fail)
    },
    query (data, suc, fail) {
        return http.defaultPost('/100/SpGoodsSku/query' , data, suc, fail)
    }
}

export default goodsSkuApi
