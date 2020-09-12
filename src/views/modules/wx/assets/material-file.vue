<template>
    <div class="mod-menu">
        <el-form :inline="true" :model="dataForm">
            <el-form-item v-show="!selectMode">
                <el-button size="mini" v-if="isAuth('wx:wxassets:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
        </el-form>
        <div v-loading="dataListLoading">
            <div class="card" v-for="item in dataList" :key="item.mediaId" @click="onSelect(item)">
                <el-image v-if="fileType=='image'" class="card-image" :src="item.url" fit="contain" lazy></el-image>
                <div v-else class="card-preview">
                    <div v-if="fileType=='voice'" class="card-preview-icon el-icon-microphone"></div>
                    <div v-if="fileType=='video'" class="card-preview-icon el-icon-video-camera-solid"></div>
                    <div class="card-preview-text">管理后台不支持预览<br/>微信中可正常播放</div>
                </div>
                <div class="card-footer">
                    <div class="text-cut-name">{{item.name}}</div>
                    <div>{{$moment(item.updateTime).calendar()}}</div>
                    <div class="flex justify-between align-center" v-show="!selectMode">
                        <el-button size="mini" type="text" icon="el-icon-copy-document"  v-clipboard:copy="item.mediaId" v-clipboard:success="onCopySuccess" v-clipboard:error="onCopyError">复制media_id</el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete"  @click="deleteHandle(item.mediaId)" >删除</el-button>
                    </div>
                </div>
            </div>
        </div>
        <el-pagination @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[20]" :page-size="20" :total="totalCount" layout="total, prev,pager, next, jumper">
        </el-pagination>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="onChange"></add-or-update>
    </div>
</template>
<script>
import AddOrUpdate from './material-file-add-or-update'
export default {
    name:'material-file',
    props:{
        fileType:{// image、voice、video
            type:String,
            default:'image'
        },
        selectMode:{// 是否选择模式，选择模式下点击素材选中，不可新增和删除
            type:Boolean,
            default:false
        }
    },
    components: {
        AddOrUpdate
    },
    data() {
        return {
            dataForm: {},
            addOrUpdateVisible: false,
            dataList: [],
            pageIndex: 1,
            pageSize: 20,
            totalCount: 0,
            dataListLoading: false,
        }
    },
    mounted(){
        this.init()
    },
    methods: {
        init(){
            if(!this.dataList.length){
                this.getDataList()
            }
        },
        getDataList() {
            if(this.dataListLoading) return
            this.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl('/manage/wxAssets/materialFileBatchGet'),
                params: this.$http.adornParams({
                    'page': this.pageIndex,
                    'type': this.fileType
                })
            }).then(({ data }) => {
                if (data && data.code == 200) {
                    this.dataList = data.data.items
                    this.totalCount = data.data.totalCount
                     this.pageIndex++;
                } else {
                    this.$message.error(data.msg);
                }
                this.dataListLoading = false
            })
        },
        // 新增 / 修改
        addOrUpdateHandle() {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(this.fileType)
            })
        },
        onSelect(itemInfo){
            if(!this.selectMode)return
            this.$emit('selected',itemInfo)
        },
        //删除
        deleteHandle(id) {
            this.$confirm(`确定对[mediaId=${id}]进行删除操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/manage/wxAssets/materialDelete'),
                    method: 'post',
                    data: { mediaId: id }
                }).then(({ data }) => {
                    if (data && data.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            duration: 1500,
                            onClose: () =>  this.onChange()
                        })
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            })
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageIndex = val
            this.getDataList()
        },
        onCopySuccess(){
            this.$message.success('已复制')
        },
        onCopyError(err){
            this.$message.error('复制失败,可能是此浏览器不支持复制')
        },
        onChange(){
            this.pageIndex=1
            this.getDataList()
            this.$emit('change')
        }

    }
}
</script>
<style scoped>
.card{
    width: 170px;
    display: inline-block;
    background: #FFFFFF;
    border: 1px solid #EBEEF5;
    box-shadow: 1px 1px 20px 0 rgba(0, 0, 0, 0.1);
    margin: 0 10px 10px 0;
    vertical-align: top;
    border-radius: 5px;
    box-sizing: border-box;
}
.card:hover{
    border: 2px solid #66b1ff;
    margin-bottom: 6px;
}
.card-image{
    line-height: 170px;
    max-height: 170px;
    width: 100%;
}
.card-preview{
    padding: 20px 0;
    color: #d9d9d9;
    display: flex;
    justify-content: center;
    align-items: center;
}
.card-preview-icon{
    font-size: 30px;
    margin-right: 5px;
}
.card-preview-text{
    font-size: 12px;
}
.card-footer{
    color: #ccc;
    font-size: 12px;
    padding: 15px 10px;
}
</style>