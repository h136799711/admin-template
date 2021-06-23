/* eslint-disable */
'use strict'
import http from '../assets/plugins/http.js'

const spCateApi = {
    create (data, suc, fail) {
        http.defaultPost('/100/SpCate/create', data, suc, fail)
    },
    info (data, suc, fail) {
        http.defaultPost('/100/SpCate/info', data, suc, fail)
    },
    update (data, suc, fail) {
        http.defaultPost('/100/SpCate/update', data, suc, fail)
    },
    query (data, suc, fail) {
        http.defaultPost('/100/SpCate/query', data, suc, fail)
    },
    query3Level (data, suc, fail) {
        http.defaultPost('/100/SpCate/query3Level', data, suc, fail)
    },
    delete (data, suc, fail) {
        http.defaultPost('/100/SpCate/delete', data, suc, fail)
    },
    relateProp (data, suc, fail) {
        http.defaultPost('/100/SpCate/relateProp', data, suc, fail)
    },
    removeProp (data, suc, fail) {
        http.defaultPost('/100/SpCate/removeProp', data, suc, fail)
    },
    relateBrand (data, suc, fail) {
        http.defaultPost('/100/SpCate/relateBrand', data, suc, fail)
    },
    removeBrand (data, suc, fail) {
        http.defaultPost('/100/SpCate/removeBrand', data, suc, fail)
    },
    getProp (data, suc, fail) {
        http.defaultPost('/100/SpCate/getProp', data, suc, fail)
    },
    getBrand (data, suc, fail) {
        http.defaultPost('/100/SpCate/getBrand', data, suc, fail)
    }
}

export default spCateApi
