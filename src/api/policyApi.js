/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const policyApi = {
	query (data, suc, fail) {
		data.service_type = 'by_AuthPolicy_queryAndCount';
		http.methods.defaultPost('', data, suc, fail);
	},
	create (data, suc, fail) {
		data.service_type = 'by_AuthPolicy_create'
		http.methods.defaultPost('', data, suc, fail);
	},
	update (data, suc, fail) {
		data.service_type = 'by_AuthPolicy_update'
		http.methods.defaultPost('', data, suc, fail);
	}
};

export default policyApi;