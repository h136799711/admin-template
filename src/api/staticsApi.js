/* eslint-disable */
'use strict';
import http from '../assets/js/http.js'

const staticsApi = {
	query(data, suc, fail) {
		data.service_type = 'by_Statics_index'
		http.methods.defaultPost ('', data, suc, fail)
	}
}

export default staticsApi;
