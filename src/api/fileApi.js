/* eslint-disable */
'use strict'

import http from '../assets/js/http'

const fileApi = {
    upload (file, imgType) {
        imgType = imgType || 'other'
        let url = window.tools.getAvatarUploadUrl() + '/v2/upload';
        url = url + '?t=' + imgType
        let formData = new FormData()
        formData.append('image', file)
        formData.append('jwt', window.tools.getJwt())
        formData.append('user_id', window.tools.getUID())
        return axios({
            url: url,
            method: 'post',
            data: formData,
            // headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
    query (date, pageIndex, pageSize) {
        let url = window.tools.getAvatarUploadUrl() + '/picture/query'
        let formData = new FormData()
        formData.append('uid', window.tools.getUID())
        formData.append('jwt', window.tools.getJwt())
        formData.append('date', date)
        formData.append('page_index', pageIndex)
        formData.append('page_size', pageSize || 10)
        return axios({
            url: url,
            method: 'post',
            data: formData
        })
    }
}

export default fileApi
