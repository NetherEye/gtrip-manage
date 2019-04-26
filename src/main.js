import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/css/reset.css'
import './assets/css/public.css'
import './assets/css/style.less'

import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);

import {$http, httpStack} from './assets/tools/http'
Vue.prototype.$http = $http

import commonApi from './assets/api/common.js'

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
	
	store.commit('setPathName', {name: to.name})
	
	if(httpStack.length !== 0){
		httpStack.forEach((a, i) => {
			a.cancelToken.cancel('中断上个路由所有请求' + (i === (httpStack.length-1) ? '并重置集合' : ''))
		})
	}
	
	if(to.name == '登录'){
		localStorage.clear()
		sessionStorage.clear()
		next()
		return
	}
	
	$http.rq({
		url: commonApi.getUser
	}).then(res => {
		if(res.code === 200){
			store.commit('setUserInfo', res.data)
			next()
		}else{
			store.commit('setUserInfo', null)
			next({name: '登录'})
		}
	})
	
	
  	
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
