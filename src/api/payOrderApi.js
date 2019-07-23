/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const payOrderApi = {
	info (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_PayOrder_info'}), suc, fail);
	},
	query (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_PayOrder_query'}), suc, fail);
	},
	notifyHistory(data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_PayOrder_notifyHistory'}), suc, fail);
	}
};

export default payOrderApi;
