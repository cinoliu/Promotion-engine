<style lang="less">
	@import '../../../styles/common.less';
	@import './work-flow.less';

</style>

<template>
    <div>
        <Row>
            <Card>
                <div class="step-header-con">
                    <h3>表单</h3>
                    <h5>表单1</h5>
                </div>
                <p class="step-content" ></p>
                <Form class="step-form" ref="step" :model="step"  :label-width="100">
                      <Form-item label="输入框">
            <i-input :value.sync="formItem.input" placeholder="请输入"></i-input>
        </Form-item>
        <Form-item label="选择器">
            <i-select :model.sync="formItem.select" placeholder="请选择">
                <i-option value="beijing">北京市</i-option>
                <i-option value="shanghai">上海市</i-option>
                <i-option value="shenzhen">深圳市</i-option>
            </i-select>
        </Form-item>
      
					
					
		  <Form-item label="日期控件">			
		 <Date-picker type="date" placeholder="选择日期" style="width: 200px"></Date-picker>			
		</Form-item>			
					
        <Form-item label="单选框">
            <Radio-group :model.sync="formItem.radio">
                <Radio value="male">男</Radio>
                <Radio value="female">女</Radio>
            </Radio-group>
        </Form-item>
        <Form-item label="多选框">
            <Checkbox-group :model.sync="formItem.checkbox">
                <Checkbox value="吃饭"></Checkbox>
                <Checkbox value="睡觉"></Checkbox>
                <Checkbox value="跑步"></Checkbox>
                <Checkbox value="看电影"></Checkbox>
            </Checkbox-group>
        </Form-item>
     
					

        <Form-item label="上传">
         
                <Card>
                    <p slot="title">
                        <Icon type="upload"></Icon>
                        可限制文件类型
                    </p>
                    <div class="height-120px">
                        <Row type="flex" justify="center" align="middle" class="height-100">
                            <Upload
                                action="//jsonplaceholder.typicode.com/posts/"
                                :format="['jpg', 'png', 'jpeg', 'gif', 'bmp', 'svg']"
                                :on-format-error="handleFormatError"
                                :before-upload="handleBeforeUpload"
                                :on-progress="handleProgress"
                                 :on-success="handleSuccess"
                                :on-error="handleError"	
									
                            >
                                <span>选择图片上传&nbsp;&nbsp;</span>
                                <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                            </Upload>
                        </Row>
                    </div>
                </Card>
           
        </Form-item>
					
					
					
					
        <Form-item label="文本域">
            <i-input :value.sync="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></i-input>
        </Form-item>
					<Form-item>
            <i-button type="primary">提交</i-button>
            <i-button type="ghost" style="margin-left: 8px">取消</i-button>
        </Form-item>
                </Form>
                <Steps :current="currentStep" :status="status">
                    <Step v-for="item in stepList1" :title="item.title" :content="item.describe + '审核并通过'" :key="item.title"></Step>
                </Steps>
            </Card>
        </Row>
    </div>
</template>

<script>
	export default {
		name: 'workflow',
		data() {
			return {
				stepList1: [],
				formItem: {
					input: '',
					select: '',
					radio: 'male',
					checkbox: [],
					textarea: ''
				},
				step: {
					opinion: '',
					remark: '',
					pass: '通过'
				},

				hasSubmit: false,
				currentStep: 0,
				status: 'wait'
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
		},


		mounted() {
			this.stepList1 = [{
					title: '1',
					describe: '1'
				},
				{
					title: '222',
					describe: '22'
				},
				{
					title: '33',
					describe: '333'
				},
				{
					title: '444',
					describe: '55'
				}
			];

			this.currentStep = 2;
		}
	};

</script>
