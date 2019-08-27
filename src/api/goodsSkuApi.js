/* eslint-disable */
'use strict'
import http from '../assets/js/http.js'

const goodsSkuApi = {
    create (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpGoodsSku_create' }), suc, fail)
    },
    query (data, suc, fail) {
        return http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpGoodsSku_query' }), suc, fail)
    }
}

export default goodsSkuApi
