<style lang="less">
	@import '../styles/unlock.less';

</style>

<template>
    <transition name="show-unlock">
        <div class="unlock-body-con" v-if="showUnlock" @keydown.enter="handleUnlock">
            <div @click="handleClickAvator" class="unlock-avator-con" :style="{marginLeft: avatorLeft}">
                <img class="unlock-avator-img" src="../../../../../src/images/user.jpg">
                <div  class="unlock-avator-cover">
                    <span><Icon type="unlocked" :size="30"></Icon></span>
                    <p>解锁</p>
                </div>
            </div>
            <div class="unlock-avator-under-back" :style="{marginLeft: avatorLeft}"></div>
            <div class="unlock-input-con">
                <div class="unlock-input-overflow-con">
                    <div class="unlock-overflow-body" :style="{right: inputLeft}">
                        <input ref="inputEle" v-model="password" class="unlock-input" type="password" placeholder="请输入登录密码" />
                        <button ref="unlockBtn" @mousedown="unlockMousedown" @mouseup="unlockMouseup" @click="handleUnlock" class="unlock-btn"><Icon color="white" type="key"></Icon></button>
                    </div>
                </div>
            </div>
            <div class="unlock-locking-tip-con">已锁定</div>
        </div>
    </transition>
</template>

<script>
	import Cookies from 'js-cookie';
	export default {
		name: 'Unlock',
		data() {
			return {
				avatorLeft: '0px',
				inputLeft: '400px',
				password: '',
				check: null
			};
		},
		props: {
			showUnlock: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			avatorPath() {
				return localStorage.avatorImgPath;
			}
		},
		methods: {

			handleClickAvator() {
				this.avatorLeft = '-180px';
				this.inputLeft = '0px';
				this.$refs.inputEle.focus();
			},
			handleUnlock() {




				let reqParams = {
					username: sessionStorage.getItem('user'),
					password: this.password,

				}


				this.func.ajaxSignin(this.api.baseUrl + '/sysUser/signin', this.qs.stringify(reqParams), res => {
					if (res.data.code == 200) {

						sessionStorage.setItem('Authorization', res.data.Authorization);



						this.$Message.info('登陆成功');

						this.avatorLeft = '0px';
						this.inputLeft = '400px';
						this.password = '';
						Cookies.set('locking', '0');
						this.$emit('on-unlock');




					} else {

						this.$Message.error(res.data.msg);
					}
				});









			},
			unlockMousedown() {
				this.$refs.unlockBtn.className = 'unlock-btn click-unlock-btn';
			},
			unlockMouseup() {
				this.$refs.unlockBtn.className = 'unlock-btn';
			}
		}
	};

</script>
