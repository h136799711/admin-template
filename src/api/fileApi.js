/* eslint-disable */
'use strict'

import http from '../assets/js/http'

const fileApi = {
    upload (file, imgType) {
        imgType = imgType || 'other'
        let url = window.tools.getAvatarUploadUrl() + '/v2/upload';
        url = url + '?t=' + imgType
        var formdata = new FormData()
        formdata.append('image', file)
        formdata.append('token', window.tools.getJwt())
        formdata.append('sid', window.tools.getSessionId())
        formdata.append('uid', window.tools.getUID())
        formdata.append('device_type', window.tools.getDeviceType())
        return axios({
            url: url,
            method: 'post',
            data: formdata,
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
    query (date, pageIndex, pageSize) {
        let url = window.tools.getAvatarUploadUrl() + '/picture/query'
        let formdata = new FormData()
        formdata.append('sid', window.tools.getSessionId())
        formdata.append('uid', window.tools.getUID())
        formdata.append('date', date)
        formdata.append('page_index', pageIndex)
        formdata.append('page_size', pageSize || 10)
        return axios({
            url: url,
            method: 'post',
            data: formdata
        })
    }
}

export default fileApi
