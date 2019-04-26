<style scoped>
	.layout,
	.ivu-layout {
		height: 100%;
	}
	
	.layout {
		border: 1px solid #d7dde4;
		background: #f5f7f9;
		position: relative;
		border-radius: 4px;
		overflow: auto;
	}
	
	.layout-header-bar {
		background: #fff;
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
	}
</style>
<template>
	<div class="layout">
		<Sider :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'hidden'}">
			<Menu theme="dark" :active-name="$store.state.activePathName">
				<MenuItem name="发布文章" :to="{name: '发布文章'}">
				<Icon type="md-document" /> 发布文章
				</MenuItem>
				<MenuItem name="发布图片" :to="{name: '发布图片'}">
				<Icon type="md-chatbubbles" /> 发布图片
				</MenuItem>
				<MenuItem name="发布视频" :to="{name: '发布视频'}">
				<Icon type="md-heart" /> 发布视频
				</MenuItem>
				<MenuItem name="所有文章管理" :to="{name: '所有文章管理'}">
				<Icon type="md-leaf" /> 所有文章管理
				</MenuItem>
			</Menu>
		</Sider>
		<Layout :style="{marginLeft: '200px'}">
			<Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}">
				<div style="text-align: right;margin-right: 20px;">
					<Avatar icon="ios-person" size="large" style="margin-right: 4px;" />
					<span style="margin-right: 30px;">{{$store.state.userInfo != null ? $store.state.userInfo.nickname : ''}}</span>
					<Icon type="ios-log-out" @click="logout" size="36" style="cursor: pointer;" />
				</div>
			</Header>
			<Content :style="{padding: '16px 16px'}">
				<router-view></router-view>

			</Content>
		</Layout>
	</div>
</template>
<script>
	import commonApi from '../assets/api/common.js'
	export default {
		data() {
			return {
				userInfo: {
					role: '教师'
				},
				timer: null, // 获取本地userInfo 计数器
				count: 1000
			}
		},
		created() {

		},
		mounted() {

		},
		methods: {
			logout() {
				this.$http.rq({
					url: commonApi.logout
				}).then(res => {
					this.$router.replace({name: '登录'})
				})
			}
		}
	}
</script>