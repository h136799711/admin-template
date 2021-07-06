/* eslint-disable */
'use strict'
import {defaultPost} from '../assets/plugins/http.js'

const pcaApi = {
  query (data, suc, fail) {
    defaultPost('/100/Pca/queryProvince', data, suc, fail)
  },
  queryCity (data, suc, fail) {
    defaultPost('/100/Pca/queryCity', data, suc, fail)
  },
  queryArea (data, suc, fail) {
    defaultPost('/100/Pca/queryCityArea', data, suc, fail)
  },
  queryTown (data, suc, fail) {
    defaultPost('/100/Pca/queryTown', data, suc, fail)
  },
    query3Level (data, suc, fail) {
      defaultPost('/100/Pca/query3Level', data, suc, fail)
    }
}

export default pcaApi
