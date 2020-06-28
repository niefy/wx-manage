<template>
    <el-dialog title="开发接入信息" :close-on-click-modal="false" :visible.sync="visible">
        <div>
            <div class="list-item"><span class="label">公众号:</span>{{account.name}}</div>
            <div class="list-item"><span class="label">token:</span>{{account.token}}</div>
            <div class="list-item"><span class="label">aesKey:</span>{{account.aesKey}}</div>
            <div class="list-item">
                <span class="label">接入链接:</span>
                <span v-html="accessUrl"></span>
            </div>
            
        </div>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            account: {},
        }
    },
    computed: {
        accessUrl() {
            let host = location.host;
            if(/^(\d(.\d){3})|localhost/.test(host)){
                host='<span class="text-red">正式域名</span>'
            }
            return location.protocol + '//' + host + '/wx/wx/msg/' + this.account.appid
        }
    },
    methods: {
        init(item) {
            this.visible = true
            if (item && item.appid) {
                this.account = item
            }
        },
    }
}
</script>
<style scoped>
.list-item{
    line-height: 30px;
}
.label{
    width: 100px;
    display: inline-block;
    margin-right: 10px;
    font-weight: bold;
    text-align: right;
}
</style>
