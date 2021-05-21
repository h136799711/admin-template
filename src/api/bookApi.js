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
    batchSetEnd (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_BsBook_batchSetEnd' }), suc, fail)
    },
    setEnd (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_BsBook_setEnd' }), suc, fail)
    },
    setState (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_BsBook_setState' }), suc, fail)
    },
    setSort (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_BsBookSource_setSort' }), suc, fail)
    },
    update (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_BsBook_update' }), suc, fail)
    },
    search (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_BsBook_search' }), suc, fail)
    },
    queryChapters (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_BsBook_queryChapters' }), suc, fail)
    },
    queryBookPages (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_BsBook_queryBookPages' }), suc, fail)
    },
    setDefaultSource (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_BsBook_setDefaultSource' }), suc, fail)
    },
    querySource (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_BsBookSource_query' }), suc, fail)
    },
    queryAllSource (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_BsBookSource_queryAll' }), suc, fail)
    },
    updateSource (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_BsBookSource_update' }), suc, fail)
    },
    setSourceState (data, suc, fail) {
        http.methods.defaultPost('', Object.assign(data, { service_type: 'by_BsBookSource_setState' }), suc, fail)
    },
    statics (data, suc, fail) {
        http.methods.defaultPost('', Object.assign({ book_id: 0 }, { service_type: 'by_BsBook_statics' }), suc, fail)
    },

}

export default bookApi
