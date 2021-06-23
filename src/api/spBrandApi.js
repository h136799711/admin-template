/* eslint-disable */
'use strict';
import http from '../assets/plugins/http.js';

const spBrandApi = {
	create (data, suc, fail) {
		http.defaultPost('/100/SpBrand/create', data, suc, fail);
	},
	info (data, suc, fail) {
		http.defaultPost('/100/SpBrand/info', data, suc, fail);
	},
	update (data, suc, fail) {
		http.defaultPost('/100/SpBrand/update', data, suc, fail);
	},
	query (data, suc, fail) {
		http.defaultPost('/100/SpBrand/query', data, suc, fail);
	},
	delete (data, suc, fail) {
		http.defaultPost('/100/SpBrand/delete', data, suc, fail);
	}
};

export default spBrandApi;
