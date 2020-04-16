<template>
    <div class="mod-config">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-input v-model="dataForm.title" placeholder="标题" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()">查询</el-button>
                <el-button v-if="isAuth('wx:msgtemplate:save')" type="success" @click="copyHandle()" :disabled="dataListSelections.length <= 0">批量复制</el-button>
                <el-button v-if="isAuth('wx:msgtemplate:save')" type="success" @click="templateMsgTaskHandle()" :disabled="dataListSelections.length!=1">推送消息</el-button>
                <el-button v-if="isAuth('wx:msgtemplate:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
            </el-form-item>
            <el-form-item class="fr">
                <el-button v-if="isAuth('wx:msgtemplate:save')" icon="el-icon-sort" type="success" @click="syncWxTemplate()" :disabled="synchonizingWxTemplate">{{synchonizingWxTemplate?'同步中...':'同步公众号模板'}}</el-button>
                <el-button><el-link type="primary" icon="el-icon-link" target="_blank" href="https://kf.qq.com/faq/170209E3InyI170209nIF7RJ.html">模板管理指引</el-link></el-button>
            </el-form-item>
        </el-form>
        
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
            <el-table-column type="selection" header-align="center" align="center" width="50">
            </el-table-column>
            <el-table-column prop="templateId" show-overflow-tooltip header-align="center" align="center" label="模板ID">
            </el-table-column>
            <el-table-column prop="title" header-align="center" align="center" label="标题">
                <a :href="scope.row.url" slot-scope="scope">{{scope.row.title}}</a>
            </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" label="模版名称">
            </el-table-column>
            <el-table-column prop="content" show-overflow-tooltip header-align="center" align="center" label="模版字段" width="200">
            </el-table-column>
            <el-table-column prop="status" header-align="center" align="center" label="是否有效">
                <span slot-scope="scope">{{scope.row.status?"是":"否"}}</span>
            </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">配置</el-button>
                    <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalCount" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        <template-msg-task v-if="templateMsgTaskVisible" ref="templateMsgTask"></template-msg-task>
    </div>
</template>

<script>
import AddOrUpdate from './msg-template-add-or-update'
import TemplateMsgTask from '@/components/template-msg-task'
export default {
    data() {
        return {
            dataForm: {
                title: ''
            },
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalCount: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false,
            templateMsgTaskVisible:false,
            synchonizingWxTemplate:false
        }
    },
    components: {
        AddOrUpdate,TemplateMsgTask
    },
    activated() {
        this.getDataList()
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl('/manage/msgTemplate/list'),
                method: 'get',
                params: this.$http.adornParams({
                    'page': this.pageIndex,
                    'limit': this.pageSize,
                    'title': this.dataForm.title,
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
                    url: this.$http.adornUrl('/manage/msgTemplate/delete'),
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
        syncWxTemplate(){
            if(this.synchonizingWxTemplate)return
            this.synchonizingWxTemplate=true
            this.$http({
                    url: this.$http.adornUrl('/manage/msgTemplate/syncWxTemplate'),
                    method: 'post',
                }).then(({ data }) => {
                    this.synchonizingWxTemplate=false
                    if (data && data.code === 200) {
                        this.$message({
                            message: '同步完成',
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.getDataList()
                            }
                        })
                    } else {
                        this.$message.error(data.msg)
                    }
                }).catch(()=>this.synchonizingWxTemplate=false)
        },
        templateMsgTaskHandle(){
            this.templateMsgTaskVisible = true
            this.$nextTick(() => {
                this.$refs.templateMsgTask.init(this.dataListSelections[0])
            })
        },
        async copyHandle(){
            let loading;
            for (let i = 0; i < this.dataListSelections.length; i++) {
                let item = this.dataListSelections[i];
                loading=this.$loading({
                    lock: true,
                    text: "复制模板："+item.title,
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                item.id='';
                item.updateTime=new Date()
                item.name+='_COPY'
                await this.addMsgTemplate(item).catch(()=>loading.close())
                loading.close()
            }
            loading.close()
            this.getDataList()
        },
        addMsgTemplate(msgTemplate){
            return new Promise((resolve, reject) => {
                this.$http({
                    url: this.$http.adornUrl('/manage/msgTemplate/save'),
                    method: 'post',
                    data: this.$http.adornData(msgTemplate)
                }).then(({ data }) => {
                    if (data && data.code === 200) {
                        resolve()
                    } else {
                        this.$message.error(data.msg)
                        reject(data.msg)
                    }
                }).catch(err=>reject(err))
            }) 
        }
    }
}
</script>