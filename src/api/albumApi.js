/* eslint-disable */
'use strict'
import {defaultPost} from '../assets/plugins/http.js'

const albumApi = {
    query (data, suc, fail) {
        defaultPost('/100/Album/query', data, suc, fail)
    },
    create (data, suc, fail) {
        defaultPost('/100/Album/create', data, suc, fail)
    },
    update (data, suc, fail) {
        defaultPost('/100/Album/update', data, suc, fail)
    },
    listPhoto (data, suc, fail) {
        defaultPost('/100/Album/listPhoto', data, suc, fail)
    },
    addPhoto (data, suc, fail) {
        defaultPost('/100/Album/addPhoto', data, suc, fail)
    },
    updatePhoto (data, suc, fail) {
        defaultPost('/100/Album/updatePhoto', data, suc, fail)
    },
    removePhoto (data, suc, fail) {
        defaultPost('/100/Album/removePhoto', data, suc, fail)
    },
    info (data, suc, fail) {
        defaultPost('/100/Album/info', data, suc, fail)
    },
    queryCategory (data, suc, fail) {
        defaultPost('/100/AlbumCategory/query', data, suc, fail)
    },
    queryAllCategory (data, suc, fail) {
        defaultPost('/100/AlbumCategory/all', data, suc, fail)
    },
    createCategory (data, suc, fail) {
        defaultPost('/100/AlbumCategory/create', data, suc, fail)
    },
    updateCategory (data, suc, fail) {
        defaultPost('/100/AlbumCategory/update', data, suc, fail)
    }
}

export default albumApi
