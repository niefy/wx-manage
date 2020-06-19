<template>
    <el-dialog title="公众号用户标签管理" :close-on-click-modal="false" :visible.sync="dialogVisible">
        <div class="panel  flex flex-wrap" v-loading="submitting">
            <el-tag v-for="tag in wxUserTags" closable @click="editTag(tag.id,tag.name)" @close="deleteTag(tag.id)" :disable-transitions="false" :key="tag.id">
                {{tag.id}} {{tag.name}}
            </el-tag>
            <el-input class="input-new-tag" v-if="inputVisible" placeholder="回车确认" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="addTag">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加</el-button>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible=false">关闭</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex'
export default {
    name: 'wx-user-tags-manager',
    props: {
        visible: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            dialogVisible:false,
            inputVisible: false,
            inputValue: '',
            submitting:false,
        }
    },
    computed: mapState({
        wxUserTags:state=>state.wxUserTags.tags
    }),
    mounted() {
        this.getWxUserTags();
    },
    methods: {
        show(){
            this.dialogVisible=true;
        },
        getWxUserTags() {
            this.$http({
                url: this.$http.adornUrl('/manage/wxUserTags/list'),
                method: 'get',
            }).then(({ data }) => {
                if (data && data.code === 200) {
                    this.$store.commit('wxUserTags/updateTags', data.list)
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        deleteTag(tagid) {
            if(this.submitting){
                return
            }
            this.$confirm(`确定删除标签?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.submitting=true
                this.$http({
                    url: this.$http.adornUrl('/manage/wxUserTags/delete/'+tagid),
                    method: 'post',
                }).then(({ data }) => {
                    if (data && data.code === 200) {
                        this.getWxUserTags();
                        this.$emit('change');
                    } else {
                        this.$message.error(data.msg)
                    }
                    this.submitting=false;
                })
            })
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        addTag() {
            let newTagName = this.inputValue;
            this.saveTag(newTagName)
            this.inputVisible = false;
            this.inputValue = '';
        },
        editTag(tagid,orignName=''){
            this.$prompt('请输入新标签名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue:orignName,
                inputPattern: /^.{1,30}$/,
                inputErrorMessage: '名称1-30字符'
            }).then(({ value }) => {
                console.log(value)
                this.saveTag(value,tagid)
            })
        },
        saveTag(name,tagid){
            if(this.submitting){
                return
            }
            this.submitting=true
            this.$http({
                url: this.$http.adornUrl('/manage/wxUserTags/save'),
                method: 'post',
                data:this.$http.adornData({
                    id : tagid?tagid:undefined,
                    name : name
                })
            }).then(({ data }) => {
                if (data && data.code === 200) {
                    this.getWxUserTags();
                    this.$emit('change');
                } else {
                    this.$message.error(data.msg)
                }
                this.submitting=false;
            })
        }
    }
}
</script>
<style scoped>
.panel {
    flex: 1;
}
.el-tag,.button-new-tag {
    margin: 5px;
}
.input-new-tag {
    width: inherit;
}
</style>