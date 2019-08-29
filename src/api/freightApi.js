/* eslint-disable */
'use strict'
import http from '../assets/js/http.js'

const freightApi = {
    create (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, {
            service_type: 'by_SpFreight_create'
        }), suc, fail)
    },
    update (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpFreight_update' }), suc, fail)
    },
    query (data) {
        return http.methods.promisePost(Object.assign(data, { service_type: 'by_SpFreight_query' }))
    },
    delete (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpFreight_delete' }), suc, fail)
    }
}

export default freightApi
