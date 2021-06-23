/* eslint-disable */
'use strict'
import http from '../assets/plugins/http.js'

const bannersApi = {
    query (data, suc, fail) {
        http.defaultPost('/100/Banners/query', data, suc, fail)
    },
    queryPosition (data, suc, fail) {
        http.defaultPost('/100/Banners/queryPosition', data, suc, fail)
    },
    create (data, suc, fail) {
        http.defaultPost('/100/Banners/create', data, suc, fail)
    },
    update (data, suc, fail) {
        http.defaultPost('/100/Banners/update', data, suc, fail)
    },
    delete (data, suc, fail) {
        http.defaultPost('/100/Banners/delete', data, suc, fail)
    }
}

export default bannersApi
