/* eslint-disable */
'use strict';
import http from '../assets/js/http.js'

const widthdrawApi = {
	query(data, suc, fail) {
		data.service_type = 'by_UserWithdraw_query'
		http.methods.defaultPost ('', data, suc, fail)
	},
	pass(data, suc, fail) {
		data.service_type = 'by_UserWithdraw_pass';
		http.methods.defaultPost ('', data, suc, fail);
	},
	deny(data, suc, fail) {
		data.service_type = 'by_UserWithdraw_deny';
		http.methods.defaultPost ('', data, suc, fail);
	}
}

export default widthdrawApi
