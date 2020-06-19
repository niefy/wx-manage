<template>
    <el-dialog title="筛选模板消息目标用户" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :inline="true" :model="dataForm" ref="dataForm" clearable @keyup.enter.native="getWxUsers()">
            <el-form-item>
                <el-select v-model="dataForm.tagid" filterable placeholder="用户标签" @change="getWxUsers()">
                    <el-option v-for="item in wxUserTags" :key="item.id" :label="item.name" :value="item.id+''"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="dataForm.nickname" placeholder="昵称" @change="getWxUsers()" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="dataForm.province" placeholder="省份" @change="getWxUsers()" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="dataForm.city" placeholder="城市" @change="getWxUsers()" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="dataForm.remark" placeholder="备注" @change="getWxUsers()" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="dataForm.qrScene" placeholder="扫码场景值" @change="getWxUsers()" clearable></el-input>
            </el-form-item>
        </el-form>
        <div class="text-bold">本消息将发送给：</div>
        <div class="user-list"  v-loading="wxUsersLoading">
            <div class="user-card" v-for="item in wxUserList" :key="item.openid">
                <el-avatar :src="item.headimgurl"></el-avatar>
                <div class="nickname">{{item.nickname}}</div>
            </div>
            <div class="text-bold">
                <span v-show="totalCount>10">...</span>
                等共<span class="text-success">{{totalCount}}</span>个用户
            </div>
        </div>
        <div class="margin-top text-bold">消息预览：</div>
        <div class="margin-top-xs">
            <el-input type="textarea" disabled autosize v-model="msgReview" placeholder="模版"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="send" type="success" :disabled="totalCount<=0 || sending">{{sending?'发送中...':'发送'}}</el-button>
            <el-button @click="visible=false">关闭</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex'
export default {
    name:'template-msg-task',
    props:{
        wxUserTagName:{
            type:String,
            required:false
        }
    },
    data(){
        return{
            visible:false,
            wxUsersLoading:false,
            sending:false,
            msgTemplate:{},
            dataForm: {
                page:1,
                sidx: 'subscribe_time',
                order: 'desc',
                tagid:'',
                nickname: '',
                city:'',
                province:'',
                remark:'',
                qrScene:''
            },
            wxUserList:[],
            totalCount:0
        }
    },
    computed: mapState({
        wxUserTags:state=>state.wxUserTags.tags,
        msgReview(){
            if(!this.msgTemplate.data) return ""
            let content = this.msgTemplate.content
            this.msgTemplate.data.forEach(item=>{
                content = content.replace("{{"+item.name+".DATA}}",item.value)
            })
            return content
        }
    }),
    mounted() {
        this.getWxUserTags().then((taglist)=>{
            if(this.wxUserTagName){
                let tagItem = taglist.find(tag=>tag.name==this.wxUserTagName)
                console.log(tagItem)
                if(tagItem) {
                    this.dataForm.tagid=tagItem.id+''
                }
            }
            this.getWxUsers()
        });
    },
    methods:{
        init(msgTemplate){
            if(!msgTemplate || !msgTemplate.templateId){
                this.$message.error('消息模板无效')
                return
            }
            if(!msgTemplate.data || !(msgTemplate.data instanceof Array)){
                this.$message.error('请现配置此模板填充数据')
                return
            }
            this.msgTemplate=msgTemplate
            this.visible=true;
        },
        getWxUserTags() {
            return new Promise((resolve,reject)=>{
                this.$http({
                    url: this.$http.adornUrl('/manage/wxUserTags/list'),
                    method: 'get',
                }).then(({ data }) => {
                    if (data && data.code === 200) {
                        this.$store.commit('wxUserTags/updateTags', data.list)
                        resolve(data.list)
                    } else {
                        this.$message.error(data.msg)
                        reject(data.msg)
                    }
                }).catch(err=>reject(err))
            })
        },
        getWxUsers() {
            this.wxUsersLoading = true
            this.$http({
                url: this.$http.adornUrl('/manage/wxUser/list'),
                method: 'get',
                params: this.$http.adornParams(this.dataForm)
            }).then(({ data }) => {
                if (data && data.code === 200) {
                    this.wxUserList = data.page.list
                    this.totalCount = data.page.totalCount
                } else {
                    this.$message.error(data.msg)
                }
                this.wxUsersLoading = false
            })
        },
        send(){
            if(this.sending)return
            this.sending=true
            this.$http({
                url: this.$http.adornUrl('/manage/msgTemplate/sendMsgBatch'),
                method: 'post',
                data:this.$http.adornData({
                    wxUserFilterParams : this.dataForm,
                    templateId : this.msgTemplate.templateId,
                    url : this.msgTemplate.url,
                    miniprogram : this.msgTemplate.miniprogram,
                    data : this.msgTemplate.data,
                })
            }).then(({ data }) => {
                this.sending = false
                if (data && data.code === 200) {
                    this.$message.success("消息将在后台发送")
                    this.visible=false
                } else {
                    this.$message.error(data.msg)
                }
            })
        }
    }
}
</script>
<style scoped>
.user-list{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.user-card{
    overflow: hidden;
    max-width: 60px;
    margin: 5px;
    text-align: center;
}
.nickname{
    color: #999999;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
</style>