<template>
    <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
        <div class="site-navbar__header">
            <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
                <a class="site-navbar__brand-lg" href="javascript:;">微信管理系统</a>
                <a class="site-navbar__brand-mini" href="javascript:;">W</a>
            </h1>
        </div>
        <div class="site-navbar__body clearfix">
            <el-menu class="site-navbar__menu" mode="horizontal">
                <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
                    <i :class="sidebarFold?'el-icon-s-unfold':'el-icon-s-fold'"></i>
                </el-menu-item>
            </el-menu>
            <el-menu class="site-navbar__menu site-navbar__menu--right" mode="horizontal">
                <el-menu-item index="1" @click="$router.push({ name: 'theme' })">
                    <template slot="title">
                        <i class="el-icon-setting"></i>
                    </template>
                </el-menu-item>
                <el-menu-item index="2" v-if="isAuth('wx:wxaccount:list')">
                    <template slot="title">
                        <wx-account-selector></wx-account-selector>
                    </template>
                </el-menu-item>
                <el-menu-item class="site-navbar__avatar" index="3">
                    <el-dropdown :show-timeout="0" placement="bottom">
                        <span class="el-dropdown-link">
                            {{ userName }}
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
                            <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-menu-item>
            </el-menu>
        </div>
        <!-- 弹窗, 修改密码 -->
        <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
    </nav>
</template>

<script>
import UpdatePassword from './main-navbar-update-password'
import WxAccountSelector from '@/components/wx-account-selector'
import { clearLoginInfo } from '@/utils'
export default {
    data() {
        return {
            updatePassowrdVisible: false
        }
    },
    components: {
        UpdatePassword,WxAccountSelector
    },
    computed: {
        navbarLayoutType: {
            get() { return this.$store.state.common.navbarLayoutType }
        },
        sidebarFold: {
            get() { return this.$store.state.common.sidebarFold },
            set(val) { this.$store.commit('common/updateSidebarFold', val) }
        },
        mainTabs: {
            get() { return this.$store.state.common.mainTabs },
            set(val) { this.$store.commit('common/updateMainTabs', val) }
        },
        userName: {
            get() { return this.$store.state.user.name }
        }
    },
    methods: {
        // 修改密码
        updatePasswordHandle() {
            this.updatePassowrdVisible = true
            this.$nextTick(() => {
                this.$refs.updatePassowrd.init()
            })
        },
        // 退出
        logoutHandle() {
            this.$confirm(`确定进行[退出]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/sys/logout'),
                    method: 'post',
                    data: this.$http.adornData()
                }).then(({ data }) => {
                    if (data && data.code === 200) {
                        clearLoginInfo()
                        this.$router.push({ name: 'login' })
                    }
                })
            }).catch(() => { })
        }
    }
}
</script>
