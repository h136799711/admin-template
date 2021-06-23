/* eslint-disable */
'use strict';
import http from '../assets/plugins/http.js';

const spPropApi = {
	create (data, suc, fail) {
		http.defaultPost('/100/SpProperty/create', data, suc, fail);
	},
	info (data, suc, fail) {
		http.defaultPost('/100/SpProperty/info', data, suc, fail);
	},
	update (data, suc, fail) {
		http.defaultPost('/100/SpProperty/update', data, suc, fail);
	},
	query (data, suc, fail) {
		http.defaultPost('/100/SpProperty/query', data, suc, fail);
	},
	delete (data, suc, fail) {
		http.defaultPost('/100/SpProperty/delete', data, suc, fail);
	}
};

export default spPropApi;
