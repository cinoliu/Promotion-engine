<style lang="less">
    @import '../../styles/common.less';
    @import 'upload.less';
</style>


<template>
    <div>
       
        <div class="margin-top-10">
       
            <Col span="16">
                <div class="padding-left-10">
                    <Card>
                        <p slot="title">
                            <Icon type="ios-analytics"></Icon>
                            综合实例
                        </p>
                        <div >
							
						   <Col span="12" class="padding-left">
                            
                                  
                                        <div class="admin-upload-list"  >
                                            <template>
                                                <img :src="defaultList.url">
                                                <div class="admin-upload-list-cover">
                                                    <Icon type="ios-eye-outline" @click.native="visible = true"></Icon>
                                                    <Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
                                                </div>
                                            </template>
                                           
                                        </div>
                              
                                    <Upload
                                        ref="upload"
                                        :show-upload-list="false"                    
                                        :format="['jpg','jpeg','png']"
                                        :max-size="2048"
                                        :on-exceeded-size="handleMaxSize"
                                        :on-format-error="handleFormatError"
                                        :before-upload="handleBeforeUpload"
                                        :on-progress="handleProgress"
                                        :on-success="handleSuccess"
                                        :on-error="handleError"
                                        type="drag"
                                        action="//jsonplaceholder.typicode.com/posts/"
                                        style="display: inline-block;width:100px;">
                                        <div style="width: 100px;height:100px;line-height: 100px;">
                                            <Icon type="camera" size="20"></Icon>
                                        </div>
                                    </Upload>
                                    <Modal title="查看图片" v-model="visible">
                                        <img :src="defaultList.url" v-if="visible" style="width: 100%">
                                    </Modal>
                              
                            </Col>
                         </div>
                    </Card>
                </div>
            </Col>
        </div>
    </div>
</template>

<script>
export default {
    name: 'file-upload',
    data () {
        return {
            defaultList: 
                {
                    'name': 'a42bdcc1178e62b4694c830f028db5c0',
                    'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
                },
            imgName: '',
            visible: false,
            uploadList: []
        };
    },
    methods: {
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请选择图片文件。'
            });
        },
        handleBeforeUpload (file) {
            this.$Notice.warning({
                title: '文件准备上传',
                desc: '文件 ' + file.name + ' 准备上传。'
            });
        },
        handleProgress (event, file) {
            this.$Notice.info({
                title: '文件正在上传',
                desc: '文件 ' + file.name + ' 正在上传。'
            });
        },
        handleSuccess (evnet, file) {
            this.$Notice.success({
                title: '文件上传成功',
                desc: '文件 ' + file.name + ' 上传成功。'
            });
        },
        handleError (event, file) {
            this.$Notice.error({
                title: '文件上传成功',
                desc: '文件 ' + file.name + ' 上传失败。'
            });
        },
     
        handleRemove (file) {
            // 从 upload 实例删除数据
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
     
   
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
            });
        },
      
    },
    mounted () {
        this.uploadList = this.$refs.upload.fileList;
    }
};
</script>
