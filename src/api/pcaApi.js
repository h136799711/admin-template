/* eslint-disable */
'use strict'
import http from '../assets/plugins/http.js'

const pcaApi = {
  query (data, suc, fail) {
    http.defaultPost('/100/Pca/queryProvince', data, suc, fail)
  },
  queryCity (data, suc, fail) {
    http.defaultPost('/100/Pca/queryCity', data, suc, fail)
  },
  queryArea (data, suc, fail) {
    http.defaultPost('/100/Pca/queryCityArea', data, suc, fail)
  },
  queryTown (data, suc, fail) {
    http.defaultPost('/100/Pca/queryTown', data, suc, fail)
  },
    query3Level (data, suc, fail) {
      http.defaultPost('/100/Pca/query3Level', data, suc, fail)
    }
}

export default pcaApi
