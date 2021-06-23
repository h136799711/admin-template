/* eslint-disable */
'use strict';
import http from '../assets/plugins/http.js';

const payOrderApi = {
	info (data, suc, fail) {
		http.defaultPost('/100/PayOrder/info', data, suc, fail);
	},
	query (data, suc, fail) {
		http.defaultPost('/100/PayOrder/query', data, suc, fail);
	},
	notifyHistory(data, suc, fail) {
		http.defaultPost('/100/PayOrder/notifyHistory', data, suc, fail);
	},
	notify(data, suc, fail) {
		http.defaultPost('/100/PayOrder/notify', data, suc, fail);
	}
};

export default payOrderApi;
