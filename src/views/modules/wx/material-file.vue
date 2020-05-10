<template>
    <div class="mod-menu">
        <el-form :inline="true" :model="dataForm">
            <el-form-item>
                <el-button size="mini" v-if="isAuth('wx:wxassets:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
        </el-form>
        <div v-loading="dataListLoading">
            <div class="card" v-for="item in dataList" :key="item.mediaId">
                <el-image v-if="fileType=='image'" class="card-image" :src="item.url" fit="contain" lazy></el-image>
                <div v-else class="card-preview">
                    <div v-if="fileType=='voice'" class="card-preview-icon el-icon-microphone"></div>
                    <div v-if="fileType=='video'" class="card-preview-icon el-icon-video-camera-solid"></div>
                    <div class="card-preview-text">管理后台不支持预览<br/>发送到微信后可正常播放</div>
                </div>
                <div class="card-footer">
                    <div class="text-cut-name">{{item.name}}</div>
                    <div class="text-right">{{item.updateTime}}</div>
                </div>
                <div class="card-operation">
                    <el-button size="small" type="success" icon="el-icon-check" round v-if="selectMode" @click="$emit('selected',item)">选中</el-button>
                    <div v-else>
                        <el-button size="mini" type="success" icon="el-icon-copy-document" round  v-clipboard:copy="item.mediaId" v-clipboard:success="onCopySuccess" v-clipboard:error="onCopyError">复制media_id</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" round  @click="deleteHandle(item.mediaId)" >删除</el-button>
                    </div>
                </div>
                
            </div>
        </div>
        <el-pagination @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[20]" :page-size="pageSize" :total="totalCount" layout="total, prev,pager, next, jumper">
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
    methods: {
        init(){
            if(!this.dataList.length){
                this.materialFileBatchGet()
            }
        },
        materialFileBatchGet() {
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
                            onClose: () => {
                                this.materialFileBatchGet()
                                this.$emit('change')
                            }
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
            this.materialFileBatchGet()
            this.$emit('change')
        }

    }
}
</script>
<style scoped>
.card{
    width: 240px;
    min-height: 120px;
    display: inline-block;
    position: relative;
    border: 1px solid #eee;
    margin: 0 10px 10px 0;
    vertical-align: top;
}
.card-image{
    line-height: 200px;
    max-width: 100%;
    max-height: 200px;
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
    height: 55px;
    /* margin-top: -55px; */
    font-size: 12px;
    background: rgba(0, 0, 0,0.3);
    color: #ffffff;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 5px 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.text-cut-name{
    display: -webkit-box;
    word-wrap:break-word;
    word-break:break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
.card-operation{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.card-operation:hover{
    background: rgba(64, 158, 255,0.7);
    opacity: 1;
}
</style>