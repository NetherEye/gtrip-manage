import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [{
			path: '/',
			name: 'home',
			component: Home,
			children: [{
				path: '',
				name: '发布文章',
				component: () =>
					import('./views/PublishArticle.vue')
			}, {
				path: '/PublishPicture',
				name: '发布图片',
				component: () =>
					import('./views/PublishPicture.vue')
			}, {
				path: '/PublishVideo',
				name: '发布视频',
				component: () =>
					import('./views/PublishVideo.vue')
			}, {
				path: '/All',
				name: '所有文章管理',
				component: () =>
					import('./views/All.vue')
			}]
		},
		{
			path: '/Login',
			name: '登录',
			component: () =>
				import('./views/Login.vue')
		},
	]
})