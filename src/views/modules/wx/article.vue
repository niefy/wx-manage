<template>
    <div>
        <div v-show="!addOrUpdateVisible">
            <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
                <el-form-item>
                    <el-select v-model="dataForm.type" placeholder="选择文章类型">
                        <el-option v-for="(name,key) in ARTICLE_TYPES" :key="key" :label="name" :value="key" allow-create></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="dataForm.title" placeholder="标题" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="pageIndex=1;getDataList()">查询</el-button>
                    <el-button v-if="isAuth('wx:article:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
                    <el-button v-if="isAuth('wx:article:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
                <el-table-column type="selection" header-align="center" align="center" width="50">
                </el-table-column>
                <el-table-column prop="id" header-align="center" align="center" label="ID">
                </el-table-column>
                <el-table-column prop="type" header-align="center" align="center" :formatter="articleTypeFormat" label="文章类型">
                </el-table-column>
                <el-table-column prop="title" header-align="center" align="center" show-overflow-tooltip label="标题">
                    <a :href="scope.row.targetLink" slot-scope="scope">{{scope.row.title}}</a>
                </el-table-column>
                <el-table-column prop="category" header-align="center" align="center" label="一级分类">
                </el-table-column>
                <el-table-column prop="subCategory" header-align="center" align="center" label="二级分类">
                </el-table-column>
                <el-table-column prop="openCount" header-align="center" align="center" label="打开次数">
                </el-table-column>
                <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                        <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalCount" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
         <!-- 新增 / 修改  -->
        <add-or-update :visible="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" @hide="addOrUpdateVisible=false"></add-or-update>
    </div>
</template>

<script>
import AddOrUpdate from './article-add-or-update'
import { mapState } from 'vuex'
export default {
    components: {
        AddOrUpdate
    },
    data() {
        return {
            dataForm: {
                title: '',
                type: ''
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
    computed: mapState({
        ARTICLE_TYPES: state=>state.article.ARTICLE_TYPES
    }),
    mounted() {
        this.getDataList()
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl('/manage/article/list'),
                method: 'get',
                params: this.$http.adornParams({
                    'page': this.pageIndex,
                    'limit': this.pageSize,
                    'title': this.dataForm.title,
                    'type': this.dataForm.type,
                    'sidx': 'id',
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
        // 新增 / 修改
        addOrUpdateHandle(id) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id)
            })
        },
        // 删除
        deleteHandle(id) {
            var ids = id ? [id] : this.dataListSelections.map(item => item.id)
            this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/manage/article/delete'),
                    method: 'post',
                    data: this.$http.adornData(ids, false)
                }).then(({ data }) => {
                    if (data && data.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            duration: 1500,
                            onClose: () => this.getDataList()
                        })
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            })
        },
        articleTypeFormat(row, column, cellValue) {
            return this.ARTICLE_TYPES[cellValue];
        }
    }
}
</script>
