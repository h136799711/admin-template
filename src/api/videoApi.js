/* eslint-disable */
'use strict'
import http from '../assets/js/http.js'

const videoApi = {
  create (data, suc, fail) {
    http.methods.defaultPost('', Object.assign(data, { service_type: 'by_Video_create' }), suc, fail)
  },
  info (data, suc, fail) {
    http.methods.defaultPost('', Object.assign(data, { service_type: 'by_Video_info' }), suc, fail)
  },
  update (data, suc, fail) {
    http.methods.defaultPost('', Object.assign(data, { service_type: 'by_Video_update' }), suc, fail)
  },
  query (data, suc, fail) {
    http.methods.defaultPost('', Object.assign(data, { service_type: 'by_Video_query' }), suc, fail)
  },
  delete (data, suc, fail) {
    http.methods.defaultPost('', Object.assign(data, { service_type: 'by_Video_delete' }), suc, fail)
  },

}

export default videoApi
