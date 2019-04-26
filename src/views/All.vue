<template>
	<div class="about">
		<card>
			<Tabs>
				<TabPane label="文章管理" icon="ios-clipboard-outline">
					<Article></Article>
				</TabPane>
				<TabPane label="图片管理" icon="ios-reverse-camera-outline">
					<Picture></Picture>
				</TabPane>
				<TabPane label="视频管理" icon="ios-videocam-outline">
					<Video></Video>
				</TabPane>
			</Tabs>
		</card>
	</div>
</template>

<script>
	import Article from '../components/Article.vue'
	import Picture from '../components/Picture.vue'
	import Video from '../components/Video.vue'
	export default {
		data() {
			return {
				
			}
		},
		components: {
			Article,
			Picture,
			Video
		},
		methods: {
			
		}
	}
</script>