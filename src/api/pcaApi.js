/* eslint-disable */
'use strict'
import http from '../assets/js/http.js'

const pcaApi = {
  query (data, suc, fail) {
    http.methods.defaultPost('/100/Pca/queryProvince', data, suc, fail)
  },
  queryCity (data, suc, fail) {
    http.methods.defaultPost('/100/Pca/queryCity', data, suc, fail)
    // data.service_type = 'by_Pca_queryCity'
    // http.methods.defaultPost('', data, suc, fail)
  },
  queryArea (data, suc, fail) {
    http.methods.defaultPost('/100/Pca/queryCityArea', data, suc, fail)
    // data.service_type = 'by_Pca_queryCityArea'
    // http.methods.defaultPost('', data, suc, fail)
  },
  queryTown (data, suc, fail) {
    http.methods.defaultPost('/100/Pca/queryTown', data, suc, fail)
    // data.service_type = 'by_Pca_queryTown'
    // http.methods.defaultPost('', data, suc, fail)
  },
    query3Level (data, suc, fail) {
      http.methods.defaultPost('/100/Pca/query3Level', data, suc, fail)
      // data.service_type = 'by_Pca_query3Level'
      //   http.methods.defaultPost('', data, suc, fail)
    }
}

export default pcaApi
