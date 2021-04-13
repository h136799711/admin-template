/* eslint-disable */
'use strict'
import http from '../assets/js/http.js'

const pickupPlaceApi = {
    async query (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/PickUpPlace/query')
    },
    async edit (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/PickUpPlace/edit');
    },
    async create (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/PickUpPlace/create');
    },
    async delete (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/PickUpPlace/delete');
    },
};

export default pickupPlaceApi
