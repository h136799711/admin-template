/* eslint-disable */
'use strict';
import http from '../assets/js/http.js'

const userWalletApi = {
	async info (data) {
		return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/UserWallet/info')
	},
	async query (data) {
		return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/UserWallet/queryLogHistory')
	}
};

export default userWalletApi
