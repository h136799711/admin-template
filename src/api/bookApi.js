/* eslint-disable */
'use strict'
import http from '../assets/plugins/http.js'

const bookApi = {
    category (data, suc, fail) {
        http.defaultPost('/100/BsBook/category' , data, suc, fail)
    },
    info (data, suc, fail) {
        http.defaultPost('/100/BsBook/info' , data, suc, fail)
    },
    batchSetEnd (data, suc, fail) {
        http.defaultPost('/100/BsBook/batchSetEnd' , data, suc, fail)
    },
    setEnd (data, suc, fail) {
        http.defaultPost('/100/BsBook/setEnd' , data, suc, fail)
    },
    setState (data, suc, fail) {
        http.defaultPost('/100/BsBook/setState' , data, suc, fail)
    },
    setSort (data, suc, fail) {
        http.defaultPost('/100/BsBookSource/setSort' , data, suc, fail)
    },
    update (data, suc, fail) {
        http.defaultPost('/100/BsBook/update' , data, suc, fail)
    },
    search (data, suc, fail) {
        http.defaultPost('/100/BsBook/search' , data, suc, fail)
    },
    queryChapters (data, suc, fail) {
        http.defaultPost('/100/BsBook/queryChapters' , data, suc, fail)
    },
    queryBookPages (data, suc, fail) {
        http.defaultPost('/100/BsBook/queryBookPages' , data, suc, fail)
    },
    setDefaultSource (data, suc, fail) {
        http.defaultPost('/100/BsBook/setDefaultSource' , data, suc, fail)
    },
    querySource (data, suc, fail) {
        http.defaultPost('/100/BsBookSource/query' , data, suc, fail)
    },
    queryAllSource (data, suc, fail) {
        http.defaultPost('/100/BsBookSource/queryAll' , data, suc, fail)
    },
    updateSource (data, suc, fail) {
        http.defaultPost('/100/BsBookSource/update' , data, suc, fail)
    },
    setSourceState (data, suc, fail) {
        http.defaultPost('/100/BsBookSource/setState' , data, suc, fail)
    },
    statics (data, suc, fail) {
        http.defaultPost('/100/BsBook/statics' , data, suc, fail)
    },

}

export default bookApi
