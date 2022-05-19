<template>
    <div class="mod-config">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-select v-model="dataForm.tagid" filterable clearable placeholder="用户标签">
                    <el-option v-for="item in wxUserTags" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="dataForm.nickname" placeholder="昵称" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="dataForm.city" placeholder="城市" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="dataForm.qrSceneStr" placeholder="关注场景值" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()">查询</el-button>
                <el-button v-if="isAuth('wx:wxuser:save')"  type="primary" @click="$refs.wxUserTagging.init('tagging')" :disabled="dataListSelections.length <= 0">绑定标签</el-button>
                <el-button v-if="isAuth('wx:wxuser:save')"  type="primary" @click="$refs.wxUserTagging.init('untagging')" :disabled="dataListSelections.length <= 0">解绑标签</el-button>
                <el-button v-if="isAuth('wx:wxuser:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
            </el-form-item>
            <el-form-item class="fr">
                <el-button  icon="el-icon-price-tag" type="success" @click="$refs.wxUserTagsEditor.show()">标签管理</el-button>
                <el-button  icon="el-icon-sort" type="success" @click="syncWxUsers()">同步粉丝</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
            <el-table-column type="selection" header-align="center" align="center" width="50">
            </el-table-column>
            <el-table-column prop="openid" header-align="center" align="center" label="openid">
            </el-table-column>
            <el-table-column prop="nickname" header-align="center" align="center" label="昵称">
            </el-table-column>
            <el-table-column prop="sex" header-align="center" align="center" label="性别" :formatter="sexFormat">
            </el-table-column>
            <el-table-column prop="city" header-align="center" align="center" label="城市">
            </el-table-column>
            <el-table-column prop="headimgurl" header-align="center" align="center" label="头像">
                <img class="headimg" slot-scope="scope" v-if="scope.row.headimgurl" :src="scope.row.headimgurl" />
            </el-table-column>
            <el-table-column prop="tagidList" header-align="center" align="center" label="标签" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-for="tagid in scope.row.tagidList" :key="tagid">{{getTagName(tagid)}} </span>
                </template>
            </el-table-column>
            <el-table-column prop="subscribeTime" header-align="center" align="center" label="订阅时间">
                <template slot-scope="scope">{{$moment(scope.row.subscribeTime).calendar()}}</template>
            </el-table-column>
            <el-table-column prop="qrSceneStr" header-align="center" align="center" label="场景值">
            </el-table-column>
            <el-table-column prop="subscribe" header-align="center" align="center" label="是否关注">
                <span slot-scope="scope">{{scope.row.subscribe?"是":"否"}}</span>
            </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="deleteHandle(scope.row.openid)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <wx-user-tags-manager ref="wxUserTagsEditor" :visible="showWxUserTagsEditor" @close="showWxUserTagsEditor=false"></wx-user-tags-manager>
        <wx-user-tagging ref="wxUserTagging" :wxUsers="dataListSelections"></wx-user-tagging>
    </div>
</template>

<script>
import WxUserTagsManager from '@/components/wx-user-tags-manager'
import WxUserTagging from './wx-user-tagging'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            dataForm: {
                tagid:'',
                nickname: '',
                city:'',
                qrSceneStr:''
            },
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            showWxUserTagsEditor:false,
            dataListLoading: false,
            dataListSelections: [],
        }
    },
    components: {
        WxUserTagsManager,WxUserTagging
    },
    activated() {
        this.getDataList()
    },
    computed: mapState({
        wxUserTags:state=>state.wxUserTags.tags
    }),
    methods: {
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl('/manage/wxUser/list'),
                method: 'get',
                params: this.$http.adornParams({
                    'page': this.pageIndex,
                    'limit': this.pageSize,
                    'nickname': this.dataForm.nickname,
                    'tagid': this.dataForm.tagid,
                    'city': this.dataForm.city,
                    'qrSceneStr': this.dataForm.qrSceneStr,
                    'sidx': 'subscribe_time',
                    'order': 'desc'
                })
            }).then(({ data }) => {
                if (data && data.code === 200) {
                    this.dataList = data.page.list
                    this.totalPage = data.page.totalCount
                } else {
                    this.dataList = []
                    this.totalPage = 0
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
            var ids = id ? [id] : this.dataListSelections.map(item => item.openid)
            this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/manage/wxUser/delete'),
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
        syncWxUsers(){
            this.$http({
                    url: this.$http.adornUrl('/manage/wxUser/syncWxUsers'),
                    method: 'post',
                }).then(({ data }) => {
                    if (data && data.code === 200) {
                        this.$message({
                            message: '同步任务已建立，请稍候刷新查看列表',
                            type: 'success',
                            duration: 1500
                        })
                    } else {
                        this.$message.error(data.msg)
                    }
                })
        },
        
        sexFormat(row, column, cellValue) {
            let sexType = {
                0: '未知',
                1: '男',
                2: '女'
            }
            return sexType[cellValue];
        },
        getTagName(tagid){
            let tag = this.wxUserTags.find(item=>item.id==tagid)
            return tag?tag.name : "?"
        }
    }
}
</script>
<style scoped>
.headimg{
    width: 50px;
    height: 50px;
    border-radius: 8px;
}
</style>