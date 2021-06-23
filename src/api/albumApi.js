/* eslint-disable */
'use strict'
import http from '../assets/plugins/http.js'

const albumApi = {
    query (data, suc, fail) {
        http.defaultPost('/100/Album/query', data, suc, fail)
    },
    create (data, suc, fail) {
        http.defaultPost('/100/Album/create', data, suc, fail)
    },
    update (data, suc, fail) {
        http.defaultPost('/100/Album/update', data, suc, fail)
    },
    listPhoto (data, suc, fail) {
        http.defaultPost('/100/Album/listPhoto', data, suc, fail)
    },
    addPhoto (data, suc, fail) {
        http.defaultPost('/100/Album/addPhoto', data, suc, fail)
    },
    updatePhoto (data, suc, fail) {
        http.defaultPost('/100/Album/updatePhoto', data, suc, fail)
    },
    removePhoto (data, suc, fail) {
        http.defaultPost('/100/Album/removePhoto', data, suc, fail)
    },
    info (data, suc, fail) {
        http.defaultPost('/100/Album/info', data, suc, fail)
    },
    queryCategory (data, suc, fail) {
        http.defaultPost('/100/AlbumCategory/query', data, suc, fail)
    },
    queryAllCategory (data, suc, fail) {
        http.defaultPost('/100/AlbumCategory/all', data, suc, fail)
    },
    createCategory (data, suc, fail) {
        http.defaultPost('/100/AlbumCategory/create', data, suc, fail)
    },
    updateCategory (data, suc, fail) {
        http.defaultPost('/100/AlbumCategory/update', data, suc, fail)
    }
}

export default albumApi
