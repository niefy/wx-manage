<template>
    <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="dataForm.roleName" placeholder="角色名称"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
            </el-form-item>
            <el-form-item size="mini" label="授权">
                <el-tree :data="menuList" :props="menuListTreeProps" node-key="menuId" ref="menuListTree" :default-expand-all="true" show-checkbox>
                </el-tree>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
export default {
    data() {
        return {
            visible: false,
            menuList: [],
            menuListTreeProps: {
                label: 'name',
                children: 'children'
            },
            dataForm: {
                id: 0,
                roleName: '',
                remark: ''
            },
            dataRule: {
                roleName: [
                    { required: true, message: '角色名称不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        init(id) {
            this.dataForm.id = id || 0
            this.$http({
                url: this.$http.adornUrl('/sys/menu/list'),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({ data }) => {
                this.menuList = treeDataTranslate(data, 'menuId')
            }).then(() => {
                this.visible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                    this.$refs.menuListTree.setCheckedKeys([])
                })
            }).then(() => {
                if (this.dataForm.id) {
                    this.$http({
                        url: this.$http.adornUrl(`/sys/role/info/${this.dataForm.id}`),
                        method: 'get',
                        params: this.$http.adornParams()
                    }).then(({ data }) => {
                        if (data && data.code === 200) {
                            this.dataForm.roleName = data.role.roleName
                            this.dataForm.remark = data.role.remark
                            data.role.menuIdList.forEach(item => {
                                this.$refs.menuListTree.setChecked(item, true);
                            });
                        }
                    })
                }
            })
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/sys/role/${!this.dataForm.id ? 'save' : 'update'}`),
                        method: 'post',
                        data: this.$http.adornData({
                            'roleId': this.dataForm.id || undefined,
                            'roleName': this.dataForm.roleName,
                            'remark': this.dataForm.remark,
                            'menuIdList': [].concat(this.$refs.menuListTree.getCheckedKeys(), this.$refs.menuListTree.getHalfCheckedKeys())
                        })
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
