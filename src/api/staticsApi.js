/* eslint-disable */
'use strict';
import http from '../assets/plugins/http.js'

const staticsApi = {
	query(data, suc, fail) {
		http.defaultPost ('/100/Statics/index', data, suc, fail)
	}
}

export default staticsApi;
