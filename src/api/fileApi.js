/* eslint-disable */
'use strict'

import { dbhTool } from '@peter_xiter/dbh-js-tools'

const fileApi = {
    upload (file, imgType) {
        imgType = imgType || 'other'
        let url = dbh.config.getAvatarUploadUrl() + '/v2/upload';
        url = url + '?t=' + imgType
        let formData = new FormData()
        formData.append('image', file)
        formData.append('oss_type', 'qiniu');
        formData.append('jwt', dbhTool.getJwt())
        formData.append('uid', dbhTool.getUID())
        return axios.post(url, formData);
    },
    query (date, pageIndex, pageSize) {
        let url = dbh.config.getAvatarUploadUrl() + '/picture/query'
        let formData = new FormData();
        formData.append('uid', dbhTool.getUID())
        formData.append('jwt', dbhTool.getJwt())
        formData.append('date', date)
        formData.append('page_index', pageIndex)
        formData.append('page_size', pageSize || 10)
        return axios.post(url , formData)
    }
}

export default fileApi
