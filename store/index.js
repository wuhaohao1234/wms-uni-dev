// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
// #endif

// #ifdef VUE3
import { createStore } from 'vuex'
const store = createStore({
// #endif
	state: {
		hasLogin: false,
		loginInfo:{},
		userInfo:{},
		isUniverifyLogin: false,  
		token:"",
		shop:"",
	},
	mutations: {
		setLogin(state, loginInfo) {
			state.hasLogin = true;
			state.loginInfo = loginInfo;
		},
		setLogout(state) {
			state.hasLogin = false 
			state.token = ""
			state.userInfo = {}
			state.loginInfo = {}
		}, 
		setToken(state, token) { 
			state.token = token
		},
		setUserInfo(state,userInfo){
			state.userInfo = userInfo
		}
	   
	},
	getters: {
		 
		getUserInfo(state){
			return state.userInfo
		}
	},
	actions: {
		// lazy loading openid
		 
	}
})

export default store
