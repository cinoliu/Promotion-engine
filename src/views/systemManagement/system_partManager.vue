<template>
	<div class="list">
		<!-- 搜索 v-show="state.searchState.show"-->
		<Row class="search-filter" :class="{'active':searchState}">
			<Col>
			<Card style="height: 125px;">
				<Form :label-width="80" inline>
					<Form-item label="角色编码">
						<Input v-model="formItem.part_name" placeholder="请输入" style="width:187px"></Input>
					</Form-item>

					<Form-item label="角色名称">
						<Input v-model="formItem.part_descn" placeholder="请输入" style="width:187px"></Input>
					</Form-item>

					<div class="clearfix" style="border-top:1px solid #eee;margin-top:-15px;padding-top:10px;text-align:right">
						<span class="pull-right">
              <Button type="primary" icon="ios-search" shape="circle" @click="queryTableList()">查询</Button>
              
            </span>

					</div>
				</Form>
			</Card>
			</Col>
		</Row>
		<!-- 搜索 /-->
		<Row>
			<Col>
			<Card>
				<div slot="title">
					<Icon type="ios-film-outline"></Icon>
					固定表头
					<Button type="dashed" @click.native="fixedHeader=!fixedHeader">
            <Icon type="pin"></Icon>
          </Button>
					<Button type="success" @click.native="addOpen()">
                     <Icon type="plus"></Icon>
            新增
          </Button>
					<Button type="primary" @click="searchShow" shape="circle"><Icon type="funnel"></Icon> 筛选</Button>

				</div>

				<a href="#" slot="extra" @click.prevent="refresh">
					<Icon type="ios-loop-strong"></Icon>
				</a>
				<Table :loading="TableLoading" :show-header="showHeader" :height="fixedHeader ? 350 : ''" :data="listData" :columns="columns1" ref="table" @on-select="onSelect" @on-selection-change="onSelectionChange"></Table>
				
				
				
                <Page :total="totalSize" show-total show-sizer show-elevator @on-change="changeCurrent"
                      @on-page-size-change="changePageSize" :current.sync="current" style="margin: 24px 0 24px;text-align:right"></Page>
			</Card>
			</Col>
		</Row>

		<Modal v-model="addModal" v-if='DateReady' title="新增" width="650" :mask-closable="false">

			<Form :model="add_info" :label-width="80" ref="add_info" :rules="add_ruleValidate">
				<Row>

					<FormItem label="角色编码" prop="name">
						<Input v-model="add_info.name" placeholder="请输入"></Input>
					</FormItem>
					<Row>
					</Row>
					<FormItem label="角色名称" prop="descn">
						<Input v-model="add_info.descn" placeholder="请输入"></Input>
					</FormItem>

				</Row>

			</Form>

			<div slot="footer">
				<Button size="large" type="primary" long @click="addInfo('add_info')" :loading="loading">
          保存
        </Button>
			</div>
		</Modal>

		<Modal v-model="editModal" v-if='DateReady' title="编辑" width="650" :mask-closable="false">

			<Form :model="edit_info" :label-width="80" ref="edit_info" :rules="add_ruleValidate">
				<Row>

					<FormItem label="角色编码" prop="name">
						<Input v-model="edit_info.name" placeholder="请输入"></Input>
					</FormItem>
				</Row>
				<Row>
					<FormItem label="角色名称" prop="descn">
						<Input v-model="edit_info.descn" placeholder="请输入"></Input>
					</FormItem>
					</Col>
				</Row>

			</Form>

			<div slot="footer">
				<Button size="large" type="primary" long @click="editInfo('edit_info')" :loading="loading">
          保存
        </Button>
			</div>
		</Modal>





   <Modal  v-model="roleModal" title="角色授权"   v-if='DateReady'  width="400" :mask-closable="false">
            <div style="float:right">
                <span style="color: #f50;margin-right: 8px;">模块</span>
                <span style="color: #00a854;margin-right: 8px;">菜单</span>
                <span style="color: #657180">操作</span>
            </div>
            <div class="demo-spin-article" >
                <Spin size="large" fix v-if="auth_list.length == 0" :style="{'max-height':'500px'}">
                    <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                    <div>Loading...</div>
                </Spin>
                <Tree :data="auth_list" show-checkbox multiple></Tree>
            </div>

            <div style="clear: both"></div>
            <div slot="footer">
                <Button type="primary" size="large" long :loading="loading" @click="updateRoleAuth()" icon="checkmark-round">保存</Button>
            </div>
        </Modal>





	</div>
</template>
<script>
	export default {
		name: 'list',
		components: {},
		data() {
			return {

				currIndex: 0, // 当前编辑和新增的行号
				searchState: false,
				showHeader: true, // 是否显示表头 @:show-header
				TableLoading: false, // 分页loading
				fixedHeader: false, // 是否固定表头 @:height
				tableSize: 'small', // @:size
				DateReady: false, // 判断异步数据加载完成，避免报错
				loading: false, // save
				currIndex: 0,
				saveDisabled: false,
				 current: 1,
                totalSize: 0, //总条数
                start: 0, //开始条数
                limit: 10, //每页记录数

				formItem: { 
					part_name: "",
					part_descn: "",
				},

				add_ruleValidate: {
					name: [{
						required: true,
						message: '请填写角色编码',
						trigger: 'blur'
					}],
					descn: [{
							required: true,
							message: '请填写角色名称',
							trigger: 'blur'
						},

					],

				},

				add_info: {}, // 当前编辑和新增的行数据
				addModal: false,
				edit_info: {},
				editModal: false,

				roleModal: false,
				role_auth_info: {},

				is_show: false,
				loading: false,
				role_id: null,
				auth_list: [],

				listData: [], // @:data 列表数据
				columns1: [ //列表表头
					{
						title: '角色编码',
						key: 'name',
						align: 'center',
						fixed: 'left',
						width: 150,
					},
					{
						title: '角色名称',
						key: 'descn',
						align: 'center',
						width: 180,
					},
					{
						title: '拥有权限',
						key: 'auths',
						align: 'center',

					},

					{
						title: '操作',
						key: 'action',
						width: 250,
						fixed: 'right',
						align: 'center',
						render: (h, params) => {
							return h('div', [

								h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									style: {
										color: '#5cadff'
									},
									on: {
										click: () => {
											this.editOpen(params.index)
										}
									}
								}, '编辑'),

								h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									style: {
										marginRight: '5px',
										color: '#5cadff'
									},
									on: {
										click: () => {
											this.roleAuth(params.index)
										}
									}
								}, '角色授权'),

								h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									style: {
										color: '#ff3300'
									},
									on: {
										click: () => {

											this.remove(params)
										}
									}
								}, '删除')
							])
						}
					}
				]
			}
		},
		watch: {

			params: {
				handler(val) {
					this.updateTableList(val)
				},
				deep: true
			},
			fixedHeader: {
				handler(val) {
					if(val) {
						this.$Message.info('表头已固定')
					}
				}
			},

		},
		computed: {
			state() {
				return this.$store.state.app
			}
		},
		methods: {
			//筛选
			searchShow() {
				this.searchState = !this.searchState
			},
			//	刷新页面
			refresh() {
				this.updateTableList(this.params)
			},
		//搜索
			queryTableList() {
				this.updateTableList(this.params)

			},

					//分页
		  changePageSize (pageSize) {
                this.limit = pageSize;
                this.updateTableList();
            },
            changeCurrent (current) {
                this.start = current * this.limit - this.limit;
                this.updateTableList();
            },

			//列表
			updateTableList(params) {
				this.TableLoading = true
				this.load = true;
				var reqParams = {
					name: this.formItem.part_name,
					descn: this.formItem.part_descn,
					start: this.start,
					limit: this.limit,
				};

				this.func.ajaxPost( this.api.baseUrl + '/role/queryRolePage.do', this.qs.stringify(reqParams), res => {
	this.TableLoading = false
					if(res.status == 200) {
							 this.totalSize = res.data.totalSize;
						this.listData = res.data.resultList;
						this.DateReady = true


					} else {
						this.$Message.error(res.msg)

					}

				});

			},

	
			
			onSelect(selection, row) {

			},

			onSelectionChange(selection) {
				this.params.limit = selection
			},

			//删除
			remove(params) {

				this.$Modal.confirm({
					title: '删除确认',
					content: `此角色删除后，所有关联数据都一并删除`,
					onOk: function() {
						this.$Loading.start();

						var reqParams = {
							role_id: params.row.role_id
						};

						this.func.ajaxPost(this.api.baseUrl + '/role/delSysRole.do',this.qs.stringify(reqParams), res => {



							if(res.data.success) {

								this.$Message.info('删除成功！');
								this.updateTableList();
							} else {

								this.$Message.error('删除失败!请稍后再试...!');
								this.loading = false
							}
						});
					},
					onCancel: () => {
						this.$Message.info('点击了取消');
					}
				})
			},

			addOpen(index) {
				this.addModal = true
				this.currIndex = index

			},

			addInfo(name) {
				this.loading = true
				this.$refs[name].validate((valid) => {

					if(valid) {

						var reqParams = this.add_info;

						this.func.ajaxPost(this.api.baseUrl + '/role/addSysRole.do', this.qs.stringify(reqParams), res => {



							if(res.data.success == true || res.data.success == "true") {
								this.$Message.success('新增成功!');
								this.addModal = false;

								this.updateTableList();
							} else {

								this.$Message.error(res.data.errcode + '新增失败!请稍后再试...');
								this.loading = false
							}

						});

					} else {
						this.$Message.error('表单验证失败!');
						this.loading = false
					}

				})

			},

			editOpen(index) {

				this.edit_info = this.listData[index]
				this.editModal = true
				this.loading = false

			},

			editInfo(name) {
				this.loading = true
				this.$refs[name].validate((valid) => {

					if(valid) {

						var reqParams = this.edit_info;

						this.func.ajaxPost(this.api.baseUrl  + '/role/editSysRole.do', this.qs.stringify(reqParams), res => {

							if(res.data.success == true || res.data.success == "true") {
								this.$Message.success('修改成功!');
								this.updateTableList()
								this.editModal = false;

							} else {
								this.$Message.error(res.data.errcode + '修改失败!请稍后再试...');
								this.loading = false

							}
						});

					} else {
						this.$Message.error('表单验证失败!');
						this.loading = false
					}

				})

			},

			roleAuth(index) {
				this.role_auth_info = this.listData[index];
				this.roleModal = true
				this.loading = false
				this.getRoleAuthList()

			},

			getRoleAuthList() {
				var reqParams = {
					role_id: this.role_auth_info.role_id
				};

				this.func.ajaxPost( this.api.baseUrl  + '/authRes/loadAuthResTree.do', this.qs.stringify(reqParams), res => {
					this.formatResTree(res.data);
				})

			},

			formatResTree(res) {		

				// 递归重构
				var rs = function(children) {
					children.forEach(function(item) {
						item.title = item.text;
						item.expand = true;
						item.is_checked = item.checked;
						delete item.checked;
						if(!item.children || item.children.length === 0) {
							item.checked = item.is_checked;
						} else {
							rs(item.children);
						}
					})
				};
				rs(res);
				this.auth_list = res;

			},

			updateRoleAuth() {
				var auth_ids = [];
				// 递归出授权信息
				var rs = function(children) {
					children.forEach(function(item) {
						if(item.checked && item.id != 0) {
							auth_ids.push(item.id);
						}
						if(!item.leaf) {
							rs(item.children);
						}
					})
				};
				rs(this.auth_list);

				var reqParams = {
					role_id: this.role_auth_info.role_id,
					auth_ids: auth_ids.join(",")
				};
				this.loading = true;
				this.func.ajaxPost(this.api.baseUrl  + '/authRes/grantAuth2Role.do', this.qs.stringify(reqParams), res => {

					if(res.data.success) {
						this.$Message.success('授权成功！');
						this.roleModal = false;

						this.updateTableList();
					} else {
						this.$Message.error('授权失败!请稍后再试...');
					}
					this.loading = false;
				})

			}

		},
		created() {
			this.updateTableList(this.params)
		},

	}
</script>
<style lang="less" scoped>
	.search-filter {
		opacity: 0;
		display: none;
		overflow: hidden;
		transition: all 0.28s ease-out;
		&.active {
			opacity: 1;
			display: block;
		}
	}
</style>
   <style>

         .ivu-tree-children > li > .ivu-tree-children > li{
            width: 100%;
            height: auto;
            clear: both;
        }
     .ivu-tree-children > li > a {
            /*color: #f04134;*/
            /*font-size: 15px;*/
            /*font-weight: bold;*/
            margin-top: -1px !important;
        }
         .ivu-tree-children > li  >.ivu-tree-title{
            color: #f04134;
            font-size: 15px;
            font-weight: bold;
        }
         .ivu-tree-children > li > .ivu-tree-children > li >  .ivu-tree-title{
            color: #f50;
            font-size: 14px;
        }
   
		 .ivu-tree-children >   li> .ivu-tree-children > li >.ivu-tree-children >   li  >.ivu-tree-title{	
            color: #00a854;
            font-size: 13px;
        }

       .ivu-tree-children > li > .ivu-tree-children > li > .ivu-tree-children >  li {
            width: 25%;
            float: left;
        }

	 
	   

        .demo-spin-icon-load{
            animation: ani-demo-spin 1s linear infinite;
        }
        @keyframes ani-demo-spin {
            from { transform: rotate(0deg);}
            50%  { transform: rotate(180deg);}
            to   { transform: rotate(360deg);}
        }
        .demo-spin-col{
            height: 100px;
            position: relative;
            border: 1px solid #eee;
        }
    </style>