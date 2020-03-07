<template>
  <div class="tinymce-editor">
    <editor v-model="myValue" :init="init" @onExecCommand="onExecCommand"></editor>
  </div>
</template>
<script>
// import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
// import "tinymce/themes/silver";

// var COS = require("cos-js-sdk-v5"); //腾讯云对象存储
var cos;
export default {
  name: "tinymce-editor",
  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      init: {
        language_url: "./tinymce/zh_CN.js", //public目录下
        language: "zh_CN",
        height: 500,
        plugins: "lists image media table paste link searchreplace anchor code preview pagebreak importcss", 
        toolbar: "undo redo searchreplace |  formatselect pagebreak | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists link anchor image media table | removeformat code preview", //工具栏展示项
        toolbar_drawer: false,
        image_advtab: true,
        object_resizing : false,
        paste_data_images: true,
        content_css: "./tinymce/article.css",
        images_upload_handler: (blobInfo, success, failure) => {
          this.uploadFile(blobInfo.blob()).then(fileUrl=>success(fileUrl)).catch(err=>failure(err))
        }
      },
      myValue: this.value,
      uploading: false,
      cosConfig: []
    };
  },
  mounted() {
    // console.log('tinymce-editor mounted:',this.value)
    tinymce.init({});
    this.cosInit();
  },
  methods: {
    cosInit() {
      this.$http({
        url: this.$http.adornUrl("/sys/oss/config"),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.cosConfig = data.config;
          cos = new COS({
            SecretId: data.config.qcloudSecretId,
            SecretKey: data.config.qcloudSecretKey
          });
        } else {
          this.$message.error("请先配置云存储相关信息！");
        }
      });
    },
    onExecCommand(e) {
      //console.log(e)
    },
    uploadFile(file) {
      this.uploading = true;
      let now = new Date();
      let path = now.toISOString().slice(0, 10) + "/" + now.getTime() + file.name.substr(file.name.lastIndexOf("."));
      return new Promise((resolve, reject) => {
        cos.putObject({
            Bucket: this.cosConfig.qcloudBucketName /* 必须 */,
            Region: this.cosConfig.qcloudRegion /* 必须 */,
            Key: path /* 必须 */,
            Body: file // 上传文件对象
          },(err, data) => {
            console.log(err || data);
            this.uploading = false;
            if (data) {
              let fileUrl ="https://" +this.cosConfig.qcloudBucketName +".cos." +this.cosConfig.qcloudRegion +".myqcloud.com/" +path;
              resolve(fileUrl);
              this.saveUploadResult(fileUrl);
            } else {
              this.$message.error("文件上传失败", err);
              reject(err);
            }
          });
      });
    },
    saveUploadResult(url) {
      this.$http({
        url: this.$http.adornUrl("/sys/oss/upload"),
        method: "post",
        data: {
          url: url
        }
      }).then(({ data }) => {
        this.$emit("uploaded", url);
      });
    }
  },
  watch: {
    value(newValue) {
      this.myValue = newValue;
    },
    myValue(newValue) {
      this.$emit("input", newValue);
    }
  }
};
</script>