/* eslint-disable */
'use strict'
import http from '../assets/js/http.js'

const spShopApi = {
    close (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpShop_close' }), suc, fail)
    },
    opening (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpShop_opening' }), suc, fail)
    },
    create (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpShop_create' }), suc, fail)
    },
    queryGoods (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpShop_removeGoods' }), suc, fail)
    },
    addGoods (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpShop_addGoods' }), suc, fail)
    },
    removeGoods (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpShop_removeGoods' }), suc, fail)
    },
    update (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpShop_update' }), suc, fail)
    },
    query (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpShop_query' }), suc, fail)
    },
    delete (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpShop_delete' }), suc, fail)
    }
}

export default spShopApi
