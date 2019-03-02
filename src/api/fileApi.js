/* eslint-disable */
'use strict';

const fileApi = {
	upload (file, imgType) {
		imgType = imgType || 'other'
		let url = window.tools.getAvatarUploadUrl()
		url = url + '?t=' + imgType
		var formdata = new FormData()
		formdata.append('image', file)
		formdata.append('sid', window.tools.getSessionId())
		formdata.append('uid', window.tools.getUID())
		formdata.append('device_type', window.tools.getDeviceType())
		return axios({
			url: url,
			method: 'post',
			data: formdata,
			headers: { 'Content-Type': 'multipart/form-data' },
		})
	}
};

export default fileApi;
