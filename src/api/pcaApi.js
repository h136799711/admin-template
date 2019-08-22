/* eslint-disable */
'use strict'
import http from '../assets/js/http.js'

const pcaApi = {
  query (data, suc, fail) {
    data.service_type = 'by_Pca_queryProvince'
    http.methods.defaultPost('', data, suc, fail)
  },
  queryCity (data, suc, fail) {
    data.service_type = 'by_Pca_queryCity'
    http.methods.defaultPost('', data, suc, fail)
  },
  queryArea (data, suc, fail) {
    data.service_type = 'by_Pca_queryCityArea'
    http.methods.defaultPost('', data, suc, fail)
  },
  queryTown (data, suc, fail) {
    data.service_type = 'by_Pca_queryTown'
    http.methods.defaultPost('', data, suc, fail)
  }
}

export default pcaApi
