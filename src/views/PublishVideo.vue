<template>
	<div class="article">
		<card>
			<Form :model="formItem" :label-width="80">
				<FormItem label="标题">
					<Input v-model="formItem.title" clearable></Input>
				</FormItem>
				<FormItem label="作者">
					<Input v-model="formItem.author" clearable :maxlength="10"></Input>
				</FormItem>
				<FormItem label="来源">
					<RadioGroup v-model="formItem.source">
						<Radio label="本站原创">本站原创</Radio>
						<Radio label="本站编辑">本站编辑</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="封面图">
					<div class="demo-upload-list" v-if="formItem.coverUrl">
						<template>
							<img :src="formItem.coverUrl">
							<div class="demo-upload-list-cover">
								<Icon type="ios-eye-outline" @click.native="handleView(formItem.coverUrl)"></Icon>
								<Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
							</div>
						</template>
					</div>
					<Upload ref="upload" :on-progress="uploadPro" :show-upload-list="false" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :on-format-error="handleFormatError" type="drag" :action="fileUrl" style="display: inline-block;width:58px;">
						<div style="width: 58px;height:58px;line-height: 58px;">
							<Icon type="ios-camera" size="20"></Icon>
						</div>
					</Upload>
					<Modal title="View Image" v-model="visible">
						<img :src="imgName" v-if="visible" style="width: 100%">
					</Modal>
				</FormItem>
				
				<FormItem label="视频地址">
					<Input v-model="formItem.videoUrl"></Input>
				</FormItem>

				<FormItem label="上传视频">
					<div v-if="formItem.videoUrl">
						<Row style="margin-bottom: 10px;">
							<Col span="2">
								<video width="100" height="100" :src="formItem.videoUrl">
									
								</video>
							</Col>
							<Col span="2" offset="1">
							<Button @click="atrcleRemove(index)">Delete</Button>
							</Col>
						</Row>

					</div>

					<Row style="margin-top: 10px;">
						<Col span="6">
						<Upload ref="upload2" :on-progress="uploadPro" :show-upload-list="false" :on-success="handleSuccess2" :format="['mp4']" :on-format-error="handleFormatError" :action="fileUrl" style="display: inline-block;width:58px;">
							<Button icon="ios-cloud-upload-outline">upload video</Button>
						</Upload>
						</Col>
					</Row>

				</FormItem>
				<FormItem>
					<Button type="primary" @click="handleSubmit">提交</Button>
				</FormItem>
			</Form>
		</card>

	</div>
</template>

<script>
	import commonApi from '../assets/api/common.js'
	import videoApi from '../assets/api/video.js'
	import tools from '../assets/tools/tools.js'
	
	export default {
		data() {
			return {
				formItem: {
					videoUrl: '',
					title: '',
					author: '',
					source: '',
					coverUrl: ''
				},
				imgName: '',
				visible: false,
				fileUrl: '',
				pding: []

			}
		},
		created(){
			this.fileUrl = commonApi.uploadFile
		},
		methods: {
			handleView(name) {
				this.imgName = name;
				this.visible = true;
			},
			handleRemove() {
				this.formItem.coverUrl = ''
			},
			handleSuccess(res, file) {
				this.formItem.coverUrl = res.data.url
			},
			handleFormatError(file) {
				this.$Notice.warning({
					title: 'The file format is incorrect',
					desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
				});
			},
			handleSuccess2(res){
				this.formItem.videoUrl = res.data.url
			},
			atrcleRemove(index){
				this.formItem.videoUrl = ''
			},
			handleSubmit(){
				if(tools.check(this.formItem)){
					let par = {
						...this.formItem
					}
					this.$http.rq({
						url: videoApi.video,
						method: 'post',
						data: par
					}).then(res =>{
						if(res.code === 200){
							this.$Message.success(res.message)
							this.formItem = {
								videoUrl: '',
								title: '',
								author: '',
								source: '',
								coverUrl: ''
							};
						}else{
							this.$Message.error(res.message)
						}
					})
				}else{
					this.$Message.warning('请填写完整！')
				}
				
			},
			uploadPro(e, file){
				if(this.pding.length === 0){
					var percent = {
						val: e.percent,
						not: file.uid
					}
					if(e.percent >= 100){
						return	
					}
					this.pding.push(percent)
					this.$Notice.info({
	                    title: '上传进度（' + file.name + '）',
	                    duration: 0,
	                    name: percent.not,
	                    top: 100,
	                    render: h => {
	                        return h('Progress', {
	                        	props: {
	                        		percent: percent.val,
	                        	}
	                        })
	                    }
	               	});
	               	
	               	
				}else{
					let f = false
					for (let i = 0, len = this.pding.length; i < len; i++) {
	        			if(this.pding[i].not == file.uid){
	        				if(e.percent >= 100){
	        					this.$Notice.close(this.pding[i].not)
	        					this.pding.splice(i, 1)
	        				}else{
	        					this.pding[i].val = e.percent
	        				}
	        				f = true
	        				break
	        			}
	        		}
					if(!f){
						var percent = {
							val: e.percent,
							not: file.uid
						}
						if(e.percent >= 100){
							return	
						}
						this.pding.push(percent)
						this.$Notice.info({
		                    title: '上传进度',
		                    duration: 0,
		                    name: percent.not,
		                    top: 100,
		                    render: h => {
		                        return h('Progress', {
		                        	props: {
		                        		percent: percent.val,
		                        	}
		                        })
		                    }
		               	});
		               	
					}
					
				}
			},
		},
	}
</script>

<style>
	.demo-upload-list {
		display: inline-block;
		width: 60px;
		height: 60px;
		text-align: center;
		line-height: 60px;
		border: 1px solid transparent;
		border-radius: 4px;
		overflow: hidden;
		background: #fff;
		position: relative;
		box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
		margin-right: 4px;
	}
	
	.demo-upload-list img {
		width: 100%;
		height: 100%;
	}
	
	.demo-upload-list-cover {
		display: none;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, .6);
	}
	
	.demo-upload-list:hover .demo-upload-list-cover {
		display: block;
	}
	
	.demo-upload-list-cover i {
		color: #fff;
		font-size: 20px;
		cursor: pointer;
		margin: 0 2px;
	}
</style>