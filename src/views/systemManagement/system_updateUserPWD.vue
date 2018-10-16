<template>
	<Card>

		<Form :model="formItem" :label-width="120" ref="formValidate" :rules="formValidate" style="width:650px;margin:auto">

			<Form-item label="密码显示">
				<i-switch size="large" @on-change="change">
					<span slot="open">显示</span>
					<span slot="close">隐藏</span>
				</i-switch>
			</Form-item>

			<FormItem label="原密码" prop="out_pwd">
				<Input v-model="formItem.out_pwd" placeholder="请输入原密码..." :type="password_type"></Input>
			</FormItem>

			<FormItem label="新密码" prop="new_pwd">
				<Input v-model="formItem.new_pwd" placeholder="请输入新密码..." :type="password_type"></Input>
			</FormItem>

			<FormItem label="检验新密码" prop="new_pwd2">
				<Input v-model="formItem.new_pwd2" placeholder="请再次输入新密码..." :type="password_type"></Input>
			</FormItem>

			<FormItem>
				<Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
				<Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>

			</FormItem>

		</Form>

		<Modal v-model="is_show" title="分配角色" width="650" :mask-closable="false">

			<p slot="header" style="color:#464c5b;text-align:center">
				<span>温馨提示</span>
			</p>
			<div style="text-align:center">
				<p style="color: #33d685;font-size: 100px;">
					<Icon type="ios-checkmark"></Icon>
				</p>
				<p>密码修改成功，请牢记您的新密码</p>
				<p><span v-text="sec + 's'" style="color: #f50;font-size: 16px;" class="font-bold"></span> 后自动重新登录</p>
			</div>
			<div slot="footer">
				<i-button type="primary" size="large" long @click="logOut()">立即重新登录</i-button>
			</div>
		</Modal>

	</Card>
</template>
<script>
	export default {
		name: 'list',
		components: {},
		data() {
			return {

				sec: 5,
				is_show: false,
				loading: false,
				password_type: "password",
				formItem: {
					out_pwd: "",
					new_pwd: "",
					new_pwd2: ""
				},
				formValidate: {
					out_pwd: [{
						required: true,
						message: '请填写原密码',
						trigger: 'blur'
					}],
					new_pwd: [{
						required: true,
						message: '请填写新密码',
						trigger: 'blur'
					}],
					new_pwd2: [{
						required: true,
						message: '请填写检验新密码',
						trigger: 'blur'
					}]
				}

			}
		},

		methods: {
			change(status) {
				if(status)
					this.password_type = "text";
				else
					this.password_type = "password";
			},

			handleReset(out_pwd) {
				this.$refs[out_pwd].resetFields();
			},

			handleSubmit(name) {
				this.loading = true
				this.$refs[name].validate((valid) => {

					if(valid) {

						if(this.formItem.new_pwd !== this.formItem.new_pwd2) {
							this.$Message.error("2次新密码输入不一致...请再次确认无误！", 3);
						} else {
							this.updatePwd();
						}

					} else {
						this.$Message.error('表单验证失败!');
						this.loading = false
					}

				})

			},

			updatePwd() {
				var reqParams = {
					pwd: this.formItem.out_pwd,
					new_pwd: this.formItem.new_pwd
				};
				this.loading = true;

				this.func.ajaxPost(this.api.baseUrl + '/sysUser/modifyPwd.do', this.qs.stringify(reqParams), res => {

					if(res.data.success) {
						this.is_show = true;
						var stopSec = setInterval((function() {
							this.sec -= 1;

							if(this.sec === 0) {
								clearInterval(stopSec);
								this.logOut();
							}
						}).bind(this), 1000);
					} else {
						this.$Message.error(res.data.errorMsg, 5);
					}
					this.loading = false;

				})
			},

			logOut() {
				this.$store.commit('logout', this);
				this.$store.commit('clearOpenedSubmenu');
				this.$router.push({
					name: 'login'
				});
			}

		},

	}
</script>