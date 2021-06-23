/* eslint-disable */
'use strict'
import http from '../assets/plugins/http.js'

const videoSourceApi = {
  create (data, suc, fail) {
    http.defaultPost('/100/VideoSource/create' , data, suc, fail)
  },
  info (data, suc, fail) {
    http.defaultPost('/100/VideoSource/info' , data, suc, fail)
  },
  update (data, suc, fail) {
    http.defaultPost('/100/VideoSource/update' , data, suc, fail)
  },
  query (data, suc, fail) {
    http.defaultPost('/100/VideoSource/query' , data, suc, fail)
  },
  queryComeFrom (data, suc, fail) {
    http.defaultPost('/100/VideoSource/queryComeFrom' , data, suc, fail)
  },
  delete (data, suc, fail) {
    http.defaultPost('/100/VideoSource/delete' , data, suc, fail)
  }
}

export default videoSourceApi
