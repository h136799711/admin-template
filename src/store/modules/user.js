/**
 * Created by 1 on 2017-06-19.
 */
import userApi from '../../api/userApi'
import * as types from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
const state = {
	loginStatus: '',
	loginError: [],
	userInfo: [],
	userSessionData: {
		loading: -1,
		code: '',
		msg: '',
		data: ''
	}
}

// getters
const getters = {
	loginStatus: state => state.loginStatus,
	loginError: state => state.loginError,
	loginUser: state => state.userInfo,
	userSessionData: state => state.userSessionData
}

// actions
const actions = {
	login({commit}, loginData) {
		console.debug ('login data ', loginData)
		commit (types.ByUserLoginReq)
		userApi.login (
			loginData,
			(res) => {
				commit (types.ByUserLoginSuc, res)
			},
			(res) => {
				commit (types.ByUserLoginFail, res)
			}
		)
	},
	getUserSessionData({commit}) {
		console.debug ('用户登录成功后获取用户会话数据')
		commit (types.ByUserSessionDataReq)
		let sessionData = window.cache.getBigDataValue (types.ByUserSessionDataReq)
		if (sessionData && sessionData !== '') {
			console.debug ('[cache] getUserSessionData 使用缓存')
			sessionData = window.tools.base64Utils.decode (sessionData)
			commit (types.ByUserSessionDataSuc, JSON.parse (sessionData))
			return
		}
		userApi.getUserData ((res) => {
			commit (types.ByUserSessionDataSuc, res)
		}, (res) => {
			commit (types.ByUserSessionDataFail, res)
		})
	},
	updateNicknameHead({commit}, userInfo) {
		console.debug ('修改缓存信息的头像或昵称', userInfo)
		let sessionData = window.cache.getBigDataValue (types.ByUserSessionDataReq)
		if (sessionData && sessionData !== '') {
			sessionData = JSON.parse (window.tools.base64Utils.decode (sessionData));

			console.debug ('[cache] 获取到了本地缓存', sessionData)
			sessionData.userInfo.head = userInfo.head
			sessionData.userInfo.nickname = userInfo.nickname
			commit (types.ByUserSessionDataSuc,  sessionData)
		}
	},
	logout({commit}, userInfo) {
		console.debug ('用户登出', userInfo)
		commit (types.ByUserLogoutReq)
		userApi.logout (
			userInfo,
			(res) => {
				commit (types.ByUserLogoutDone, res)
			},
			(res) => {
				commit (types.ByUserLogoutDone, res)
			}
		)
	}
}

// mutations
const mutations = {
	[types.ByUserLogoutDone](state) {
		console.debug ('ByUserLogoutDone')
		state.loginStatus = types.ByUserLogoutDone
		state.userInfo = []
		window.cache.clear ()
	},
	[types.ByUserLogoutReq](state) {
		console.debug ('ByUserLogoutReq')
		state.loginStatus = types.ByUserLogoutReq
		state.userInfo = []
	},
	[types.ByUserLoginReq](state) {
		console.debug ('ByUserLoginReq')
		state.userInfo = []
		state.loginStatus = 'by_user_login_req'
		state.loginError = []
	},
	[types.ByUserLoginSuc](state, data) {
		console.debug ('ByUserLoginSuc', data)
		state.userInfo = data
		state.loginStatus = types.ByUserLoginSuc
	},

	[types.ByUserLoginFail](state, data) {
		// rollback to the cart saved before sending the request
		state.loginStatus = types.ByUserLoginFail // 'by_user_login_fail';
		state.loginError = {...state.loginError, msg: data}
		console.debug ('ByUserLoginFail', state.loginError)
	},
	[types.ByUserSessionDataReq](state) {
		console.debug ('ByUserSessionDataReq')
		// state.userSessionData.code = '';
		// state.userSessionData.msg = '';
		// state.userSessionData.data = '';
		state.userSessionData.loading = 2
	},
	[types.ByUserSessionDataFail](state, data) {
		// rollback to the cart saved before sending the request
		state.userSessionData.loading = -1
		state.userSessionData = {...state.userSessionData, msg: data} //.msg, code: data.code, data: data.data}
		console.debug ('ByUserSessionDataFail', state.loginError)
	},
	[types.ByUserSessionDataSuc](state, data) {
		tools.setUserSessionData(window.tools.base64Utils.encode(JSON.stringify (data)));
		state.userSessionData.loading = 1
		state.userSessionData.code = 0;
		state.userSessionData = {...state.userSessionData, data: data}
		// console.debug ('ByUserSessionDataSuc', data, state.userSessionData)
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}
