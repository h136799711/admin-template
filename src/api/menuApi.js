/* eslint-disable */
'use strict';
import {defaultPost} from '../assets/plugins/http.js';

const menuApi = {
	queryAll (data, suc, fail) {
		defaultPost('/100/Menu/queryAll', data, suc, fail)
	},
	create (data, suc, fail) {
		defaultPost('/100/Menu/create', data, suc, fail)
	},
	delete (data, suc, fail) {
		defaultPost('/100/Menu/delete', data, suc, fail)
	},
	info (data, suc, fail) {
		defaultPost('/100/Menu/info', data, suc, fail)
	},
	update (data, suc, fail) {
		defaultPost('/100/Menu/update', data, suc, fail)
	}
};

export default menuApi;
