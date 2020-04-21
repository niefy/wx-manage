<template>
    <el-dialog title="模板配置" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px" size="mini">
            <el-form-item label="标题" prop="title">
                <el-input v-model="dataForm.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item label="链接" prop="url">
                <el-input v-model="dataForm.url" placeholder="跳转链接"></el-input>
            </el-form-item>
            <div>
                <el-form-item label="小程序appid" prop="miniprogram.appid">
                    <el-input v-model="dataForm.miniprogram.appid" placeholder="小程序appid"></el-input>
                </el-form-item>
                <el-form-item label="小程序路径" prop="miniprogram.pagePath">
                    <el-input v-model="dataForm.miniprogram.pagePath" placeholder="小程序pagePath"></el-input>
                </el-form-item>
            </div>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="模版名称" prop="name">
                        <el-input v-model="dataForm.name" placeholder="模版名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="有效" prop="status">
                        <el-switch v-model="dataForm.status" placeholder="是否有效" :active-value="true" :inactive-value="false"></el-switch>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="form-group-area">
                <el-form-item  class="form-group-title">消息填充数据，请对照模板内容填写</el-form-item>
                <el-form-item>
                    <el-input type="textarea" disabled autosize v-model="dataForm.content" placeholder="模版"></el-input>
                </el-form-item>
                <el-row v-for="(item,index) in dataForm.data" :key="item.name">
                    <el-col :span="16">
                        <el-form-item :label="item.name" :prop="'data.'+index+'.value'" :rules="[{required: true,message: '填充内容不得为空', trigger: 'blur' }]">
                            <el-input type="textarea" autosize rows="1" v-model="item.value" placeholder="填充内容"  ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="颜色" >
                            <el-input type="color" v-model="item.color" placeholder="颜色"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            dataForm: {
                id: 0,
                templateId: '',
                title: '',
                data: [],
                url: '',
                miniprogram:{appid:'',pagePath:''},
                content: '',
                status: true,
                name: ''
            },
            dataRule: {
                title: [
                    { required: true, message: '标题不能为空', trigger: 'blur' }
                ],
                data: [
                    { required: true, message: '内容不能为空', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '模版名称不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        init(id) {
            console.log('init',id)
            this.dataForm.id = id || 0
            this.visible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields()
                if (this.dataForm.id) {
                    this.$http({
                        url: this.$http.adornUrl(`/manage/msgTemplate/info/${this.dataForm.id}`),
                        method: 'get',
                        params: this.$http.adornParams()
                    }).then(({ data }) => {
                        if (data && data.code === 200) {
                            this.transformTemplate(data.msgTemplate)
                        }else{
                            this.$message.error(data.msg)
                        }
                    })
                }
            })
        },
        /**
         * 根据content信息展开data配置项(content为微信公众平台后台配置的模板)
         * 如content='{{first.DATA}} ↵商品名称：{{keyword1.DATA}} ↵购买时间：{{keyword2.DATA}} ↵{{remark.DATA}}'
         * 则生成data=[{name:'first',value:'',color:''},{name:'first',value:'',color:''},{name:'first',value:'',color:''}]
         * 展示表单让管理员给对应的字段填充内容
         */
        transformTemplate(template){
            if(!template.miniprogram)template.miniprogram={appid:'',pagePath:''}
            if(template.data instanceof Array) {//已经配置过了，直接读取
                this.dataForm =  template
                return
            }
            
            template.data=[]
            let keysArray = template.content.match(/\{\{(\w*)\.DATA\}\}/g) || [] //示例： ["{{first.DATA}}", "{{keyword1.DATA}}", "{{keyword2.DATA}}", "{{remark.DATA}}"]
            keysArray.map(item=>{
                name=item.replace('{{','').replace('.DATA}}','')
                template.data.push({"name":name,"value":"",color:"#000000"})
            })
            this.dataForm = template
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/manage/msgTemplate/${!this.dataForm.id ? 'save' : 'update'}`),
                        method: 'post',
                        data: this.$http.adornData(this.dataForm)
                    }).then(({ data }) => {
                        if (data && data.code === 200) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.visible = false
                                    this.$emit('refreshDataList')
                                }
                            })
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }
            })
        }
    }
}
</script>
<style scoped>
.form-group-area{
    border:1px dotted gray;
}
.form-group-title{
    color: gray;
    font-size: 12px;
}
</style>