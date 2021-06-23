/* eslint-disable */
'use strict'
import http from '../assets/plugins/http.js'

const videoCateApi = {
  create (data, suc, fail) {
    http.defaultPost('/100/VideoCate/create' , data, suc, fail)
  },
  info (data, suc, fail) {
    http.defaultPost('/100/VideoCate/info' , data, suc, fail)
  },
  update (data, suc, fail) {
    http.defaultPost('/100/VideoCate/update' , data, suc, fail)
  },
  query (data, suc, fail) {
    http.defaultPost('/100/VideoCate/query' , data, suc, fail)
  },
  delete (data, suc, fail) {
    http.defaultPost('/100/VideoCate/delete' , data, suc, fail)
  }
}

export default videoCateApi
