/* eslint-disable */
'use strict';
import {promisePost} from '../assets/plugins/http.js'

const userWalletApi = {
	async info (data) {
		return promisePost('/100/UserWallet/info', data)
	},
	async query (data) {
		return promisePost('/100/UserWallet/queryLogHistory', data)
	}
};

export default userWalletApi
