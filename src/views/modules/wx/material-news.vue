<template>
    <div  class="mod-menu">
        <el-form :inline="true" :model="dataForm">
            <el-form-item>
                <el-button v-if="isAuth('wx:material:save')" type="primary" @click="addOrUpdateHandle">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%;">
        <el-table-column
            prop="mediaId"
            header-align="center"
            align="center"
            label="素材mediaId">
        </el-table-column>
        <el-table-column
            prop="content"
            header-align="center"
            align="center"
            label="首篇图文">
            <a :href="scope.row.content.articles[0].url" slot-scope="scope">{{scope.row.content.articles[0].title}}</a>
        </el-table-column>
        <el-table-column
            prop="content"
            header-align="center"
            align="center"
            label="图文数量">
            <span slot-scope="scope">{{scope.row.content.articles.length}}</span>
        </el-table-column>
        <el-table-column
            prop="updateTime"
            header-align="center"
            align="center"
            label="更新时间">
        </el-table-column>
        <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="150"
            label="操作">
            <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteHandle(scope.row.mediaId)">删除</el-button>
            </template>
        </el-table-column>
        </el-table>
        <el-pagination
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-size="pageSize"
        :total="totalCount"
        layout="total, prev,pager, next, jumper">
        </el-pagination>
    </div>
</template>
<script>
export default {
    data(){
        return{
            dataForm:{},
            addOrUpdateVisible: false,
            dataList: [],
            pageIndex: 1,
            pageSize: 20,
            totalCount: 0,
            dataListLoading: false
        }
    },
    mounted(){
        this.materialNewsBatchGet()
    },
    methods:{
        materialNewsBatchGet(){
            this.dataListLoading=true
            this.$http({
                url:this.$http.adornUrl('/manage/wxAssets/materialNewsBatchGet'),
                params: this.$http.adornParams({
                    'page': this.pageIndex
                })
            }).then(({data})=>{
                this.dataListLoading=false
                if(data.code==200){
                    this.dataList=data.data.items
                    this.totalCount=data.data.totalCount
                }else{
                    this.$message({
                        type: 'error',
                        message: data.msg
                    });
                }
            })
        },
        loadTree(tree, treeNode, resolve){
            console.log(tree,treeNode)

        },
        //删除
        deleteHandle (id) {
            this.$confirm(`确定对[mediaId=${id}]进行删除操作?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/manage/wxAssets/materialDelete'),
                    method: 'post',
                    data: {mediaId:id}
                }).then(({data}) => {
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
        currentChangeHandle (val) {
            this.pageIndex = val
            this.getDataList()
        },
        // 新增 / 修改
        addOrUpdateHandle (id) {
            // id = id || ''
            // this.$router.push('/material-news-add-or-update?id='+id)
            this.$message.info("请前往公众号后台编辑！")
            setTimeout(()=>window.open('https://mp.weixin.qq.com/'),1500)
            
        }
        
    }
}
</script>