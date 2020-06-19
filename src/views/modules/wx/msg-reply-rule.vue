<template>
    <div class="mod-config">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-input v-model="dataForm.matchValue" placeholder="匹配关键词" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()">查询</el-button>
                <el-button v-if="isAuth('wx:msgreplyrule:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
                <el-button v-if="isAuth('wx:msgreplyrule:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border type="expand" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="作用范围">
                            <span>{{ props.row.appid?'当前公众号':'全部公众号' }}</span>
                        </el-form-item>
                        <el-form-item label="精确匹配">
                            <span>{{ props.row.exactMatch?'是':'否' }}</span>
                        </el-form-item>
                        <el-form-item label="是否有效">
                            <span>{{ props.row.status?'是':'否' }}</span>
                        </el-form-item>
                        <el-form-item label="备注说明">
                            <span>{{ props.row.desc }}</span>
                        </el-form-item>
                        <el-form-item label="生效时间">
                            <span>{{ props.row.effectTimeStart }}</span>
                        </el-form-item>
                        <el-form-item label="失效时间">
                            <span>{{ props.row.effectTimeEnd }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column type="selection" header-align="center" align="center" width="50">
            </el-table-column>
            <el-table-column prop="ruleName" header-align="center" align="center" show-overflow-tooltip label="规则名称">
            </el-table-column>
            <el-table-column prop="matchValue" header-align="center" align="center" show-overflow-tooltip label="匹配关键词">
            </el-table-column>
            <el-table-column prop="replyType" header-align="center" align="center" :formatter="replyTypeFormat" label="消息类型">
            </el-table-column>
            <el-table-column prop="replyContent" header-align="center" align="center" show-overflow-tooltip label="回复内容">
            </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.ruleId)">修改</el-button>
                    <el-button type="text" size="small" @click="deleteHandle(scope.row.ruleId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalCount" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import AddOrUpdate from './msg-reply-rule-add-or-update'
import { mapState } from 'vuex'
export default {
    components: {
        AddOrUpdate
    },
    data() {
        return {
            dataForm: {
                matchValue: ''
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
        KefuMsgType: state=>state.message.KefuMsgType
    }),

    activated() {
        this.getDataList()
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl('/manage/msgReplyRule/list'),
                method: 'get',
                params: this.$http.adornParams({
                    'page': this.pageIndex,
                    'limit': this.pageSize,
                    'matchValue': this.dataForm.matchValue
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
            var ids = id ? [id] : this.dataListSelections.map(item => item.ruleId)
            this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/manage/msgReplyRule/delete'),
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
        replyTypeFormat(row, column, cellValue) {
            return this.KefuMsgType[cellValue];
        }
    }
}
</script>
