<template>
    <el-select v-model="selectedAppid" size="small" v-loading="dataListLoading"  @change="selectAccount" filterable>
        <el-option v-for="item in accountList" :key="item.appid" :label="item.name+'（'+ACCOUNT_TYPES[item.type]+'）'" :value="item.appid"></el-option>
    </el-select>
</template>
<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            dataListLoading: false
        }
    },
    computed: mapState({
        accountList: state=>state.wxAccount.accountList,
        ACCOUNT_TYPES: state=>state.wxAccount.ACCOUNT_TYPES,
        selectedAppid:state=>state.wxAccount.selectedAppid
    }),
    mounted(){
        this.getDataList()
    },
    methods:{
        getDataList() {
            this.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl('/manage/wxAccount/list'),
                method: 'get'
            }).then(({ data }) => {
                if (data && data.code === 200) {
                    this.$store.commit('wxAccount/updateAccountList', data.list)
                    if(!data.list.length){
                        this.$message.info("公众号列表为空，请先添加")
                    }
                }
                this.dataListLoading = false
            })
        },
        selectAccount(appid){
            if(this.selectedAppid!=appid){
                this.$store.commit('wxAccount/selectAccount', appid)
            }
        }
    }
}
</script>