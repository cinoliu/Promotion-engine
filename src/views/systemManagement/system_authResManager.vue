<template>
	<div class="list">
		<!-- 搜索 v-show="state.searchState.show"-->
		<Row class="search-filter" :class="{'active':searchState}">
			
			<Card style="height: 125px;">
			 
				<Form :label-width="80" inline>
					 
		        
					<Form-item label="资源名称" :label-width="70">
						<i-input type="text" :value.sync="auth_name" placeholder="请输入..." @on-enter="queryTableList()" style="width:200px;"></i-input>
						<input type="text" style="display: none" />
					</Form-item>
	     
					<Form-item label="资源类型" :label-width="70" style="position: fixed;z-index: 999;"> 
						<Select v-model="type_selected" style="width:200px;">
							<Option value="ALL">全部</Option>
							<Option value="MODULE">模块</Option>
							<Option value="MENU">菜单</Option>
							<Option value="OPT">操作</Option>
						</Select>
					</Form-item>
				
					<Form-item label="所属父资源" :label-width="80"  style="position: fixed;z-index: 999;margin-left:22%"> 
						<Select v-model="parent_selected" style="width:200px;">
							<Option v-for="item in parent_res" :value="item.auth_id" :key="item.auth_id">{{ item.name }}</Option>

						</Select>
					</Form-item>
				

					<Row class="clearfix" style="border-top:1px solid #eee;margin-top:-15px;padding-top:10px;text-align:right">
						<span class="pull-right">
                         <Button type="primary" icon="ios-search" shape="circle" @click="queryTableList()">查询</Button>
                      </span>
					</Row>
					
					
				</Form>
			</Card>
			
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

		<Modal v-model="addModal" v-if='DateReady' title="新增" width="700" :mask-closable="false">

			<Form :model="add_info" :label-width="100" ref="add_info" :rules="formValidate">

				<Row>
					<Col span="12">

					<Form-item label="资源名称" prop="name">

						<Input v-model="add_info.name" placeholder="请输入"></Input>

					</Form-item>
					</Col>
					<Col span="12">
					<Form-item label="资源类型" prop="auth_type">
						<Select v-model="add_info.auth_type">
							<Option value="MODULE">模块</Option>
							<Option value="MENU">菜单</Option>
							<Option value="OPT">操作</Option>

						</Select>
					</Form-item>

					</Col>
				</Row>

				<Row>

					<Col span="12">
					<Form-item label="资源标识" prop="res_key">

						<Input v-model="add_info.res_key" placeholder="请以 ROLE_ 为前缀..."></Input>

					</Form-item>

					</Col>

					<Col span="12">
					<Form-item label="所属父资源" prop="parent_id">
						<Select v-model="add_info.parent_id" placeholder="请选择">
							<Option v-for="item in parent_res" :value="item.auth_id" :key="item.auth_id">{{ item.name }}</Option>

						</Select>
					</Form-item>
					</Col>

				</Row>

				<Row>

					<Col span="12">

					<Form-item label="资源URL" prop="link_url">

						<Input v-model="add_info.link_url" placeholder="请输入页面文件相对路径..."></Input>
					</Form-item>
					</Col>

					<Col span="12">
					<Form-item label="资源图标" prop="icon">

						<Input v-model="add_info.icon" placeholder="请输入..."></Input>
					</Form-item>
					</Col>
				</Row>

				<Row>
					<Col span="12">

					<Form-item label="是否子节点" prop="isLeaf">
						<Select v-model="add_info.isLeaf">

							<Option value=1>是</Option>
							<Option value=0>否</Option>

						</Select>
					</Form-item>

					</Col>
					<Col span="12">
					<Form-item label="资源排序" prop="sort">

						<Input v-model="add_info.sort" placeholder="请输入..."></Input>

					</Form-item>

					</Col>

				</Row>

			</Form>

			<div slot="footer">
				<Button size="large" type="primary" long @click="addInfo('add_info')" :loading="loading">
          保存
        </Button>
			</div>
		</Modal>

		<Modal v-model="editModal" v-if='DateReady' title="编辑" width="700" :mask-closable="false">

			<Form :model="edit_info" :label-width="100" ref="edit_info" :rules="formValidate">

				<Row>
					<Col span="12">

					<Form-item label="资源名称" prop="name">

						<Input v-model="edit_info.name" placeholder="请输入"></Input>

					</Form-item>
					</Col>
					<Col span="12">
					<Form-item label="资源类型" prop="auth_type">
						<Select v-model="edit_info.auth_type">

							<Option value="MODULE">模块</Option>
							<Option value="MENU">菜单</Option>
							<Option value="OPT">操作</Option>

						</Select>
					</Form-item>

					</Col>
				</Row>

				<Row>

					<Col span="12">
					<Form-item label="资源标识" prop="res_key">

						<Input v-model="edit_info.res_key" placeholder="请以 ROLE_ 为前缀..."></Input>

					</Form-item>

					</Col>

					<Col span="12">
					<Form-item label="所属父资源" prop="parent_id">
						<Select v-model="edit_info.parent_id" filterable>
							<Option v-for="item in parent_res" :value="item.auth_id" :key="item.auth_id">{{ item.name }}</Option>

						</Select>
					</Form-item>
					</Col>

				</Row>

				<Row>

					<Col span="12">

					<Form-item label="资源URL" prop="link_url">

						<Input v-model="edit_info.link_url" placeholder="请输入页面文件相对路径..."></Input>
					</Form-item>
					</Col>

					<Col span="12">
					<Form-item label="资源图标" prop="icon">

						<Input v-model="edit_info.icon" placeholder="请输入..."></Input>
					</Form-item>
					</Col>
				</Row>

				<Row>
					<Col span="12">

					<Form-item label="是否子节点" prop="isLeaf">
						<Select v-model="edit_info.isLeaf">
							<Option value=1>是</Option>
							<Option value=0>否</Option>
						</Select>
					</Form-item>

					</Col>
					<Col span="12">
					<Form-item label="资源排序" prop="sort">

						<Input v-model="edit_info.sort" placeholder="请输入..."></Input>

					</Form-item>

					</Col>

				</Row>

			</Form>

			<div slot="footer">
				<Button size="large" type="primary" long @click="editInfo('edit_info')" :loading="loading">
          保存
        </Button>
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


				auth_name: "",

				type_selected: "ALL",

				parent_res: [], //父资源
				parent_selected: -1,

				add_info: {}, // 当前编辑和新增的行数据
				addModal: false,

				parent_option: [],

				formValidate: {
					name: [{
						required: true,
						message: '请填写资源名称',
						trigger: 'blur'
					}],
					auth_type: [{
						required: true,
						message: '请选择资源类型',
						trigger: 'change'
					}],
					res_key: [{
						required: true,
						message: '请填写资源标识,并以 ROLE_ 为前缀',
						trigger: 'blur'
					}],
					//                    parent_id: [
					//                        {required: true, message: '请选择所属父资源', trigger: 'change'}
					//                    ],
					link_url: [{
						required: true,
						message: '请填写资源URL',
						trigger: 'blur'
					}],
					icon: [{
						required: true,
						message: '请填写资源图标',
						trigger: 'blur'
					}],
					isLeaf: [{
						required: true,
						message: '请选择是否子节点',
						trigger: 'change'
					}],
					sort: [{
						required: true,
						message: '请填写资源排序',
						trigger: 'blur'
					}]
				},

				edit_info: {},
				editModal: false,

				listData: [], // @:data 列表数据
				columns1: [ //列表表头
					{
						title: '资源名称',
						key: 'name',
						align: 'center',
						fixed: 'left',
						width: 150,
					},

					{
						title: '资源类型',
						key: 'auth_type',

						width: 150,
						render: (h, params) => {
							const row = params.row;
							const color = row.auth_type === 'MODULE' ? 'blue' : row.auth_type === 'MENU' ? 'red' : 'green';
							const text = row.auth_type === 'MODULE' ? '模块' : row.auth_type === 'MENU' ? '菜单' : '操作';

							return h('Tag', {
								props: {
									color: color
								}
							}, text);
						}
					},

					{
						title: '资源标识',
						key: 'res_key',
						align: 'center',
						width: 150,

					},

					{
						title: 'URL',
						key: 'link_url',
						align: 'center',
						width: 150,

					},

					{
						title: '小图标',
						key: 'icon',
						align: 'center',
						width: 150,

					},

					{
						title: '子节点',
						key: 'isLeaf',

						width: 150,
						render: (h, params) => {
							const row = params.row;
							const color = row.isLeaf === 1 ? 'blue' : 'red';
							const text = row.isLeaf === 1 ? '是' : '否';
							return h('Tag', {
								props: {

									color: color
								}
							}, text);
						}
					},

					{
						title: '排序',
						key: 'sort',
						align: 'center',
						width: 150,

					},

					{
						title: '最后更新时间',
						key: 'modify_time',
						align: 'center',
						width: 150,

					},

					{
						title: '修改人',
						key: 'editor',
						align: 'center',
						width: 150,

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
					if (val) {
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
			changePageSize(pageSize) {
				this.limit = pageSize;
				this.updateTableList();
			},
			changeCurrent(current) {
				this.start = current * this.limit - this.limit;
				this.updateTableList();
			},

			//列表
			updateTableList(params) {
				this.TableLoading = true
				this.load = true;
				var reqParams = {
					name: this.auth_name,
					auth_type: this.type_selected,
					parent_id: this.parent_selected,
					start: this.start,
					limit: this.limit,
				};

				this.func.ajaxPost(this.api.baseUrl + '/authRes/getAuthResPage.do', this.qs.stringify(reqParams), res => {
					this.TableLoading = false
					if (res.status == 200) {
						this.totalSize = res.data.totalSize;
						this.listData = res.data.resultList;
						this.DateReady = true


					} else {
						this.$Message.error(res.msg)

					}

				});

			},

			getAuthResTypeList: function() {
				var reqParams = {
					authType: "noOpt"
				};
				this.func.ajaxPost(this.api.baseUrl + '/authRes/getParentResByAuthType.do', this.qs.stringify(reqParams), res => {

					this.parent_res = res.data.root
				})

			},



			onSelect(selection, row) {
				// console.log(selection,row)
			},

			onSelectionChange(selection) {
				this.params.limit = selection
			},

			//删除
			remove(params) {

				this.$Modal.confirm({
					title: '删除确认',
					content: `删除此资源后，与之相关联的数据都会一并删除`,
					onOk: function() {
						this.$Loading.start();

						var reqParams = {
							auth_id: params.row.auth_id
						};

						this.func.ajaxPost(this.api.baseUrl + '/authRes/delRes.do', this.qs.stringify(reqParams), res => {

							this.loading = false
							if (res.data.success) {

								this.$Message.info('删除成功！');
								this.updateTableList();
							} else {

								this.$Message.error('删除失败!请稍后再试...!');

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

				this.$refs[name].validate((valid) => {
					if (valid) {
						if (this.add_info.res_key.substr(0, 5) !== "ROLE_") {

							this.$Message.error('亲..资源标识必须要以 ROLE_ 为前缀哦~');

							return;
						}
						this.addAuthResInfo();
					} else {
						this.$Message.error('表单验证失败!');

					}
				})
			},

			addAuthResInfo() {
				var reqParams = this.add_info;
				this.loading = true;
				this.func.ajaxPost( this.api.baseUrl + '/authRes/addAuthRes.do',this.qs.stringify(reqParams), res => {

					if (res.success) {
						this.$Message.success("新增成功!");
						this.updateTableList();
						this.addModal = false;
					} else {
						this.$Message.error('新增失败!');
					}
					this.loading = false;
				})
			},

			editOpen(index) {

				this.listData[index].isLeaf = this.listData[index].isLeaf == 1 ? '1' : '0'

				this.edit_info = this.listData[index]


				this.editModal = true
				this.loading = false

			},

			editInfo: function(name) {

				this.$refs[name].validate((valid) => {

					if (valid) {
						if (this.edit_info.res_key.substr(0, 5) !== "ROLE_") {
							this.$Message.error('亲..资源标识必须要以 ROLE_ 为前缀哦~');
							return;
						}
						this.updateAuthResInfo();
					} else {
						this.$Message.error('表单验证失败!');
					}
				})
			},

			updateAuthResInfo: function() {
				var reqParams = this.edit_info;
				this.loading = true;
				this.func.ajaxPost(this.api.baseUrl + '/authRes/editRes.do', this.qs.stringify(reqParams), res => {

					if (res.success) {
						this.$Message.success("保存成功!");
						this.editModal = false;
						this.updateTableList();
					} else {
						this.$Message.error('保存成功!');
					}
					this.loading = false;
				})
			}

		},
		created() {
			this.updateTableList(this.params)
			this.getAuthResTypeList()
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
