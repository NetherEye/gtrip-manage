import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  	userInfo: null,
		activePathName: ''
  },
  mutations: {
  	setUserInfo(state, obj){
  		state.userInfo = obj
  	},
		setPathName(state, obj){
			state.activePathName = obj.name
		}
  },
  actions: {

  }
})
