/* eslint-disable */
'use strict'
import {defaultPost} from '../assets/plugins/http.js'

const bannersApi = {
    query (data, suc, fail) {
        defaultPost('/100/Banners/query', data, suc, fail)
    },
    queryPosition (data, suc, fail) {
        defaultPost('/100/Banners/queryPosition', data, suc, fail)
    },
    create (data, suc, fail) {
        defaultPost('/100/Banners/create', data, suc, fail)
    },
    update (data, suc, fail) {
        defaultPost('/100/Banners/update', data, suc, fail)
    },
    delete (data, suc, fail) {
        defaultPost('/100/Banners/delete', data, suc, fail)
    }
}

export default bannersApi
