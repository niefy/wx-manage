<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"  label-width="80px">
    <el-form-item label="标题" prop="title">
      <el-input v-model="dataForm.title" placeholder="标题"></el-input>
    </el-form-item>
    <el-form-item label="内容" prop="data">
      <el-input v-model="dataForm.data" placeholder="内容"></el-input>
    </el-form-item>
    <el-form-item label="链接" prop="url">
      <el-input v-model="dataForm.url" placeholder="链接"></el-input>
    </el-form-item>
    <el-form-item label="颜色" prop="color">
      <el-input v-model="dataForm.color" placeholder="颜色"></el-input>
    </el-form-item>
    <el-form-item label="是否有效" prop="status">
      <el-input v-model="dataForm.status" placeholder="是否有效"></el-input>
    </el-form-item>
    <el-form-item label="模版名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="模版名称"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          templateId: 0,
          title: '',
          data: '',
          url: '',
          color: '',
          status: '',
          name: ''
        },
        dataRule: {
          title: [
            { required: true, message: '标题不能为空', trigger: 'blur' }
          ],
          data: [
            { required: true, message: '内容不能为空', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '链接不能为空', trigger: 'blur' }
          ],
          color: [
            { required: true, message: '颜色不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '是否有效不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '模版名称不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.templateId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.templateId) {
            this.$http({
              url: this.$http.adornUrl(`/manage/msgtemplate/info/${this.dataForm.templateId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.title = data.msgTemplate.title
                this.dataForm.data = data.msgTemplate.data
                this.dataForm.url = data.msgTemplate.url
                this.dataForm.color = data.msgTemplate.color
                this.dataForm.status = data.msgTemplate.status
                this.dataForm.name = data.msgTemplate.name
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/manage/msgtemplate/${!this.dataForm.templateId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'templateId': this.dataForm.templateId || undefined,
                'title': this.dataForm.title,
                'data': this.dataForm.data,
                'url': this.dataForm.url,
                'color': this.dataForm.color,
                'status': this.dataForm.status,
                'name': this.dataForm.name
              })
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
