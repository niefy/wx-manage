<template>
    <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
            <el-form-item label="二维码类型" prop="isTemp">
                <el-radio v-model="dataForm.isTemp" :label="true">临时</el-radio>
                <el-radio v-model="dataForm.isTemp" :label="false">永久</el-radio>
                <div>
                    <a class="text-warning" v-show="!dataForm.isTemp" target="_blank" href="https://developers.weixin.qq.com/doc/offiaccount/Account_Management/Generating_a_Parametric_QR_Code.html">注意永久二维码上限10万个，且暂时无法删除旧的二维码</a>
                </div>
            </el-form-item>

            <el-form-item label="场景值" prop="sceneStr">
                <el-input v-model="dataForm.sceneStr" placeholder="任意字符串" maxlength="64"></el-input>
            </el-form-item>
            <el-form-item label="失效时间/秒" prop="expireSeconds" v-if="dataForm.isTemp">
                <el-input v-model="dataForm.expireSeconds" placeholder="单位：秒，最大2592000（30天）"></el-input>
                <div>最大30天，当前设置：<span class="text-warning">{{dataForm.expireSeconds/(24*3600)}}天</span></div>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            dataForm: {
                isTemp: true,
                sceneStr: '',
                expireSeconds: 2592000
            },
            dataRule: {
                isTemp: [
                    { required: true, message: '二维码类型不能为空', trigger: 'blur' }
                ],
                sceneStr: [
                    { required: true, message: '场景值ID不能为空', trigger: 'blur' }
                ],
                expireSeconds: [
                    { required: true, message: '该二维码失效时间不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        init(id) {
            this.dataForm.id = id || 0
            this.visible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields()
            })
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/manage/wxQrCode/createTicket`),
                        method: 'post',
                        data: this.$http.adornData(this.dataForm)
                    }).then(({ data }) => {
                        if (data && data.code === 200) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.visible = false
                                    this.$emit('refreshDataList')
                                }
                            })
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }
            })
        }
    }
}
</script>
