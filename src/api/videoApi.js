/* eslint-disable */
'use strict'
import {defaultPost} from '../assets/plugins/http.js'

const videoApi = {
  create (data, suc, fail) {
    defaultPost('/100/Video/create', data, suc, fail)
  },
  info (data, suc, fail) {
    defaultPost('/100/Video/info' , data, suc, fail)
  },
  update (data, suc, fail) {
    defaultPost('/100/Video/update' , data, suc, fail)
  },
  query (data, suc, fail) {
    defaultPost('/100/Video/query' , data, suc, fail)
  },
  delete (data, suc, fail) {
    defaultPost('/100/Video/delete' , data, suc, fail)
  },
  offShelves (data, suc, fail) {
    defaultPost('/100/Video/offline' , data, suc, fail)
  },
  onShelves (data, suc, fail) {
    defaultPost('/100/Video/online' , data, suc, fail)
  },
  recommend (data, suc, fail) {
    defaultPost('/100/Video/recommend' , data, suc, fail)
  },
  unrecommend (data, suc, fail) {
    defaultPost('/100/Video/unrecommend' , data, suc, fail)
  }

}

export default videoApi
