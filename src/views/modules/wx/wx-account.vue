<template>
    <div class="mod-config">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()">查询</el-button>
                <el-button v-if="isAuth('wx:wxaccount:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
                <el-button v-if="isAuth('wx:wxaccount:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
            <el-table-column type="selection" header-align="center" align="center" width="50">
            </el-table-column>
            <el-table-column prop="appid" header-align="center" align="center" label="appid">
            </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" label="公众号名称">
            </el-table-column>
            <el-table-column prop="type" header-align="center" align="center" label="类型" :formatter="accountTypeFormat">
            </el-table-column>
            <el-table-column prop="verified" header-align="center" align="center" label="是否认证">
                <span slot-scope="scope">{{scope.row.verified?"是":"否"}}</span>
            </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="accessInfo(scope.row)">接入</el-button>
                    <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="deleteHandle(scope.row.appid)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        <account-access v-if="accountAccessVisible" ref="accountAccessDialog"></account-access>
    </div>
</template>

<script>
import AddOrUpdate from './account/wx-account-add-or-update'
import AccountAccess from './account/wx-account-access-info'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            dataForm: {
                key: ''
            },
            dataList: [],
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false,
            accountAccessVisible:false
        }
    },
    components: {
        AddOrUpdate,AccountAccess
    },
    computed: mapState({
        ACCOUNT_TYPES: state=>state.wxAccount.ACCOUNT_TYPES
    }),
    activated() {
        this.getDataList()
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl('/manage/wxAccount/list'),
                method: 'get',
                params: this.$http.adornParams({
                    'key': this.dataForm.key
                })
            }).then(({ data }) => {
                if (data && data.code === 200) {
                    this.dataList = data.list
                    this.$store.commit('wxAccount/updateAccountList', data.list)
                } else {
                    this.dataList = []
                }
                this.dataListLoading = false
            })
        },
        // 多选
        selectionChangeHandle(val) {
            this.dataListSelections = val
        },
        // 新增 / 修改
        addOrUpdateHandle(item) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(item)
            })
        },
        accessInfo(item){
            this.accountAccessVisible = true
            this.$nextTick(() => {
                this.$refs.accountAccessDialog.init(item)
            })
        },
        // 删除
        deleteHandle(appid) {
            var ids = appid ? [appid] : this.dataListSelections.map(item => {
                return item.appid
            })
            this.$confirm(`确定对[appid=${ids.join(',')}]进行[${appid ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/manage/wxAccount/delete'),
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
        accountTypeFormat(row, column, cellValue) {
            return this.ACCOUNT_TYPES[cellValue];
        }
    }
}
</script>
