<template>
    <div class="tinymce-editor">
        <editor v-model="myValue" :init="init" @onExecCommand="onExecCommand"></editor>
    </div>
</template>
<script>
import Editor from "@tinymce/tinymce-vue";

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
                object_resizing: false,
                paste_data_images: true,
                content_css: "./tinymce/article.css",
                images_upload_handler: (blobInfo, success, failure) => {
                    this.uploadFile(blobInfo.blob()).then(fileUrl => success(fileUrl)).catch(err => failure(err))
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
            return new Promise((resolve, reject) => {
                let formData = new FormData();
                formData.append("file", file);
                this.$http({
                    url: this.$http.adornUrl('/sys/oss/upload'),
                    method: 'post',
                    data: formData
                }).then(({ data }) => {
                    console.log(data)
                    if (data && data.code === 200) {
                        this.$emit('uploaded', data.url)
                        resolve(data.url)
                    } else {
                        this.$message.error("文件上传失败：" + data.msg)
                        reject(data.msg)
                    }
                    this.uploading = false;
                }).catch(err=>reject(err))
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