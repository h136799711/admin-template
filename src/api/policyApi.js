/* eslint-disable */
'use strict';
import http from '../assets/plugins/http.js';

const policyApi = {
	query (data, suc, fail) {
		http.defaultPost('/100/AuthPolicy/queryAndCount', data, suc, fail);
	},
	create (data, suc, fail) {
		http.defaultPost('/100/AuthPolicy/create', data, suc, fail);
	},
	update (data, suc, fail) {
		http.defaultPost('/100/AuthPolicy/update', data, suc, fail);
	}
};

export default policyApi;
