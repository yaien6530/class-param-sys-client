<template>
    <div class="select-image-container">
        <el-button
            v-if="!slots"
            :style="{ background: color, borderColor: color }"
            icon="el-icon-upload"
            size="mini"
            type="primary"
            @click="dialogVisible = true"
        >
            添加图片
        </el-button>
        <slot :openDetail="openDetail" />
        <el-dialog
            class="select-image-dialog"
            append-to-body
            :visible.sync="dialogVisible"
            title="选择图片"
            width="820px"
            top="5vh"
            :close-on-click-modal="false"
        >
            <div class="img-content">
                <div class="left-content fl">
                    <div class="left-top-content">
                        <p>
                            {{
                                active_group_item
                                    ? active_group_item.group_name
                                    : "全部"
                            }}
                            (本页{{
                                img_list ? img_list.length || 0 : 0
                            }}张图片)
                        </p>
                        <el-button
                            type="primary"
                            @click="uploadDialogVisible = true"
                        >
                            上传图片
                        </el-button>
                    </div>
                    <div class="left-control">
                        <div class="all-select" @click="handleAllSelect">
                            <span :class="{ all_select }"
                                ><i class="el-icon-check"/></span
                            >全选
                        </div>
                        <p @click="handleMoveGroupImage">修改分组</p>
                        <p @click="handleDeleteImages">删除</p>
                    </div>
                    <ul v-loading="loading" class="img-list-content">
                        <li
                            v-for="(item, index) in img_list"
                            :key="index"
                            class="img-list"
                            @click="selectImgItem(item)"
                        >
                            <div class="imgBox">
                                <img :src="item.url" alt="" />
                            </div>
                            <div v-if="item.selected" class="img-selected">
                                <i class="el-icon-circle-check" />
                            </div>
                            <div
                                v-if="item.active_index"
                                class="img-active-index"
                            >
                                {{ item.active_index }}
                            </div>
                        </li>
                    </ul>
                    <el-pagination
                        v-show="total > 0"
                        layout="prev, pager, next, total"
                        :current-page.sync="now_page"
                        :page-size="page_size"
                        :total="total"
                        @current-change="getGoodsPage"
                    />
                </div>
                <div class="right-content fr">
                    <div class="add-group" @click="handleCreateImageGroup">
                        添加分组 <i class="el-icon-circle-plus" />
                    </div>
                    <div class="group-list">
                        <div
                            class="group-name-content"
                            :class="{ active: active_group_index == null }"
                            @click="handleSelectImgGroup()"
                        >
                            全部
                        </div>
                    </div>
                    <div
                        v-for="(item, index) in img_group"
                        :key="index"
                        class="group-list"
                    >
                        <div
                            class="group-name-content"
                            :class="{ active: index == active_group_index }"
                            @click="handleSelectImgGroup(item, index)"
                        >
                            {{ item.group_name }}
                            <div class="edit-btn">
                                <span
                                    @click.stop="
                                        re_name = true;
                                        re_name_input = item.group_name;
                                        re_name_index = index;
                                    "
                                    >重命名</span
                                >
                                <span
                                    style="margin-right: 0;"
                                    @click.stop="handleDeleteImageGroup(item)"
                                    >删除</span
                                >
                            </div>
                        </div>
                        <div
                            v-if="index == re_name_index && re_name"
                            class="group-edit-content"
                        >
                            <el-input v-model="re_name_input" />
                            <el-button
                                type="primary"
                                size="mini"
                                style="margin-left: 50px;"
                                @click="reNameImageGroup(item)"
                                >确定</el-button
                            >
                            <el-button
                                size="mini"
                                @click="
                                    re_name = false;
                                    re_name_input = '';
                                "
                                >取消</el-button
                            >
                        </div>
                    </div>
                </div>
            </div>
            <el-button
                style="margin-left: 625px;margin-top: 10px;"
                @click="dialogVisible = false"
            >
                取消
            </el-button>
            <el-button
                type="primary"
                style="margin-top: 10px;"
                @click="handlefinishSelect"
            >
                确定
            </el-button>

            <el-dialog
                width="400px"
                class="create-group-content"
                title="新建图片组"
                :visible.sync="createGroupVisible"
                append-to-body
                @closed="
                    createGroupVisible = false;
                    new_name_input = '';
                "
            >
                <el-input
                    v-model="new_name_input"
                    placeholder="输入图片分组名称"
                    style="margin-bottom: 40px;"
                />
                <el-button
                    type="primary"
                    size="mini"
                    style="float: right; margin-left: 10px"
                    @click="createImageGroup"
                    >确定</el-button
                >
                <el-button
                    size="mini"
                    style="float: right;"
                    @click="
                        createGroupVisible = false;
                        new_name_input = '';
                    "
                    >取消</el-button
                >
            </el-dialog>

            <el-dialog
                width="400px"
                class="create-group-content"
                title="图片批量分组"
                :visible.sync="moveImageVisible"
                append-to-body
                @closed="
                    moveImageVisible = false;
                    move_image_group = null;
                "
            >
                <el-select
                    v-model="move_image_group"
                    placeholder="请选择图片分组"
                    style="margin-bottom: 40px;display: block;"
                >
                    <el-option
                        v-for="(item, index) in img_group"
                        :key="index"
                        :label="item.group_name"
                        :value="item.image_group_id"
                    />
                </el-select>
                <el-button
                    type="primary"
                    size="mini"
                    style="float: right; margin-left: 10px"
                    @click="moveImageGroup"
                    >确定</el-button
                >
                <el-button
                    size="mini"
                    style="float: right;"
                    @click="
                        moveImageVisible = false;
                        move_image_group = null;
                    "
                    >取消</el-button
                >
            </el-dialog>

            <el-dialog
                :visible.sync="uploadDialogVisible"
                append-to-body
                class="upload-dialog-container"
                width="827px"
            >
                <el-upload
                    :multiple="true"
                    :file-list="fileList"
                    :show-file-list="true"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    :before-upload="beforeUpload"
                    class="editor-slide-upload"
                    :action="
                        `${baseUploadShopUrl}?image_group_id=${
                            active_group_item
                                ? active_group_item.image_group_id || ''
                                : ''
                        }`
                    "
                    :headers="{ shop_code, token, app_id }"
                    list-type="picture-card"
                    name="imageFile"
                >
                    <el-button size="small" type="primary">
                        点击上传
                    </el-button>
                </el-upload>
                <el-button
                    type="primary"
                    class="fr"
                    style="margin-top: 20px;margin-right: 10px;"
                    @click="handleSubmit"
                >
                    完成
                </el-button>
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
    name: "SelectImages",
    components: { Pagination },
    props: {
        color: {
            type: String,
            default: "#1890ff"
        },
        slots: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            token: "", // upload请求头
            shop_code: "", // upload请求头
            app_id: "",
            dialogVisible: false,
            uploadDialogVisible: false,
            createGroupVisible: false,
            moveImageVisible: false,
            listObj: {},
            fileList: [],
            active_group_index: null, // 当前选中分组下标
            active_group_item: null, // 当前选中分组下标
            img_group: [], // 图片分组列表
            img_list: [], // 选中分组对应图片列表
            all_select: false, // 全选
            re_name: false, // 重命名
            re_name_index: null, // 重命名选项下标
            re_name_input: "", // 重命名输入框内容
            new_name_input: "", // 创建图片组输入框内容
            move_image_group: null, // 图片修改分组选中的组id
            submit_img_list: [], // 勾选的图片列表（提交时才赋值）
            loading: false,
            now_page: 1, // 当前页
            page_size: 30, // 每页条数
            total: 0 // 订单条数
        };
    },
    watch: {
        dialogVisible(val) {
            if (val) {
                this.getImageGroupList();
                this.getImageListByGroup();
            }
        },
        uploadDialogVisible(val) {
            if (!val) {
                this.getImageListByGroup();
            }
        }
    },
    created() {
        this.getImageGroupList();
    },
    mounted() {
        this.token = localStorage.getItem("token");
        this.app_id = localStorage.getItem("app_id");
        this.shop_code = localStorage.getItem("shop_code");
    },
    methods: {
        openDetail() {
            this.dialogVisible = true;
            this.fileList = [];
        },
        // 检查图片是否全部上传完成
        checkAllSuccess() {
            return Object.keys(this.listObj).every(
                item => this.listObj[item].hasSuccess
            );
        },
        handleSubmit() {
            // if (!this.checkAllSuccess()) {
            //     this.$message('请等待所有图像成功上传。如果有网络问题，请刷新页面并重新上传！');
            //     return;
            // }
            this.fileList = [];
            this.uploadDialogVisible = false;
            this.getImageListByGroup();
        },
        // 图片上传成功
        handleSuccess(response, file) {
            const uid = file.uid;
            const objKeyArr = Object.keys(this.listObj);
            if (response.ret === 0) {
                for (let i = 0, len = objKeyArr.length; i < len; i++) {
                    if (this.listObj[objKeyArr[i]].uid === uid) {
                        this.listObj[objKeyArr[i]].url = response.data.url;
                        this.listObj[objKeyArr[i]].hasSuccess = true;
                        return;
                    }
                }
            }
        },
        // 移除图片
        handleRemove(file) {},
        // 图片上传前
        beforeUpload(file) {
            const _self = this;
            const _URL = window.URL || window.webkitURL;
            const fileName = file.uid;
            this.listObj[fileName] = {};
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = _URL.createObjectURL(file);
                img.onload = function() {
                    _self.listObj[fileName] = {
                        hasSuccess: false,
                        uid: file.uid,
                        width: this.width,
                        height: this.height
                    };
                };
                resolve(true);
            });
        },
        // 点击选择图片分组
        handleSelectImgGroup(item, index) {
            if (!index || this.active_group_index !== index) {
                this.re_name = false;
                this.re_name_input = "";
            }
            if (index === 0) {
                this.active_group_index = index;
            } else {
                this.active_group_index = index || null;
            }
            this.active_group_item = item || null;
            this.getImageListByGroup();
        },
        handleCreateImageGroup() {
            this.createGroupVisible = true;
            this.new_name_input = "";
        },
        // 点击删除图片分组
        handleDeleteImageGroup(item) {
            console.log("删除：", item.image_group_id);
            this.$confirm("删除图片分组?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.Api.delectImgGroup({
                        del_flag: 0,
                        image_group_id: item.image_group_id
                    })
                        .then(res => {
                            console.log(res);
                            if (res.data.ret === 0) {
                                this.$message({
                                    type: "success",
                                    message: "删除成功!"
                                });
                            } else {
                                this.$message.error(
                                    `删除失败！，错误码：${res.data.code ||
                                        res.data.ret ||
                                        ""}`
                                );
                            }
                            this.getImageGroupList();
                        })
                        .catch(() => {
                            this.$message.error("删除失败！");
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    });
                });
        },
        // 获取图片分组列表
        getImageGroupList() {
            if (this.dialogVisible) {
                this.Api.getImageGroupList()
                    .then(res => {
                        if (res.data.ret === 0) {
                            this.img_group = res.data.data || [];
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        },
        // 创建图片分组
        createImageGroup() {
            if (this.new_name_input) {
                const data = {
                    group_name: this.new_name_input,
                    shop_code: localStorage.getItem("shop_code")
                };
                this.Api.createImageGroup(data)
                    .then(res => {
                        if (res.data.ret === 0) {
                            this.$message({
                                type: "success",
                                message: "创建成功!"
                            });
                            this.getImageGroupList();
                            this.createGroupVisible = false;
                            this.new_name_input = "";
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
            }
        },
        // 根据图片分组获取图片列表
        getImageListByGroup() {
            const shop_code = localStorage.getItem("shop_code");
            const image_group_id =
                this.active_group_index || this.active_group_index === 0
                    ? this.img_group[this.active_group_index].image_group_id ||
                      null
                    : null;
            const params = {
                image_group_id,
                page: this.now_page,
                size: this.page_size
            };
            this.loading = true;
            this.img_list = [];
            this.Api.getImageListByGroup(params)
                .then(res => {
                    if (res.data.ret === 0) {
                        const data = res.data.data;
                        this.total = data.total_count;
                        this.img_list = data.list;
                        this.img_list.map((item, index) => {
                            item.selected = false;
                            item.active_index = 0;
                        });
                        this.$forceUpdate();
                    } else {
                        this.img_list = [];
                    }
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 重命名
        reNameImageGroup(item) {
            this.Api.updateImageGroup({
                image_group_id: item.image_group_id,
                group_name: this.re_name_input
            }).then(res => {
                if (res.data.ret === 0) {
                    item.group_name = this.re_name_input;
                    this.re_name = false;
                    this.re_name_input = false;
                    this.$message({
                        type: "success",
                        message: "修改分组名称成功!"
                    });
                } else {
                    this.$message.error("修改分组名称失败！");
                }
            });
        },
        // 点击选中图片
        selectImgItem(item) {
            item.selected = !item.selected;
            if (item.selected) {
                // item.active_index = 30;
                let max_index = 0;
                this.img_list.map((it, index) => {
                    if (it.active_index > max_index) {
                        max_index = it.active_index;
                    }
                });
                item.active_index = max_index + 1;
            } else {
                const del_index = item.active_index;
                this.img_list.map((it, index) => {
                    if (it.active_index > del_index) {
                        it.active_index--;
                    }
                });
                item.active_index = 0;
            }
            this.$forceUpdate();
        },
        // 点击全选
        handleAllSelect() {
            this.all_select = !this.all_select;
            this.img_list.map(item => {
                item.selected = this.all_select;
            });
            if (this.all_select) {
                let max_index = 0;
                let i = 1;
                this.img_list.map((it, index) => {
                    if (it.active_index > max_index) {
                        max_index = it.active_index;
                    }
                });
                this.img_list.map((it, index) => {
                    if (!it.active_index) {
                        it.active_index = max_index + i;
                        i++;
                    }
                });
            } else {
                this.img_list.map((it, index) => {
                    it.active_index = 0;
                });
            }
            this.$forceUpdate();
        },
        // 点击确定按钮，完成图片选择等一系列操作，并关闭弹框
        handlefinishSelect() {
            this.submit_img_list = this.img_list.filter(item => {
                return item.selected;
            });
            const compare = function(prop) {
                return function(obj1, obj2) {
                    const val1 = obj1[prop];
                    const val2 = obj2[prop];
                    if (val1 < val2) {
                        return -1;
                    } else if (val1 > val2) {
                        return 1;
                    } else {
                        return 0;
                    }
                };
            };
            this.submit_img_list.sort(compare("active_index"));
            console.log("图片排序：", this.submit_img_list);
            this.$emit("successCBK", this.submit_img_list);
            this.dialogVisible = false;
        },
        // 批量删除图片
        handleDeleteImages() {
            const img_objs = this.img_list.filter(item => {
                return item.selected;
            });
            const img_ids = [];
            img_objs.map(item => {
                img_ids.push(item.image_id);
            });
            if (!img_ids.length) {
                this.$message({
                    type: "info",
                    message: "未选中任何图片!"
                });
                return;
            }
            this.$confirm(`删除选中的${img_ids.length}张图片?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.Api.delectImageByShop(img_ids)
                        .then(res => {
                            console.log(res);
                            if (res.data.ret === 0) {
                                this.$message({
                                    type: "success",
                                    message: "删除成功!"
                                });
                                this.getImageListByGroup();
                            } else {
                                this.$message.error(
                                    `删除失败！，错误码：${res.data.code ||
                                        res.data.ret ||
                                        ""}`
                                );
                            }
                        })
                        .catch(() => {
                            this.$message.error("删除失败！");
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    });
                });
        },
        // 图片批量分组
        moveImageGroup() {
            const img_objs = this.img_list.filter(item => {
                return item.selected;
            });
            const img_ids = [];
            img_objs.map(item => {
                img_ids.push(item.image_id);
            });
            if (!img_ids.length) {
                this.$message({
                    type: "info",
                    message: "未选中任何图片!"
                });
                return;
            }
            const data = {
                image_group_id: this.move_image_group,
                image_id_list: img_ids
            };
            this.Api.changeImageGroup(data)
                .then(res => {
                    if (res.data.ret === 0) {
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                        this.moveImageVisible = false;
                        this.getImageListByGroup();
                    }
                })
                .catch(() => {});
        },
        // 点击修改分组
        handleMoveGroupImage() {
            this.moveImageVisible = true;
        },
        // 分页触发
        getGoodsPage(page) {
            this.now_page = page;
            this.getImageListByGroup();
        }
    }
};
</script>

<style lang="scss">
.select-image-dialog {
    margin-bottom: 20px;
    div {
        box-sizing: border-box !important;
    }
    .img-content {
        padding: 0 0 15px;
        height: 550px;
        overflow: hidden;
        border-bottom: 1px solid #eee;
        .left-content {
            width: 552px;
            height: 100%;
            border-top: 1px solid #eee;
            border-bottom: 1px solid #eee;
            .left-top-content {
                height: 46px;
                padding-left: 14px;
                position: relative;
                p {
                    height: 46px;
                    line-height: 46px;
                    font-size: 14px;
                    color: #666;
                }
                .el-button {
                    position: absolute;
                    top: 6px;
                    right: 16px;
                }
            }
            .left-control {
                height: 34px;
                background-color: #f8f8f8;
                overflow: hidden;
                .all-select {
                    width: 48px;
                    height: 16px;
                    float: left;
                    font-size: 12px;
                    margin: 9px 10px 9px 14px;
                    cursor: pointer;
                    line-height: 18px;
                    span {
                        width: 16px;
                        height: 16px;
                        display: block;
                        border: 1px solid #4091fd;
                        float: left;
                        margin-right: 4px;
                        border-radius: 2px;
                        &.all_select {
                            background-color: #4091fd;
                        }
                    }
                    i {
                        font-size: 12px;
                        color: #fff;
                        display: block;
                        line-height: 15px;
                        text-align: center;
                    }
                }
                > p {
                    float: left;
                    margin: 9px 10px 9px 10px;
                    height: 16px;
                    line-height: 16px;
                    cursor: pointer;
                    color: #4091fd;
                }
            }
            ul.img-list-content {
                margin-top: 10px;
                overflow: auto;
                height: 400px;
                li.img-list {
                    float: left;
                    margin-right: 10px;
                    margin-bottom: 10px;
                    cursor: pointer;
                    position: relative;
                    .imgBox {
                        width: 100px;
                        height: 100px;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .imgBox:hover {
                        background-color: #fafafa;
                    }
                    .img-selected {
                        position: absolute;
                        top: 0;
                        left: 0;
                        background-color: rgba(0, 0, 0, 0.3);
                        i {
                            display: block;
                            width: 100px;
                            height: 100px;
                            font-size: 40px;
                            line-height: 100px;
                            text-align: center;
                            color: #fff;
                        }
                    }
                    .img-active-index {
                        position: absolute;
                        top: 5px;
                        right: 5px;
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        line-height: 20px;
                        text-align: center;
                        background-color: #0b90fe;
                        color: #fff;
                    }
                }
            }
            ul.img-list-content::-webkit-scrollbar {
                display: none;
            }
        }
        .right-content {
            width: 228px;
            height: 100%;
            border: 1px solid #eee;
            overflow: auto;
            .add-group {
                height: 40px;
                line-height: 40px;
                cursor: pointer;
                text-align: center;
                color: #4091fd;
                i {
                    font-size: 16px;
                }
            }
            .group-list {
                overflow: hidden;
                .group-name-content {
                    height: 40px;
                    line-height: 40px;
                    background-color: #f4f5f9;
                    position: relative;
                    padding-left: 16px;
                    cursor: pointer;
                    &.active {
                        background-color: #a3f1e9;
                    }
                    .edit-btn {
                        width: 82px;
                        position: absolute;
                        top: 0;
                        right: 0;
                        span {
                            color: #4091fd;
                            line-height: 40px;
                            font-size: 12px;
                            padding: 6px 0;
                            margin-right: 10px;
                            cursor: pointer;
                        }
                    }
                }
                .group-name-content:hover {
                    background-color: #f9fafe;
                    &.active {
                        background-color: #a3f1e9;
                    }
                }
                .group-edit-content {
                    height: 75px;
                    background-color: #fff;
                    border-bottom: 1px solid #eee;
                    .el-input {
                        width: 178px;
                        margin: 4px 20px;
                        input {
                            height: 28px;
                            font-size: 12px;
                            line-height: 28px;
                        }
                    }
                    .el-button {
                        margin-top: 8px;
                        padding: 5px 10px;
                    }
                }
            }
        }
        .right-content::-webkit-scrollbar {
            display: none;
        }
    }
}
.upload-dialog-container {
    .el-dialog__body {
        overflow: hidden;
    }
}
.create-group-content {
    .el-dialog__body {
        overflow: hidden;
    }
}
.img-content {
    .el-pagination {
        margin-top: 6px;
        text-align: center;
    }
}
</style>
