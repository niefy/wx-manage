<template>
    <div id="app">
        <transition name="fade">
            <router-view />
        </transition>
    </div>
</template>

<style>
img.image-sm {
    max-width: 80px;
    max-height: 80px;
}
.el-col .el-select,
.el-col .el-date-editor {
    width: 100%;
}
.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
.text-warning {
    color: #e6a23c;
}
</style>
