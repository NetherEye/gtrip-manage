<template>
	<div class="article">
		<card>
			<Form :model="formItem" :label-width="80">
				<FormItem label="标题">
					<Input v-model="formItem.title" clearable></Input>
				</FormItem>
				<FormItem label="分类">
					<Select v-model="formItem.type">
						<Option :value="1">政治新闻</Option>
						<Option :value="2">旅游资讯</Option>
						<Option :value="3">旅游路线</Option>
						<Option :value="4">景区介绍</Option>
						<Option :value="5">旅游扶贫资讯</Option>
						<Option :value="6">旅游扶贫典型模式</Option>
					</Select>
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
					<Upload ref="upload" :on-progress="uploadPro" :show-upload-list="false" :on-success="handleSuccess" :format="['jpg','jpeg','png']"  :on-format-error="handleFormatError" type="drag" :action="fileUrl" style="display: inline-block;width:58px;">
						<div style="width: 58px;height:58px;line-height: 58px;">
							<Icon type="ios-camera" size="20"></Icon>
						</div>
					</Upload>
					<Modal title="View Image" v-model="visible">
						<img :src="imgName" v-if="visible" style="width: 100%">
					</Modal>
				</FormItem>

				<FormItem label="正文编辑">
					<div v-for="(item, index) in formItem.content" :key="index">
						<Row v-if="item.type == 'img'">
							<Col span="10">
								<Avatar shape="square" icon="ios-person" :src="item.src" size="large" />
							</Col>
							<Col span="4" offset="1">
			                    <Button @click="atrcleRemove(index)">Delete</Button>
			                </Col>
						</Row>
						<Row v-else>
							<Col span="10">
								<Input  v-model="item.val" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
							</Col>
							<Col span="4" offset="1">
			                    <Button @click="atrcleRemove(index)">Delete</Button>
			                </Col>
						</Row>
						
					</div>
					
					<Row style="margin-top: 10px;">
		                <Col span="6" style="margin-right: 10px;">
		                    <Button type="dashed" long @click="handleAdd(formItem, 'p')" icon="md-add">插入段落</Button>
		                </Col>
		                <Col span="6">
		                    <Upload ref="upload2" :on-progress="uploadPro" :show-upload-list="false" :on-success="handleSuccess2" :format="['jpg','jpeg','png']" :on-format-error="handleFormatError" :action="fileUrl" style="display: inline-block;width:58px;">
								<Button icon="ios-cloud-upload-outline">插入图片</Button>
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
	import articleApi from '../assets/api/article.js'
	import tools from '../assets/tools/tools.js'
	
	export default {
		data() {
			return {
				formItem: {
					content: [],
					title: '',
					author: '',
					source: '',
					coverUrl: '',
					type: ''
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
			handleAdd(formItem){
				formItem.content.push({
					type: 'p',
					val: ''
				})
			},
			handleSuccess2(res){
				this.formItem.content.push({
					type: 'img',
					src: res.data.url
				})
			},
			atrcleRemove(index){
				this.formItem.content.splice(index, 1)
			},
			handleSubmit(){
				if(tools.check(this.formItem)){
					let par = {
						...this.formItem
					}
					par['content'] = JSON.stringify(par['content'])
					this.$http.rq({
						url: articleApi.news,
						method: 'post',
						data: par
					}).then(res =>{
						if(res.code === 200){
							this.$Message.success(res.message)
							this.formItem = {
								content: [],
								title: '',
								author: '',
								source: '',
								coverUrl: '',
								type: ''
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
				console.log(e)
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