<style lang="less">
	@import './login.less';

</style>

<template>
	<Row type="flex" justify="center" align="middle" class="login">
		<Col :xs="{span:22}" style="width: 368px;">
		<Row class="header">
			<img src="../images/login_logo.png" width="300px" />

		</Row>

		<Row class="login-form">

			<Form :model="form" ref="form" :rules="formValidate" class="form">

				<FormItem prop="username">
					<Input v-model="form.userName" size="large" clearable placeholder="请输入用户名">
					<span slot="prepend">
                                        <Icon :size="16" type="person"></Icon>
                                    </span>
					</Input>
				</FormItem>

				<FormItem prop="password">
					<Input type="password" v-model="form.password" placeholder="请输入密码" size="large">
					<span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
					</Input>
				</FormItem>

			</Form>


			<Row type="flex" justify="space-between" class="code-row-bg other-login">
				<Button @click="handleSubmit('form')" type="primary" long size="large">登录</Button>
			</Row>

		</Row>

		<Row class="foot">

			<Row type="flex" justify="center" class="code-row-bg copyright">
				知而行（上海）营销咨询有限公司 广州泰思管理科技有限公司 <br> Copyright@2012-2018 粤ICP备05081589号-2 <br>

			</Row>
		</Row>

		</Col>

		<Modal v-model="showDialog" width="450" :styles="{top: '25%'}">
			<p slot="header" style="color:#f60;text-align:center">
				<Icon type="information-circled"></Icon>
				<span>请输入验证码</span>
			</p>
			<div class="social-signup-container">
				   <Verify @success="alert('success')" @error="alert('error')"  :type="5" ></Verify>
			</div>
			<div slot="footer">

			</div>
		</Modal>

	</Row>
</template>

<script>
	import Verify from 'vue2-verify'
	import Cookies from 'js-cookie';
	import openWindow from '@/libs/openWindow'
	import router from "@/router/index";
	import util from "@/libs/util.js";


	export default {
		data() {
			return {

				form: {
					userName: 'admin',
					password: '',
					remember: []
				},
				formValidate: {
					userName: [{
						required: true,
						message: '账号不能为空',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '密码不能为空',
						trigger: 'blur'
					}]
				},
				showDialog: false,

			};

		},
		components: {
			Verify
		},
		methods: {


			alert(text) {
				console.log(text)

				if (text == 'success') {

					util.initRouter(this);
					this.$router.push({
						name: "home_index"
					});

				} else {
					this.$Message.error('验证失败!');
				}


			},


			handleSubmit(name) {
				this.$refs[name].validate((valid) => {
					if (valid) {

						let reqParams = {
							username: this.form.userName,
							password: this.form.password,

						}


						this.func.ajaxSignin(this.api.baseUrl + '/sysUser/signin', this.qs.stringify(reqParams), res => {
							if (res.data.code == 200) {
								Cookies.set('user', this.form.userName);

								sessionStorage.setItem('user', this.form.userName);
								sessionStorage.setItem('Authorization', res.data.Authorization);



								this.$Message.info('登陆成功');

								setTimeout(function() {

									util.initRouter(this);
									this.$router.push({
										name: "home_index"
									});

								}.bind(this), 1200);




							} else {

								this.$Message.error(res.data.msg);
							}
						});

					} else {
						this.$Message.error('登录失败');


					}


				});
			},





		},
		mounted() {
			if (sessionStorage.getItem('userName')) {
				this.form.userName = JSON.parse(sessionStorage.getItem('userName'));
			}
			if (sessionStorage.getItem('password')) {
				this.form.password = JSON.parse(sessionStorage.getItem('password'));
			}
		}
	};

</script>
