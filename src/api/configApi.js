/* eslint-disable */
'use strict'
import http from '../assets/plugins/http.js'

const configApi = {
    query (data, suc, fail) {
        http.defaultPost('/100/Config/query', data, suc, fail)
    },
    create (data, suc, fail) {
        http.defaultPost('/100/Config/create', data, suc, fail)
    },
    listCate (data, suc, fail) {
        http.defaultPost('/100/Config/cate', data, suc, fail)
    },
    delete (data, suc, fail) {
        http.defaultPost('/100/Config/delete', data, suc, fail)
    },
    info (data, suc, fail) {
        http.defaultPost('/100/Config/info', data, suc, fail)
    },
    update (data, suc, fail) {
        http.defaultPost('/100/Config/update', data, suc, fail)
    }
}

export default configApi
