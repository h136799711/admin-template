/* eslint-disable */
'use strict';
import http from '../assets/plugins/http.js';

const spPropValueApi = {
	create (data, suc, fail) {
		http.defaultPost('/100/SpPropertyValue/create', data, suc, fail);
	},
	update (data, suc, fail) {
		http.defaultPost('/100/SpPropertyValue/update', data, suc, fail);
	},
	query (data, suc, fail) {
		http.defaultPost('/100/SpPropertyValue/query', data, suc, fail);
	},
	delete (data, suc, fail) {
		http.defaultPost('/100/SpPropertyValue/delete', data, suc, fail);
	}
};

export default spPropValueApi;
