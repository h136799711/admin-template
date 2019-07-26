/* eslint-disable */
'use strict'
import http from '../assets/js/http.js'

const videoCateApi = {
  create (data, suc, fail) {
    http.methods.defaultPost('', Object.assign(data, { service_type: 'by_VideoCate_create' }), suc, fail)
  },
  info (data, suc, fail) {
    http.methods.defaultPost('', Object.assign(data, { service_type: 'by_VideoCate_info' }), suc, fail)
  },
  update (data, suc, fail) {
    http.methods.defaultPost('', Object.assign(data, { service_type: 'by_VideoCate_update' }), suc, fail)
  },
  query (data, suc, fail) {
    http.methods.defaultPost('', Object.assign(data, { service_type: 'by_VideoCate_query' }), suc, fail)
  },
  delete (data, suc, fail) {
    http.methods.defaultPost('', Object.assign(data, { service_type: 'by_VideoCate_delete' }), suc, fail)
  }
}

export default videoCateApi
