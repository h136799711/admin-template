/* eslint-disable */
'use strict'
import http from '../assets/js/http.js'

const goodsPlaceApi = {
    create (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, {
            service_type: 'by_SpGoodsPlace_create'
        }), suc, fail)
    },
    update (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpGoodsPlace_update' }), suc, fail)
    },
    query (data) {
        return http.methods.promisePost(Object.assign(data, { service_type: 'by_SpGoodsPlace_query' }))
    },
    delete (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpGoodsPlace_delete' }), suc, fail)
    }
}

export default goodsPlaceApi
