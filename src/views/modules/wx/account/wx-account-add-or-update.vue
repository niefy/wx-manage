<template>
  <el-dialog
    title="新增/修改"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
    <el-form-item label="公众号名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="公众号名称"></el-input>
    </el-form-item>
    <div class="padding text-gray">测试号可选择服务号，不同类型账号、是否认证可使用功能权限不同，<a href="https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Explanation_of_interface_privileges.html">参考文档</a></div>
    <el-row>
        <el-col :span="12">
            <el-form-item label="公众号类型" prop="type">
                <el-select v-model="dataForm.type" placeholder="公众号类型">
                    <el-option v-for="(name,key) in ACCOUNT_TYPES" :key="name" :label="name" :value="key"></el-option>
                </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="是否认证" prop="verified">
                <el-switch v-model="dataForm.verified" placeholder="是否认证"></el-switch>
            </el-form-item>
        </el-col>
    </el-row>
    
    <el-form-item label="appid" prop="appid">
      <el-input v-model="dataForm.appid" placeholder="appid"></el-input>
    </el-form-item>
    <el-form-item label="appsecret" prop="secret">
      <el-input v-model="dataForm.secret" placeholder="appsecret"></el-input>
    </el-form-item>
    <el-form-item label="token" prop="token">
      <el-input v-model="dataForm.token" placeholder="token"></el-input>
    </el-form-item>
    <el-form-item label="aesKey" prop="aesKey">
      <el-input v-model="dataForm.aesKey" placeholder="aesKey，可为空"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {  
          appid: '',
          name: '',
          type:'2',
          verified:true,
          secret: '',
          token: 'my_weixin_token_',
          aesKey: ''
        },
        dataRule: {
          name: [
            { required: true, message: '公众号名称不能为空', trigger: 'blur' }
          ],
          appid: [
            { required: true, message: 'appid不能为空', trigger: 'blur' }
          ],
          secret: [
            { required: true, message: 'appsecret不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    computed: mapState({
        ACCOUNT_TYPES: state=>state.wxAccount.ACCOUNT_TYPES
    }),
    methods: {
      init (item) {
        this.visible = true
        if(item && item.appid){
            this.dataForm = item
            this.dataForm.type = item.type+''
        }else{
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields()
            })
        }
        
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/manage/wxAccount/save`),
              method: 'post',
           data: this.$http.adornData(this.dataForm)
            }).then(({data}) => {
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
