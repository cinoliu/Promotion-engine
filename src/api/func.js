import axios from "axios";

export default {


	//登陆请求
	ajaxSignin(api, post, cb) {
		let config = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
		}
		axios.post(api, post).then(cb)
			.catch(err => {
				console.log(err);
			})
	},



	//get提交
	ajaxGet(api, cb) {
		axios.get(api)
			.then(cb)
			.catch(err => {
				console.log(err);
			})
	},

	//Request Payload提交 	
	ajaxPostfile(api, post, cb) {
		let config = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',

			},
		}
		axios.post(api, post, config)
			.then(cb)
			.catch(err => {
				console.log(err);
			})
	},






	//Form Data提交
	ajaxPost(api, post, cb) {

		let config = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',

			},
		}
		axios.post(api, post, config).then(cb)
			.catch(err => {
				console.log(err);
			})


	},





}
