/* eslint-disable */
'use strict';
import {defaultPost} from '../assets/plugins/http.js'

const staticsApi = {
	query(data, suc, fail) {
		defaultPost ('/100/Statics/index', Object.assign({lc_key: '100_statics_index', lc_expire: 8 * 3600}, data), suc, fail)
	}
}

export default staticsApi;
