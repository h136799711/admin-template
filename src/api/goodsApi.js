/* eslint-disable */
'use strict'
import http from '../assets/js/http.js'

const goodsApi = {
  create (data, suc, fail) {
    http.methods.defaultPost('', Object.assign(data, {
      service_type: 'by_SpGoods_create'
    }), suc, fail)
  },
  update (data, suc, fail) {
    http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpGoods_update' }), suc, fail)
  },
  query (data) {
    return http.methods.promisePost(Object.assign(data, { service_type: 'by_SpGoods_query' }))
  },
    queryGoodsId (data) {
        return http.methods.promisePost(Object.assign(data, { service_type: 'by_SpGoods_queryGoodsId' }))
    },
  delete (data, suc, fail) {
    http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpGoods_delete' }), suc, fail)
  },
  setShelfStatus (data, suc, fail) {
    http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpGoods_setShelfStatus' }), suc, fail)
  },
  info (data, suc, fail) {
    http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpGoods_info' }), suc, fail)
  }

}

export default goodsApi
