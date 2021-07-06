/* eslint-disable */
'use strict';
import {defaultPost} from '../assets/plugins/http.js'

const rechargeApi = {
	query(data, suc, fail) {
		defaultPost ('/100/RechargeOrder/query', data, suc, fail)
	},
	payInfo(data, suc, fail) {
		defaultPost ('/100/RechargeOrder/payInfo', data, suc, fail)
	}
}

export default rechargeApi
