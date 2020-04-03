<template>
    <div @click="selectFile">
        <input type="file" ref="fileInput" v-show="false" @change="onFileChange" />
        <div>{{uploading?infoText:'上传文件'}}</div>
    </div>
</template>

<script>
	// 腾讯云对象存储组件，文件直接上传到腾讯云，可在后端服务无对应外网权限时使用
	// 使用本组件需引入腾讯云对象存储依赖 <script src="https://unpkg.com/cos-js-sdk-v5@0.5.23/dist/cos-js-sdk-v5.min.js" async></script>
	var cos;
	export default {
		name: "oss-uploader",
		data() {
			return {
				uploading: false,
				infoText:"上传中...",
				cosConfig:[]
			}
		},
		mounted(){
			this.$http({
				url: this.$http.adornUrl('/sys/oss/config'),
				method: 'get',
				params: this.$http.adornParams()
			}).then(({data}) => {
				if(data && data.code === 200){
					this.cosConfig =  data.config
					cos=new COS({
						SecretId: data.config.qcloudSecretId,
						SecretKey: data.config.qcloudSecretKey,
					});
				}else{
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
				let now = new Date();
				let path=now.toISOString().slice(0,10)+'/'+now.getTime()+file.name.substr(file.name.lastIndexOf('.'))
				cos.putObject({
					Bucket: this.cosConfig.qcloudBucketName, /* 必须 */
					Region: this.cosConfig.qcloudRegion,    /* 必须 */
					Key: path,              /* 必须 */
					Body: file, // 上传文件对象
					onProgress: (progressData)=> {
						this.infoText='上传中：'+progressData.percent*100+'%'
					}
				}, (err, data)=> {
					console.log(err || data);
					this.uploading = false;
					if(data){
						this.infoText='上传文件'
						let fileUrl='https://'+this.cosConfig.qcloudBucketName+'.cos.'+this.cosConfig.qcloudRegion+'.myqcloud.com/'+path;
						this.saveUploadResult(fileUrl)
					}else {
						this.$message.error('文件上传失败',err)
					}

				});
			},
			saveUploadResult(url){
				this.$http({
					url: this.$http.adornUrl('/sys/oss/upload'),
					method: 'post',
					data:{
						url:url
					}
				}).then(({data})=>{
					this.$emit('uploaded', url)
				})
			}
		}
	}
</script>

<style scoped>
</style>
