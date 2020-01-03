<template>
  <div >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"  label-width="120px">
        <el-form-item label="标题" prop="title">
        <el-input v-model="dataForm.title" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="url">
        <el-input v-model="dataForm.url" placeholder="链接"></el-input>
        </el-form-item>
        <el-form-item label="阅读原文链接" prop="contentSourceUrl">
        <el-input v-model="dataForm.contentSourceUrl" placeholder="阅读原文链接"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="digest">
        <el-input v-model="dataForm.digest" placeholder="描述"></el-input>
        </el-form-item>
        <el-form-item label="media_id" prop="thumbMediaId">
        <el-input v-model="dataForm.thumbMediaId" placeholder="封面图media_id"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
            <tinymce-editor ref="editor" v-model="dataForm.content"> </tinymce-editor>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeCurrentTab">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </div>
</template>

<script>
  export default {
    components:{
        TinymceEditor:()=>import('@/components/tinymce-editor')
    },
    data () {
      return {
        dataForm: {
          templateId: 0,
          title: '',
          content: '',
          showCoverPic:true,
          url: '',
          contentSourceUrl: '',
          digest: '',
          thumbMediaId: ''
        },
        dataRule: {
          title: [
            { required: true, message: '标题不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '内容不能为空', trigger: 'blur' }
          ],
          thumbMediaId: [
            { required: true, message: '封面图media_id不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.mediaId = id || ""
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/manage/wxAssets/materialNewsUpload`),
              method: 'post',
              data: this.$http.adornData({
                'title': this.dataForm.title,
                'content': this.dataForm.content,
                'url': this.dataForm.url,
                'contentSourceUrl': this.dataForm.contentSourceUrl,
                'digest': this.dataForm.digest,
                'thumbMediaId': this.dataForm.thumbMediaId
              })
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.$emit('refreshDataList')
                    this.closeCurrentTab();
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      closeCurrentTab() {
            this.$store.commit("common/closeCurrentTab");
        }
    }
  }
</script>
