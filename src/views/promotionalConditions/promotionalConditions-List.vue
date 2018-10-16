<template>
	<div class="list">
		<!-- 搜索 v-show="state.searchState.show"-->
		<Row class="search-filter" :class="{'active':searchState}">
			<Col>
			<Card style="height: 125px;">
				<Form :label-width="80" inline>
					<Form-item label="登录账号">
						<Input v-model="formItem.user_name" placeholder="请输入" style="width:187px"></Input>
					</Form-item>

					<Form-item label="真实姓名">
						<Input v-model="formItem.real_name" placeholder="请输入" style="width:187px"></Input>
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
					<Col span="12">
					<FormItem label="登录账号" prop="user_name">
						<Input v-model="add_info.user_name" placeholder="请输入"></Input>
					</FormItem>
					</Col>
					<Col span="12">
					<FormItem label="真实姓名" prop="real_name">
						<Input v-model="add_info.real_name" placeholder="请输入"></Input>
					</FormItem>
					</Col>
				</Row>

				<Row>
					<Col span="12">
					<FormItem label="登录密码" prop="password">
						<Input v-model="add_info.password"></Input>
					</FormItem>
					</Col>
					<Col span="12">
					<FormItem label="密码验证" prop="password">
						<Input v-model="add_info.password2"></Input>
					</FormItem>
					</Col>
				</Row>

				<Row>
					<Col span="12">
					<FormItem label="联系电话" prop="mob_phone">
						<Input v-model="add_info.mob_phone" placeholder="请输入"></Input>
					</FormItem>

					</Col>
					<Col span="12">
					<FormItem label="联系邮箱" prop="email">
						<Input v-model="add_info.email" placeholder="请输入"></Input>
					</FormItem>
					</Col>
				</Row>

				<Row>
					<Col span="12">
					<FormItem label="用户状态" prop="status">
						<Select v-model="add_info.status" placeholder="请选择">
							<Option value=1>有效</Option>
							<Option value=0>失效</Option>

						</Select>
					</FormItem>
					</Col>

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
					<Col span="12">
					<FormItem label="登录账号" prop="user_name">
						<Input v-model="edit_info.user_name" placeholder="请输入"></Input>
					</FormItem>
					</Col>
					<Col span="12">
					<FormItem label="真实姓名" prop="real_name">
						<Input v-model="edit_info.real_name" placeholder="请输入"></Input>
					</FormItem>
					</Col>
				</Row>

				<Row>
					<Col span="12">
					<FormItem label="登录密码" prop="password">
						<Input value="***********" disabled></Input>
					</FormItem>
					</Col>
					<Col span="12">
					<FormItem label="联系电话" prop="mob_phone">
						<Input v-model="edit_info.mob_phone" placeholder="请输入"></Input>
					</FormItem>

					</Col>
				</Row>

				<Row>
					<Col span="12">
					<FormItem label="联系邮箱" prop="email">
						<Input v-model="edit_info.email" placeholder="请输入"></Input>
					</FormItem>
					</Col>
					<Col span="12">
					<FormItem label="用户状态" prop="status">
						<Select v-model="edit_info.status" placeholder="请选择">
							<Option value=1>有效</Option>
							<Option value=0>失效</Option>

						</Select>
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

		<Modal v-model="roleModal" v-if='DateReady' title="分配角色" width="650" :mask-closable="false">

			<Transfer :list-style="listStyle" :titles="['全部角色', '拥有角色']" :data="auth_list" :target-keys="new_auth_list" :render-format="render1" filterable :filter-method="filterMethod" @on-change="handleChange1">

			</Transfer>

			<div slot="footer">
				<i-button type="primary" size="large" long :loading="loading" @click="updateSystemAuth()" icon="checkmark-round">保存</i-button>
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
					user_name: "",
					real_name: "",
				},

				add_ruleValidate: {
					user_name: [{
						required: true,
						message: '请填写登录账号',
						trigger: 'blur'
					}],
					password: [{
							required: true,
							message: '请填写登录密码',
							trigger: 'blur'
						},
						{
							type: 'string',
							min: 6,
							message: '密码长度不能小于6位',
							trigger: 'blur'
						}
					],
					real_name: [{
						required: true,
						message: '请填写真实姓名',
						trigger: 'blur'
					}],
					mob_phone: [{
							required: true,
							message: '请填写联系电话',
							trigger: 'blur'
						},
						{
							type: 'string',
							max: 11,
							message: '联系电话最多只能11位数',
							trigger: 'blur'
						}
					],
					email: [

						{
							required: true,
							message: '邮箱不能为空',
							trigger: 'blur'
						},
						{
							type: 'email',
							message: '邮箱格式不正确',
							trigger: 'blur'
						}
					],

					status: [{
							required: true,
							message: '请选择状态',
							trigger: 'change'
						}

					]

				},

				add_info: {}, // 当前编辑和新增的行数据
				addModal: false,
				edit_info: {},
				editModal: false,

				roleModal: false,

				auth_list: [],
				new_auth_list: [],
				listStyle: {
					width: '280px',
					height: '300px',

				},

				listData: [], // @:data 列表数据
				columns1: [ //列表表头
					{
						title: '登录账号',
						key: 'user_name',
						align: 'center',
						fixed: 'left',
						width: 150,
					},
					{
						title: '真实姓名',
						key: 'real_name',
						align: 'center',
						width: 150,
					},
					{
						title: '邮箱',
						key: 'email',
						align: 'center',
						width: 150,

					},

					{
						title: '电话',
						key: 'mob_phone',
						align: 'center',
						width: 150,

					},

					{
						title: '创建时间',
						key: 'create_time',
						align: 'center',
						width: 150,

					},

					{
						title: '最后登录时间',
						key: 'last_time',
						align: 'center',
						width: 150,

					},

					{
						title: '最后登录IP',
						key: 'last_ip',
						align: 'center',
						width: 150,

					},

					{
						title: '状态',
						key: 'role',

						width: 150,
						render: (h, params) => {
							const row = params.row;
							const color = row.status === 1 ? 'blue' : 'red';
							const text = row.status === 1 ? '有效' : '无效';
							return h('Tag', {
								props: {
									type: 'dot',
									color: color
								}
							}, text);
						}
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
								}, '分配角色'),

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
					user_name: this.formItem.user_name,
					real_name: this.formItem.real_name,
					start: this.start,
					limit: this.limit,
				};
				this.func.ajaxPost(this.api.baseUrl + '/sysUser/getUserPage.do', this.qs.stringify(reqParams), res => {
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






			onSelect(selection, row) {

			},

			onSelectionChange(selection) {
				this.params.limit = selection
			},

			//删除
			remove(params) {

				this.$Modal.confirm({
					title: '删除确认',
					content: `此用户删除后，用户的以前所有的操作内容都会一并删除`,
					onOk: function() {
						this.$Loading.start();

						var reqParams = {
							user_id: params.row.user_id
						};

						this.func.ajaxPost(this.api.baseUrl + '/sysUser/delUser.do', this.qs.stringify(reqParams), res => {

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
				this.loading = true
				this.$refs[name].validate((valid) => {

					if (valid) {
						if (this.add_info.password === this.add_info.password2) {
							var reqParams = this.add_info;

							this.func.ajaxPost(this.api.baseUrl + '/sysUser/addUser.do',
								this.qs.stringify(reqParams), res => {

									if (res.data.errcode == 4005 && !res.data.success) {
										this.$Message.error('添加失败，登录账号已存在，请重新填写!', 3);
										return;
									}
									if (res.data.success == true || res.data.success == "true") {
										this.$Message.success('添加成功!');
										this.updateTableList()
										this.addModal = false;

									} else {
										this.$Message.error(res.data.errcode + '添加失败!请稍后再试...');

										this.loading = false
									}

								});

						} else {
							this.$Message.error('2次密码输入不一致!');
							this.loading = false
						}
					} else {
						this.$Message.error('表单验证失败!');
						this.loading = false
					}

				})

			},

			editOpen(index) {

				this.listData[index].status = this.listData[index].status == 1 ? '1' : '0'
				this.edit_info = this.listData[index]
				this.editModal = true
				this.loading = false

			},

			editInfo(name) {
				this.loading = true
				this.$refs[name].validate((valid) => {

					if (valid) {

						var reqParams = this.edit_info;

						this.func.ajaxPost(this.api.baseUrl + '/sysUser/editUser.do', this.qs.stringify(reqParams), res => {

							if (res.data.success == true || res.data.success == "true") {
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

				var dataStrArr = [];

				var dataIntArr = [];
				dataStrArr = this.role_auth_info.roleIds.split(",");

				dataStrArr.forEach(function(data, index, arr) {
					dataIntArr.push(+data);
				});

				this.new_auth_list = dataIntArr

				this.getSystemAuthList(this.role_auth_info);

				this.roleModal = true
				this.loading = false

			},

			getSystemAuthList(obj) {

				var reqParams = {
					user_id: obj.user_id,
					roleIds: JSON.stringify(obj)
				}
				this.func.ajaxPost(this.api.baseUrl + '/role/loadAllSysRole.do', this.qs.stringify(reqParams), res => {

					for (var i = 0; i < res.data.root.length; i++) {

						var item = {
							key: res.data.root[i].role_id,
							label: res.data.root[i].descn,
							description: res.data.root[i].descn,

						};
						this.auth_list.push(item)
					}

					
					
				})

			},

			render1(item) {
				return item.label;
			},
			handleChange1(newTargetKeys, direction, moveKeys) {
				this.new_auth_list = newTargetKeys;
			},

			filterMethod(data, query) {
				return data.label.indexOf(query) > -1;
			},

			updateSystemAuth() {

				var reqParams = {
					user_id: this.role_auth_info.user_id,
					roleIds: this.new_auth_list.join(",")
				};



				this.loading = true;
				this.func.ajaxPost(this.api.baseUrl + '/sysUser/grantRole2User.do', this.qs.stringify(reqParams), res => {

					if (res.data.success) {
						this.loading = false;
						this.roleModal = false;

						this.updateTableList();
						this.$Message.success('保存成功!');
					} else {
						this.$Message.error('保存失败!', 2);
					}
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
