<template>
    <div class="mod-menu">
        <el-form v-if="!selectMode" :inline="true" :model="dataForm">
            <el-form-item>
                <el-button size="mini" v-if="isAuth('wx:wxassets:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
        </el-form>
        <div v-loading="dataListLoading">
            <div class="card" v-for="item in dataList" :key="item.mediaId" >
                <div class="card-preview">
                    <a v-for="(article,index) in item.content.articles" :key="index" :underline="false" :href="article.url" class="article-item">
                        <div class="article-title">{{article.title}}</div>
                        <el-image class="article-thumb" :src="article.thumbUrl"></el-image>
                    </a>
                </div>
                <div class="card-footer" v-if="!selectMode">
                    <div class="text-right">{{item.updateTime}}</div>
                    <div class="flex justify-between align-center">
                        <el-button size="mini" type="text" icon="el-icon-copy-document"  v-clipboard:copy="item.mediaId" v-clipboard:success="onCopySuccess" v-clipboard:error="onCopyError">复制media_id</el-button>
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="addOrUpdateHandle(item)">编辑</el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete"  @click="deleteHandle(item.mediaId)" >删除</el-button>
                    </div>
                </div>
                <div class="card-operation" v-else>
                    <el-button size="small" type="success" icon="el-icon-check" round  @click="$emit('selected',item)">选中</el-button>
                </div>
            </div>
        </div>
        <el-pagination @current-change="currentChangeHandle" :current-page="pageIndex" :page-size="pageSize" :total="totalCount" layout="total, prev,pager, next, jumper">
        </el-pagination>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="onChange"></add-or-update>
    </div>
</template>
<script>
import AddOrUpdate from './material-news-add-or-update'
export default {
    name:'material-news',
    components:{AddOrUpdate},
    props:{
        selectMode:{// 是否选择模式，选择模式下点击素材选中，不可新增和删除
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            dataForm: {},
            addOrUpdateVisible: false,
            dataList: [],
            pageIndex: 1,
            pageSize: 20,
            totalCount: 0,
            dataListLoading: false
        }
    },
    methods: {
        init(){
            if(!this.dataList.length){
                this.materialNewsBatchGet()
            }
        },
        materialNewsBatchGet() {
            if(this.dataListLoading) return
            this.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl('/manage/wxAssets/materialNewsBatchGet'),
                params: this.$http.adornParams({
                    'page': this.pageIndex
                })
            }).then(({ data }) => {
                
                if (data.code == 200) {
                    this.dataList = data.data.items
                    this.totalCount = data.data.totalCount
                } else {
                    this.$message.error(data.msg);
                }
                this.dataListLoading = false
            })
        },
        loadTree(tree, treeNode, resolve) {
            console.log(tree, treeNode)

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
        // 新增 / 修改
        addOrUpdateHandle(news) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(news|| '')
            })
            // this.$router.push('/material-news-add-or-update?mediaId='+mediaId)
        },
        onCopySuccess(){
            this.$message.success('已复制')
        },
        onCopyError(err){
            this.$message.error('复制失败,可能是此浏览器不支持复制')
        },
        onChange(){
            this.materialNewsBatchGet()
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
    border-radius: 5px;
    vertical-align: top;
}

.card-preview{
    padding: 10px 10px;
    color: #d9d9d9;
}
.article-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.article-item:not(:first-of-type){
    border-top: 1px solid #eeeeee;
}
.article-title{
    display: -webkit-box;
    word-wrap:break-word;
    word-break:break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    flex: 1;
    color: #333333;
}
.article-thumb{
    width: 50px;
    height: 50px;
    display: inline-block;
}
.card-footer{
    font-size: 12px;
    background: rgba(0, 0, 0,0.6);
    color: #ffffff;
    padding: 5px 5px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
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