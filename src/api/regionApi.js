/* eslint-disable */
'use strict'
import http from '../assets/js/http.js'

const regionApi = {
    query (data, suc, fail) {
        http.methods.defaultPost('/100/Country/query', data, suc, fail)
    },
    update (data, suc, fail) {
        http.methods.defaultPost('/100/Country/update', data, suc, fail)
    },
    queryProvince (data, suc, fail) {
        http.methods.defaultPost('/100/Pca/queryProvince', data, suc, fail)
    },
    async infoProvince (code)  {
        // http.methods.defaultPost('/100/Pca/infoProvince', data, suc, fail)
        return http.methods.promisePost({code: code}, window.tools.getApiUrl('') + '/100/Pca/infoProvince')
    },
    createProvince (data, suc, fail) {
        http.methods.defaultPost('/100/Pca/createProvince', data, suc, fail)
    },
    deleteProvince (data, suc, fail) {
        http.methods.defaultPost('/100/Pca/deleteProvince', data, suc, fail)
    },
    updateProvince (data, suc, fail) {
        http.methods.defaultPost('/100/Pca/updateProvince', data, suc, fail)
    },
    infoCity (code) {
        return http.methods.promisePost({code: code}, window.tools.getApiUrl('') + '/100/Pca/infoCity')
    },
    queryCity (data, suc, fail) {
        http.methods.defaultPost('/100/Pca/queryCity', data, suc, fail)
    },
    createCity (data, suc, fail) {
        http.methods.defaultPost('/100/Pca/createCity', data, suc, fail)
    },
    deleteCity (data, suc, fail) {
        http.methods.defaultPost('/100/Pca/deleteCity', data, suc, fail)
    },
    updateCity (data, suc, fail) {
        http.methods.defaultPost('/100/Pca/updateCity', data, suc, fail)
    },
    queryCityArea (data, suc, fail) {
        http.methods.defaultPost('/100/Pca/queryCityArea', data, suc, fail)
    },
    infoCityArea (code) {
        return http.methods.promisePost({code: code}, window.tools.getApiUrl('') + '/100/Pca/infoCityArea')
    },
    createCityArea (data, suc, fail) {
        http.methods.defaultPost('/100/Pca/createCityArea', data, suc, fail)
    },
    deleteCityArea (data, suc, fail) {
        http.methods.defaultPost('/100/Pca/deleteCityArea', data, suc, fail)
    },
    updateCityArea (data, suc, fail) {
        http.methods.defaultPost('/100/Pca/updateCityArea', data, suc, fail)
    },
    queryTown (data, suc, fail) {
        http.methods.defaultPost('/100/Pca/queryTown', data, suc, fail)
    },
    createTown (data, suc, fail) {
        http.methods.defaultPost('/100/Pca/createTown', data, suc, fail)
    },
    deleteTown (data, suc, fail) {
        http.methods.defaultPost('/100/Pca/deleteTown', data, suc, fail)
    },
    updateTown (data, suc, fail) {
        http.methods.defaultPost('/100/Pca/updateTown', data, suc, fail)
    },
    infoTown (data, suc, fail) {
        http.methods.defaultPost('/100/Pca/infoTown', data, suc, fail)
    },
}

export default regionApi
