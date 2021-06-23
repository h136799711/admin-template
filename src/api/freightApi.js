/* eslint-disable */
'use strict'
import http from '../assets/plugins/http.js'

const freightApi = {
    create (data, suc, fail) {
        http.defaultPost('/100/SpFreight/create', data, suc, fail)
    },
    update (data, suc, fail) {
        http.defaultPost('/100/SpFreight/update' , data, suc, fail)
    },
    query (data) {
        return http.promisePost('/100/SpFreight/query', data)
    },
    delete (data, suc, fail) {
        http.defaultPost('/100/SpFreight/delete' , data, suc, fail)
    }
}

export default freightApi
