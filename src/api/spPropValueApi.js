/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const spPropValueApi = {
	create (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpPropertyValue_create'}), suc, fail);
	},
	update (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpPropertyValue_update'}), suc, fail);
	},
	query (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpPropertyValue_query'}), suc, fail);
	},
	delete (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpPropertyValue_delete'}), suc, fail);
	}
};

export default spPropValueApi;
