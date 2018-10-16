<template>
    <div>
        <Card>
            <p slot="title" class="card-title">
                <Icon type="home"></Icon>
                <span>资源管理</span>
            </p>
            <div>
                <template>
                    <Row>
                        <Col span="15"  class="margin-bottom-10">
                            <Button type="info" @click="openAddModal(null)"><Icon type="md-add"></Icon>&nbsp;添加资源</Button>
                            <Button :disabled="setting.loading" type="success" @click="getData"><Icon type="md-refresh"></Icon>&nbsp;刷新数据</Button>
                            <Tooltip placement="top">
                                <i-switch size="large" v-model="props.isFold">
                                    <span slot="open">开启</span>
                                    <span slot="close">关闭</span>
                                </i-switch>
                                <div slot="content">
                                    <p>是否折叠所有的节点</p>
                                </div>
                            </Tooltip>
                        </Col>
                    </Row>
                    <zk-table
                        ref="table"
                        sum-text="sum"
                        index-text="#"
                        :data="datas"
                        :columns="columns"
                        :stripe="props.stripe"
                        :border="props.border"
                        :show-header="props.showHeader"
                        :show-summary="props.showSummary"
                        :show-row-hover="props.showRowHover"
                        :show-index="props.showIndex"
                        :tree-type="props.treeType"
                        :is-fold="props.isFold"
                        :expand-type="props.expandType"
                        :selection-type="props.selectionType">
                        <template slot="type" slot-scope="scope">
                            <span v-if="scope.row.type==0"><Icon type="grid"></Icon>&nbsp;菜单</span>
                            <span v-else><Icon type="android-radio-button-on"></Icon>&nbsp;按钮</span>
                        </template>
                        <template slot="icon" slot-scope="scope">
                            <span v-if="scope.row.icon!=null && scope.row.icon!=''"><Icon :type="scope.row.icon"></Icon></span>
                            <span v-else>-</span>
                        </template>
                        <template slot="color" slot-scope="scope">
                            <span v-if="scope.row.color!=null && scope.row.color!=''">
                                <Icon type="paintbucket" :color="scope.row.color"></Icon>
                            </span>
                            <span v-else>-</span>
                        </template>
                        <template slot="verification" slot-scope="scope">
                            <span v-if="scope.row.verification==true">
                                是
                            </span>
                            <span v-else>否</span>
                        </template>
                        <template slot="action" slot-scope="scope">
                            <Button type="primary" @click="edit(scope.row)" size="small">编辑</Button>
                            <Button type="success" @click="openAddModal(scope.row)" size="small">添加下级</Button>
                            <Button type="error" @click="removeModalOpen(scope.row.id)" size="small">删除</Button>
                        </template>
                    </zk-table>
                </template>
            </div>
        </Card>
        <Modal v-model="modal.show" :title="modal.type==1 ? '添加资源':'更新资源'"
             @on-ok="modalOk"
             :mask-closable="false">
             <Alert show-icon>为方便操作，添加时[资源链接/权限标识]会自动继承父级的资源属性。</Alert>
            <Form :model="modal.data" :label-width="80">
                <FormItem v-if="modal.type==2" label="ID">
                    <Input disabled :value="modal.data.id"></Input>
                </FormItem>
                <FormItem v-if="modal.type==1 && modal.data.parentName!=null" label="父级名称">
                    <Input disabled :value="modal.data.parentName"></Input>
                </FormItem>
                <FormItem label="名称">
                    <Input v-model.trim="modal.data.name"></Input>
                </FormItem>
                <FormItem label="类型">
                    <Select v-model.trim="modal.data.type" style="width:100%">
                        <Option v-for="item in [{label:'菜单',value:0},{label:'按钮',value:1}]"
                         :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="资源链接">
                    <Input v-model.trim="modal.data.url"></Input>
                </FormItem>
                <FormItem label="权限标识">
                    <Input v-model.trim="modal.data.permission"></Input>
                </FormItem>
                <FormItem label="验证与否">
                    <Select v-model="modal.data.verification" style="width:100%">
                        <Option v-for="verOption in [{label:'是',value:'true'},{label:'否',value:'false'}]"
                         :value="verOption.value" :key="verOption.value">{{ verOption.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="颜色标示">
                     <color-picker v-model="modal.data.color" recommend></color-picker>
                </FormItem>
                <FormItem label="图标">
                    <Input v-model.trim="modal.data.icon"></Input>
                </FormItem>
                <FormItem label="排序">
                    <InputNumber  :min="0" :step="1" v-model.trim="modal.data.sort" style="width:100%"/>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="removeModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>提示</span>
            </p>
            <div style="text-align:center">
                <p>此操作为不可逆操作，是否确认删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long @click="remove">确认删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>

    export default {
        data () {
            return {
                removeModal:false,
                setting:{
                    loading:true,
                    showBorder:true
                },
                props: {
                    stripe: true,
                    border: true,
                    showHeader: true,
                    showSummary: false,
                    showRowHover: true,
                    showIndex: false,
                    treeType: true,
                    isFold: false,
                    expandType: false,
                    selectionType: false,
                },
                datas: [],
                columns: [
                    {
                        label: '资源名称',
                        prop: 'name',
                        width: '400px',
                    },
                    {
                        label: '类型',
                        prop: 'type',
                        type: 'template',
                        template: 'type',
                    },
                    {
                        label: '资源链接',
                        prop: 'url',
                    },
                    {
                        label: '权限标识',
                        prop: 'permission',
                    },
                    {
                        label: '验证与否',
                        prop: 'verification',
                        type: 'template',
                        template: 'verification',
                        width:'85px'
                    },
                    {
                        label: '颜色',
                        prop: 'color',
                        type: 'template',
                        template: 'color',
                        width:'60px'
                    },
                    {
                        label: '图标',
                        prop: 'icon',
                        type: 'template',
                        template: 'icon',
                        width:'80px'
                    },
                    {
                        label: '排序',
                        prop: 'sort',
                        width:'100px'
                    },
                    {
                        label: '操作',
                        type: 'template',
                        prop: 'action',
                        template: 'action',
                    }
                ],
                modal:{
                    show:false,
                    type:1,
                    data:{
                        id:0,
                        name:'',
                        type:1, //0-菜单 1-按钮
                        url:'',
                        permission:'',
                        icon:'',
                        sort:0,
                        color:'#19BE6B',
                        verification:'true'
                    }
                },
                removeObject:null
            }
        },
        created(){
            this.getData();
        },
        methods:{
            async getData(){
                this.setting.loading = true;
           
                    this.datas =[{"id":"987977834901315586","name":"首页","parentId":null,"type":0,"url":"/home","permission":"home","color":"#19BE6B","icon":"ios-home-outline","sort":-1,"verification":true,"createDate":1524387246000,"children":[{"id":"1001315563194589185","name":"首页","parentId":"987977834901315586","type":0,"url":"/home/index","permission":"home_index","color":"#19BE6B","icon":"","sort":0,"verification":false,"createDate":1527567208000,"children":[]}]},{"id":"987981277195968513","name":"系统设置","parentId":null,"type":0,"url":"/system","permission":"system","color":"#19BE6B","icon":"ios-gear","sort":0,"verification":true,"createDate":1524388066000,"children":[{"id":"987981486382686210","name":"用户管理","parentId":"987981277195968513","type":0,"url":"/system/user","permission":"system:user","color":"#19BE6B","icon":"person","sort":0,"verification":true,"createDate":1524388116000,"children":[{"id":"987986018126831617","name":"用户添加","parentId":"987981486382686210","type":1,"url":"/system/user/add","permission":"system:user:add","color":"#19BE6B","icon":"","sort":0,"verification":true,"createDate":1524389197000,"children":[]},{"id":"987986318946508801","name":"用户更新","parentId":"987981486382686210","type":1,"url":"/system/user/update","permission":"system:user:update","color":"#19BE6B","icon":"","sort":0,"verification":true,"createDate":1524389268000,"children":[]},{"id":"987986542024761345","name":"用户删除","parentId":"987981486382686210","type":1,"url":"/system/user/remove","permission":"system:user:remove","color":"#ED3F14","icon":"","sort":0,"verification":true,"createDate":1524389322000,"children":[]},{"id":"989417091599802370","name":"用户列表","parentId":"987981486382686210","type":1,"url":"/system/user/list","permission":"system:user:list","color":"#19BE6B","icon":"","sort":0,"verification":true,"createDate":1524730392000,"children":[]},{"id":"989417919966453762","name":"密码重置","parentId":"987981486382686210","type":1,"url":"/system/user/resetPassword","permission":"system:user:resetPassword","color":"#19BE6B","icon":"","sort":0,"verification":true,"createDate":1524730589000,"children":[]},{"id":"989418114355666946","name":"锁定用户","parentId":"987981486382686210","type":1,"url":"/system/user/lock","permission":"system:user:lock","color":"#FF9900","icon":"","sort":0,"verification":true,"createDate":1524730636000,"children":[]},{"id":"989418202087923713","name":"解锁用户","parentId":"987981486382686210","type":1,"url":"/system/user/unlock","permission":"system:user:unlock","color":"#FF9900","icon":"","sort":0,"verification":true,"createDate":1524730657000,"children":[]}]},{"id":"987981659066376194","name":"角色管理","parentId":"987981277195968513","type":0,"url":"/system/role","permission":"system:role","color":"#19BE6B","icon":"compose","sort":0,"verification":true,"createDate":1524388157000,"children":[{"id":"987974185122832386","name":"角色添加","parentId":"987981659066376194","type":1,"url":"/system/role/add","permission":"system:role:add","color":"#19BE6B","icon":"","sort":0,"verification":true,"createDate":1524386376000,"children":[]},{"id":"987980763175624706","name":"角色更新","parentId":"987981659066376194","type":1,"url":"/system/role/update","permission":"system:role:update","color":"#19BE6B","icon":"","sort":0,"verification":true,"createDate":1524387944000,"children":[]},{"id":"987985944781037570","name":"角色删除","parentId":"987981659066376194","type":1,"url":"/system/role/remove","permission":"system:role:remove","color":"#ED3F14","icon":"","sort":0,"verification":true,"createDate":1524389179000,"children":[]},{"id":"988602498871316482","name":"角色列表","parentId":"987981659066376194","type":1,"url":"/system/role/list","permission":"system:role:list","color":"#19BE6B","icon":"","sort":0,"verification":true,"createDate":1524536177000,"children":[]}]},{"id":"987982017863917570","name":"资源管理","parentId":"987981277195968513","type":0,"url":"/system/resource","permission":"system:resource","color":"#19BE6B","icon":"lock-combination","sort":0,"verification":true,"createDate":1524388243000,"children":[{"id":"987985589477351426","name":"资源添加","parentId":"987982017863917570","type":1,"url":"/system/resource/add","permission":"system:resource:add","color":"#19BE6B","icon":"","sort":0,"verification":true,"createDate":1524389095000,"children":[]},{"id":"987985700785790978","name":"资源更新","parentId":"987982017863917570","type":1,"url":"/system/resource/update","permission":"system:resource:update","color":"#19BE6B","icon":"","sort":0,"verification":true,"createDate":1524389121000,"children":[]},{"id":"987985782880903170","name":"资源删除","parentId":"987982017863917570","type":1,"url":"/system/resource/remove","permission":"system:resource:remove","color":"#EA1A1A","icon":"","sort":0,"verification":true,"createDate":1524389141000,"children":[]},{"id":"988254531404496898","name":"资源列表","parentId":"987982017863917570","type":1,"url":"/system/resource/list","permission":"system:resource:list","color":"#19BE6B","icon":"","sort":0,"verification":true,"createDate":1524453215000,"children":[]}]},{"id":"990058578210021378","name":"系统日志","parentId":"987981277195968513","type":0,"url":"/system/log","permission":"system:log","color":"#19BE6B","icon":"leaf","sort":0,"verification":true,"createDate":1524883334000,"children":[{"id":"990058692110540801","name":"日志查看","parentId":"990058578210021378","type":1,"url":"/system/log/list","permission":"system:log:list","color":"#19BE6B","icon":"","sort":0,"verification":true,"createDate":1524883361000,"children":[]},{"id":"990058791586848769","name":"日志删除","parentId":"990058578210021378","type":1,"url":"/system/log/remove","permission":"system:log:remove","color":"#ED3F14","icon":"","sort":0,"verification":true,"createDate":1524883384000,"children":[]}]}]}];
              
                this.setting.loading = false;
            },
            async addOK(){
                this.$Message.loading({
                    content:"资源添加中...",
                    duration:0
                })
                try {
                    await post('/system/resource/add',this.modal.data)
                    this.getData(false)
                    this.$Message.destroy()
                    this.$Message.success({
                        content:"资源添加成功",
                        duration: 1.5
                    });
                } catch (error) {
                    this.$throw(error)
                }
            },
            async editOk(){
                this.$Message.loading({
                    content:"资源更新中...",
                    duration:0
                })
                try {
                    await post('/system/resource/update/{id}',this.modal.data,{
                        id:this.modal.data.id
                    })
                    this.getData(false)
                    this.$Message.destroy()
                    this.$Message.success({
                        content:"资源更新成功",
                        duration: 1.5
                    });
                } catch (error) {
                    this.$throw(error)
                }
            },
            removeModalOpen(id){
                this.removeModal = true;
                this.removeObject = id;
            },
            async remove(){
                this.setting.loading = true;
                this.$Message.loading({
                    content:"资源删除中...",
                    duration:0
                })
                try {
                    await post('/system/resource/remove/{id}',null,{
                        id:this.removeObject
                    })
                    this.getData(false)
                    this.$Message.destroy()
                    this.$Message.success({
                        content:"资源删除成功",
                        duration: 1.5
                    });
                } catch (error) {
                    this.$throw(error)
                }
                this.setting.loading = false;
                this.removeModal = false;
            },
            modalOk(){
                if(this.modal.type==1){
                    this.addOK();
                }else{
                    this.editOk();
                }
            },
            edit(row){
                this.modal.type = 2;
                this.modal.data = {
                    id:row.id,
                    name:row.name,
                    type:row.type, //1-菜单 2-按钮
                    url:row.url,
                    permission:row.permission,
                    icon:row.icon,
                    sort:row.sort,
                    color:row.color=='' ? '#19BE6B' : row.color,
                    verification:row.verification==null ? 'true' : row.verification==true?'true':'false',
                }
                this.modal.show = true;
            },
            openAddModal(parent=null){
                this.modal.type = 1;
                this.modal.data = {
                    id:0,
                    parentId:parent==null ? null : parent.id,
                    name:'',
                    type:0, //1-菜单 2-按钮
                    url:parent==null ? null : parent.url,
                    permission:parent==null ? null : parent.permission,
                    icon:'',
                    sort:0,
                    parentName:parent==null ? null : parent.name,
                    verification:parent==null ? 'true' : parent.verification==true?'true':'false',
                    color:'#19BE6B'
                }
                console.log(this.modal.data)
                this.modal.show = true;
            }
        }
    }
</script>