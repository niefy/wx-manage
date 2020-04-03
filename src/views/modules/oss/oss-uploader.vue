<template>
    <div @click="selectFile">
        <input type="file" ref="fileInput" v-show="false" @change="onFileChange" />
        <div>{{uploading?infoText:'上传文件'}}</div>
    </div>
</template>

<script>
export default {
    name: "oss-uploader",
    data() {
        return {
            uploading: false,
            infoText: "上传中...",
            cosConfig: []
        }
    },
    mounted() {
        this.$http({
            url: this.$http.adornUrl('/sys/oss/config'),
            method: 'get',
            params: this.$http.adornParams()
        }).then(({ data }) => {
            if (data && data.code === 200 && data.config.type) {
                this.cosConfig = data.config
            } else {
                this.$message.error('请先配置云存储相关信息！')
            }

        })
    },
    methods: {
        selectFile() {//选择文件
            if (!this.uploading) {
                this.$refs.fileInput.click();
            }
        },
        onFileChange() {
            let file = this.$refs.fileInput.files[0];
            this.uploading = true;
            let formData = new FormData();
            formData.append("file", file)
            this.$http({
                url: this.$http.adornUrl('/sys/oss/upload'),
                method: 'post',
                data: formData
            }).then(({ data }) => {
                console.log(data)
                if (data && data.code === 200) {
                    this.$emit('uploaded', data.url)
                } else {
                    this.$message.error("文件上传失败：" + data.msg)
                }
                this.uploading = false;
            })
        }
    }
}
</script>
