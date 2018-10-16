<style lang="less">
	@import './own-space.less';

</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                个人信息
            </p>
            <div>
              
					
				<Form :model="edit_info" :label-width="100" ref="edit_info" :rules="add_ruleValidate"  label-position="right" :loading="loading2">	
					
                 	<FormItem label="登录账号" prop="user_name" :label-width="100">
					
							   <span>{{ edit_info.user_name }}</span>
					</FormItem>
					
					<FormItem label="真实姓名" prop="real_name">
						  <div style="display:inline-block;width:300px;" >
                            <Input v-model="edit_info.real_name" ></Input>
                        </div>	
						
					</FormItem>
					
                 <FormItem label="登录密码" prop="password">
					   <div style="display:inline-block;width:300px;" >
                          	<Input value="***********" disabled></Input>
                        </div>	
					
					</FormItem>
				
					<FormItem label="联系电话" prop="mob_phone">
						
						  <div style="display:inline-block;width:300px;" >
                            <Input v-model="edit_info.mob_phone" ></Input>
                        </div>	
						
						
				
					</FormItem>
					
					
					<FormItem label="联系邮箱" prop="email">
					  <div style="display:inline-block;width:300px;" >
                            <Input v-model="edit_info.email" ></Input>
                        </div>	
						
	
					</FormItem>
				
					<FormItem label="用户状态" prop="status">

						 <Tag type="dot"  color="blue"  v-if="edit_info.status==1">有效</Tag>
						<Tag type="dot"  color="red" v-if="edit_info.status==1">失效</Tag>
 
					</FormItem>	
					
			
                    <div>
                        <Button type="text" style="width: 100px;" @click="cancelEditUserInfor">取消</Button>
                        <Button type="primary" style="width: 100px;" @click="editInfo('edit_info')"  :loading="loading" >保存</Button>
                    </div>
                </Form>
            </div>
        </Card>
  
    </div>
</template>

<script>
	export default {
		name: 'ownspace_index',
		data() {

			return {

				edit_info: {},
				add_ruleValidate: {

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



				},


				loading: false,
			};
		},
		methods: {
			updateTableList() {


				var reqParams = {
					user_name: sessionStorage.getItem('user'),

				};
				this.func.ajaxPost(this.api.getSystemUsers, this.qs.stringify(reqParams), res => {

					if (res.status == 200) {

						this.edit_info = res.data.resultList;

					} else {
						this.$Message.error(res.msg)

					}

				});

			},


			cancelEditUserInfor() {
				this.$store.commit('removeTag', 'ownspace_index');
				localStorage.pageOpenedList = JSON.stringify(this.$store.state.app.pageOpenedList);
				let lastPageName = '';
				if (this.$store.state.app.pageOpenedList.length > 1) {
					lastPageName = this.$store.state.app.pageOpenedList[1].name;
				} else {
					lastPageName = this.$store.state.app.pageOpenedList[0].name;
				}
				this.$router.push({
					name: lastPageName
				});
			},

			editInfo(name) {
				this.loading = true
				this.$refs[name].validate((valid) => {

					if (valid) {

						var reqParams = this.edit_info;

						this.func.ajaxPost(this.api.updateSystemUser, this.qs.stringify(reqParams), res => {
							this.loading = false
							if (res.data.success == true || res.data.success == "true") {
								this.$Message.success('修改成功!');
								setTimeout(function() {
									this.cancelEditUserInfor();
								}.bind(this), 1200);


							} else {

								this.$Message.error(res.data.errcode + '修改失败!请稍后再试...');


							}

						});

					} else {
						this.$Message.error('表单验证失败!');
						this.loading = false
					}

				})

			},

		},
		created() {
			this.updateTableList()
		},
	};

</script>
