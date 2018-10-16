<template>
  <div class="list">
   
 
   <input id="uploadFile_member_info" type="file" accept=".XLS,.xlsx"
                                                       class="ivu-btn ivu-btn-ghost" file_type="offline_level_store" name="fileName"
                                                       @change="importExcel($event)" icon="ios-cloud-upload-outline"/>
  </div>
</template>
<script>
	export default {
		name: 'list',
		components: {},
		data() {
			return {

				fileName: "",

			}
		},

		
		methods: {




			importExcel(event) {
				var file = event.target.files[0]; //获取第一个file文件


				var reqObj = new FormData();
				reqObj.append('file', file);
				reqObj.append('fileName', this.fileName);
				reqObj.append('fileType', "xlsx");
				this.func.ajaxPost(this.api.baseUrl + '/sysUser/editUser.do', reqObj, res => {

					console.log(res.data.code)

					if (res.data.code == 200) {
						this.$Message.info('上传成功！');
						$("#uploadFile_member_info").val("");


					} else {
						this.fileName = "";
						$("#uploadFile_member_info").val("");
						this.$Message.error(res.msg)
					}


				})


			},



		},


	}

</script>
