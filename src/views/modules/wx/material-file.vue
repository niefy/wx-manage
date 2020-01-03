<template>
    <div  class="mod-menu">
        <el-form :inline="true" :model="dataForm">
            <el-form-item>
                <el-button  type="primary" @click="addOrUpdateHandle()">新增</el-button>
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
            prop="name"
            header-align="center"
            align="center"
            label="素材名称">
        </el-table-column>
        <el-table-column
            prop="url"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="链接地址">
            <a :href="scope.row.url" slot-scope="scope">{{scope.row.url}}</a>
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
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.mediaId)">修改</el-button>
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
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="materialFileBatchGet"></add-or-update>
    </div>
</template>
<script>
import AddOrUpdate from './material-file-add-or-update'
export default {
    components:{
        AddOrUpdate
    },
    data(){
        return{
            dataForm:{},
            addOrUpdateVisible: false,
            dataList: [],
            pageIndex: 1,
            pageSize: 20,
            totalCount: 0,
            dataListLoading: false,
        }
    },
    mounted(){
        this.materialFileBatchGet()
    },
    methods:{
        materialFileBatchGet(){
            this.dataListLoading=true
            this.$http({
                url:this.$http.adornUrl('/manage/wxAssets/materialFileBatchGet'),
                params: this.$http.adornParams({
                    'page': this.pageIndex
                })
            }).then(({data})=>{
                this.dataListLoading=false
                if(data && data.code==200){
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
        // 新增 / 修改
        addOrUpdateHandle (id) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
            this.$refs.addOrUpdate.init(id)
            })
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
        }
        
    }
}
</script>