/* eslint-disable */
'use strict'
import http from '../assets/js/http.js'

const jwtApi = {
    async refresh(data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/JwtToken/refresh');
    }
}

export default jwtApi
