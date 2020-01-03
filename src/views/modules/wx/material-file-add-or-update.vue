<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-row>
        <el-col :span="12">
            <el-form-item label="媒体文件">
            <el-button type="primary">
              选择文件
              <input type="file" style="opacity: 0;height: 100%;position: absolute;left: 0;top: 0;"  @change="onFileChange"/>
            </el-button>
            <div>{{dataForm.file.name}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="媒体类型" prop="mediaType">
                <el-select v-model="dataForm.mediaType" placeholder="媒体类型" style="width:100%">
                    <el-option label="图片" value="image"></el-option>
                    <el-option label="视频" value="video"></el-option>
                    <el-option label="语音" value="voice"></el-option>
                    <el-option label="缩略图（64K以内JPG）" value="thumb"></el-option>
                </el-select>
            </el-form-item>
        </el-col>
      </el-row>
    <el-form-item label="素材名称" prop="fileName">
      <el-input v-model="dataForm.fileName" placeholder="素材名称"></el-input>
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
          mediaId: '',
          file:'',
          fileName: '',
          mediaType: 'image'
        },
        dataRule: {
          fileName: [
            { required: true, message: '素材名称不能为空', trigger: 'blur' }
          ],
          mediaType: [
            { required: true, message: '素材类型不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.mediaId = id || ""
        this.visible = true
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            console.log(this.dataForm)
            let form = new FormData();
            form.append('mediaId',this.dataForm.mediaId || '')
            form.append('file', this.dataForm.file)
            form.append('fileName', this.dataForm.fileName)
            form.append('mediaType', this.dataForm.mediaType)
            this.$http({
              url: this.$http.adornUrl(`/manage/wxAssets/materialFileUpload`),
              method: 'post',
              data: form,
              headers: {'Content-Type':'multipart/form-data'}
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
      },
      onFileChange(e){
        let file = event.currentTarget.files[0]
        this.dataForm.file = file;
        this.dataForm.fileName=file.name.substring(0,file.name.lastIndexOf('.'))
        let mediaType=file.type.substring(0,file.type.lastIndexOf('/'))
        if(mediaType=='audio')mediaType='voice'
        this.dataForm.mediaType=mediaType
      }
    }
  }
</script>
