<!--
 * @Description:
 * @Version: 2.0
 * @Author: Xing
 * @Date: 2020-05-19 12:08:09
 * @LastEditors: Xing
 * @LastEditTime: 2020-08-19 10:40:13
-->
<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
export default {
    name: "App"
};
</script>

<style lang="scss">
@import "../src/assets/css/global";
body {
    color: #333;
}
.fl {
    float: left;
}
.fr {
    float: right;
}
div {
    box-sizing: border-box;
}
ul,
li,
p {
    margin: 0;
    padding: 0;
    list-style: none;
}
.app-main > div {
    padding: 20px;
}
/*primary按钮改色*/
/*.el-button--primary {*/
/*    color: #FFF;*/
/*    background-color: #00CCB8;*/
/*    border-color: #00CCB8;*/
/*}*/
/*primary按钮改色*/
.el-button--success {
    color: #fff;
    background-color: #27d775;
    border-color: #27d775;
    /*background-color: #4090FF;*/
    /*border-color: #4090FF;*/
}
/*primary按钮改色*/
.el-button--danger {
    color: #fff;
    background-color: #ff7b76;
    border-color: #ff7b76;
}
/*tab标签页选中项改色*/
.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    // color: #00CCB8;
    color: #4090ff;

    background-color: #fff;
    border-right-color: #dcdfe6;
    border-left-color: #dcdfe6;
}
/*分页选中当前页色块改色*/
.el-pagination.is-background .el-pager li:not(.disabled).active {
    // background-color: #00CCB8;
    background-color: #4090ff;
    color: #fff;
}
/*message弹框样式*/
.el-message {
    top: 100px;
}
/* 改变table表格错位 */
body .el-table th.gutter {
    display: table-cell !important;
}
body .el-table colgroup.gutter {
    display: table-cell !important;
}
.el-table .warning-row {
    background: oldlace;
}
.el-table .success-row {
    background: #f0f9eb;
}
// 溢出滚动
.overflow-y-s {
    max-height: 200px;
    overflow-y: scroll;
}
// 鼠标手势
.cursor-p {
    cursor: pointer;
}
// 字体颜色
.color9 {
    color: #999999;
}
</style>
