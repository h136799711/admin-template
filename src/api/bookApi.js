/* eslint-disable */
'use strict'
import http from '../assets/js/http.js'

const bookApi = {
    category (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_BsBook_category' }), suc, fail)
    },
    info (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_BsBook_info' }), suc, fail)
    },

    setState (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_BsBook_setState' }), suc, fail)
    },
    update (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_BsBook_update' }), suc, fail)
    },
    search (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_BsBook_search' }), suc, fail)
    },
    queryBookPages (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_BsBook_queryBookPages' }), suc, fail)
    },
    querySource (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_BsBookSource_query' }), suc, fail)
    },
    setSourceState (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_BsBookSource_setState' }), suc, fail)
    },

}

export default bookApi
