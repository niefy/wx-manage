<template>
    <el-dialog :title="modeDesc[mode]+'用户标签'" :close-on-click-modal="false" :visible.sync="dialogVisible">
        <div>
            <el-select v-model="selectedTagid" filterable placeholder="请选择标签" style="width:100%">
                <el-option v-for="tagid in tagidsInOption" :key="tagid" :label="getTagName(tagid)" :value="tagid"></el-option>
            </el-select>
            <div style="margin-top:20px;">已选择用户数：{{wxUsers.length}}</div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible=false">关闭</el-button>
            <el-button type="primary" @click="dataFormSubmit()" :disabled="submitting">{{submitting?'保存中...':'确定'}}</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex'
export default {
    name:'wx-user-tagging',
    props:{
        wxUsers:Array,
    },
    data(){
        return{
            mode:'tagging',//操作，tagging | untagging
            modeDesc:{
                'tagging':'绑定',
                'untagging':'解绑'
            },
            selectedTagid:'',
            dialogVisible:false,
            submitting:false
        }
    },
    computed: mapState({
        wxUserTags:state=>state.wxUserTags.tags,
        /**
         * 返回下拉选择框中的选项列表
         * 假设 all= 全部标签，intersection = 用户标签交集（即所有用户都有的） ，union=用户标签并集（即至少一个用户的）
         * 那么绑定时可选：all-intersection的差集，即所有用户都有的就不列出来了
         *     解绑时可选：，union ，即用户有的标签都列出来
         */
        tagidsInOption(){
            let userTags=this.wxUsers.map(u=>u.tagidList || [])//示例：[[1,2],[],[1,3]]
            if(this.mode=='tagging'){//绑定标签时可选：所有标签 - 用户标签交集
                let all = this.wxUserTags.map(item=>item.id)
                return all.filter(tagid=>!userTags.every(tagsIdArray=>tagsIdArray.indexOf(tagid)>-1))
            }else if(this.mode=='untagging'){//解绑标签时可选：用户标签的并集
                let unionSet = new Set();
                userTags.forEach(tagsIdArray=>{
                    tagsIdArray.forEach(tagid => unionSet.add(tagid))
                });//将用户的标签放到unionSet中去重
                return Array.from(unionSet);//unionSet转为数组
            }
            return []
        }
        
    }),
    methods:{
        init(mode){
            if('tagging'==mode || 'untagging'==mode){
                this.mode=mode;
                this.dialogVisible=true
            }else{
                throw('mode参数有误')
            }
        },
        getTagName(tagid){
            let tag = this.wxUserTags.find(item=>item.id==tagid)
            return tag?tag.name : "?"
        },
        dataFormSubmit(){
            if(this.submitting)return
            if(!this.selectedTagid){
                this.$message.error('未选择标签')
                return
            }
            this.submitting=true
            let openidList=this.wxUsers.map(u=>u.openid)
            this.$http({
                url: this.$http.adornUrl(`/manage/wxUserTags/${this.mode=='tagging'?'batchTagging':'batchUnTagging'}`),
                method: 'post',
                data:this.$http.adornData({
                    tagid : this.selectedTagid,
                    openidList : openidList
                })
            }).then(({ data }) => {
                this.submitting=false
                if (data && data.code === 200) {
                    this.$message({
                        message: '操作成功,列表数据需稍后刷新查看',
                        type: 'success',
                        onClose: () =>this.dialogVisible=false
                    })
                } else {
                    this.$message.error(data.msg)
                }
                
            })
        }
    }
}
</script>