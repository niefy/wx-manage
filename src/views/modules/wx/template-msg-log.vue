<template>
    <div class="mod-config">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-input v-model="dataForm.touser" placeholder="openid" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()">查询</el-button>
                <el-button v-if="isAuth('wx:templatemsglog:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
            <el-table-column type="selection" header-align="center" align="center" width="50">
            </el-table-column>
            <el-table-column prop="touser" header-align="center" align="center" label="openid" width="100">
            </el-table-column>
            <el-table-column prop="data" header-align="center" align="center" :formatter="tableJsonFormat" label="内容"  width="300">
            </el-table-column>
            <el-table-column prop="sendResult" header-align="center" align="center" show-overflow-tooltip label="发送结果" width="150">
            </el-table-column>
            <el-table-column prop="sendTime" header-align="center" align="center" width="100" label="发送时间">
            </el-table-column>
            <el-table-column prop="url" header-align="center" align="center" show-overflow-tooltip label="链接">
            </el-table-column>
            <el-table-column prop="miniprogram" header-align="center" align="center" :formatter="tableJsonFormat" show-overflow-tooltip label="小程序">
            </el-table-column>
            <el-table-column prop="templateId" header-align="center" align="center" label="模板ID"  width="150">
            </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="deleteHandle(scope.row.logId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalCount" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dataForm: {
                touser: ''
            },
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalCount: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false
        }
    },
    activated() {
        this.getDataList()
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl('/manage/templateMsgLog/list'),
                method: 'get',
                params: this.$http.adornParams({
                    'page': this.pageIndex,
                    'limit': this.pageSize,
                    'touser': this.dataForm.touser,
                    'sidx': 'send_time',
                    'order': 'desc'
                })
            }).then(({ data }) => {
                if (data && data.code === 200) {
                    this.dataList = data.page.list
                    this.totalCount = data.page.totalCount
                } else {
                    this.dataList = []
                    this.totalCount = 0
                }
                this.dataListLoading = false
            })
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val
            this.pageIndex = 1
            this.getDataList()
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageIndex = val
            this.getDataList()
        },
        // 多选
        selectionChangeHandle(val) {
            this.dataListSelections = val
        },
        // 删除
        deleteHandle(id) {
            var ids = id ? [id] : this.dataListSelections.map(item => item.logId)
            this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/manage/templateMsgLog/delete'),
                    method: 'post',
                    data: this.$http.adornData(ids, false)
                }).then(({ data }) => {
                    if (data && data.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.getDataList()
                            }
                        })
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            })
        },
        tableJsonFormat(row, column, cellValue){
            if (!cellValue) {
                return '';
            }
            return JSON.stringify(cellValue)
        }
    }
}
</script>
