/* eslint-disable */
'use strict'
import http from '../assets/js/http.js'

const videoSourceApi = {
  create (data, suc, fail) {
    http.methods.defaultPost('', Object.assign(data, { service_type: 'by_VideoSource_create' }), suc, fail)
  },
  info (data, suc, fail) {
    http.methods.defaultPost('', Object.assign(data, { service_type: 'by_VideoSource_info' }), suc, fail)
  },
  update (data, suc, fail) {
    http.methods.defaultPost('', Object.assign(data, { service_type: 'by_VideoSource_update' }), suc, fail)
  },
  query (data, suc, fail) {
    http.methods.defaultPost('', Object.assign(data, { service_type: 'by_VideoSource_query' }), suc, fail)
  },
  queryComeFrom (data, suc, fail) {
    http.methods.defaultPost('', Object.assign(data, { service_type: 'by_VideoSource_queryComeFrom' }), suc, fail)
  },
  delete (data, suc, fail) {
    http.methods.defaultPost('', Object.assign(data, { service_type: 'by_VideoSource_delete' }), suc, fail)
  }
}

export default videoSourceApi
