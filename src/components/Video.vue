<template>
	<div>
		<Table :data="tableData1" :columns="tableColumns1" @on-sort-change="handleSort" stripe></Table>
		<div style="padding: 10px;overflow: hidden">
			<div style="text-align: right;">
				<Page :total="total" :pageSize="pageSize" :current.sync="pageNumber" @on-change="changePage"></Page>
			</div>
		</div>
	</div>
</template>

<script>
	import videoApi from '../assets/api/video.js'
	export default {
		data() {
			return {
				pageNumber: 1,
				pageSize: 10,
				total: 0,
				sortType: 0, // 排序类型
				tableData1: [],
				tableColumns1: [{
						title: '标题',
						key: 'title',
						tooltip: true
					},
					{
						title: '缩略图',
						key: 'coverUrl',
						render: (h, params) => {
							const row = params.row;
							let src = row.coverUrl
							return h('Avatar', {
								props: {
									src: src,
									shape: 'square',
									size: 'large'
								}
							});
						}
					}, {
						title: '作者',
						key: 'author'
					}, {
						title: '来源',
						key: 'source'
					}, {
						title: '发布时间',
						key: 'inputTime'
					}, {
						title: '浏览次数',
						key: 'count'
					}, {
						title: '发布账号',
						key: 'publishName',
						sortable: 'custom',
					},
					
					{
						title: '操作',
						key: 'name',
						render: (h, params) => {
							const row = params.row;

							return h('Button', {
								props: {
									type: 'error'
								},
								on: {
									click: () =>{
										this.$Modal.confirm({
						                    title: '提示',
						                    content: '是否删除？',
						                    onOk: () => {
						                        this.$http.rq({
						                        	url: videoApi.video,
						                        	method: 'delete',
						                        	data: {
						                        		id: row.id
						                        	}
						                        }).then(res => {
						                        	if(res.code === 200){
						                        		this.$Message.success(res.message)
						                        		this.getData()
						                        	}else{
						                        		this.$Message.error(res.message)
						                        	}
						                        })
						                    },
						                    onCancel: () => {
						                        
						                    }
						               });
									}
								}
							}, '删除');
						}
					},
				]
			}
		},
		created() {
			this.getData()
		},
		methods: {

			changePage() {
				this.getData()
			},
			handleSort(column) {
				if(column.key === "publishName"){
					this.sortType = 1
				}
				if(column.order == 'normal'){
					this.sortType = 0
				}
				this.getData()
			},
			getData() {
				let par = {
					type: this.sortType,
					pageNumber: this.pageNumber,
					pageSize: this.pageSize
				}
				this.$http.rq({
					url: videoApi.video,
					data: par
				}).then(res => {
					if(res.code === 200) {
						console.log(res.data)
						this.tableData1 = res.data.row
						this.total = res.data.total
					} else {
						this.tableData1 = []
						this.total = 0
					}
				})
			}
		}
	}
</script>