<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Xing
 * @Date: 2021-02-02 19:39:00
 * @LastEditors: Xing
 * @LastEditTime: 2021-02-02 19:39:22
-->

<template>
    <div class="selectVideo-container">
        <el-dialog
            title="选择视频"
            :visible.sync="dialog"
            width="60%"
            :before-close="handleClose"
        >
            <div>
                <el-form
                    :inline="true"
                    :model="formInline"
                    class="demo-form-inline"
                >
                    <el-form-item label="搜索内容">
                        <el-input
                            v-model="formInline.search_name"
                            placeholder="请输入视频名字"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div style="display:flex;align-items: center;">
                            <el-button type="primary" @click="onSearch"
                                >查询</el-button
                            >
                            <div class="upload-box">
                                <el-upload
                                    class="avatar-uploader"
                                    :action="baseUpload"
                                    :headers="{ shop_code, token, app_id }"
                                    :show-file-list="false"
                                    :before-upload="beforeAvatarUpload"
                                    :on-success="handleAvatarSuccess"
                                    :on-progress="uploadVideoProcess"
                                    name="videoFile"
                                >
                                    <el-button type="primary"
                                        >上传视频</el-button
                                    >
                                </el-upload>
                            </div>
                            <div class="el-upload__tip">
                                <el-progress
                                    v-if="videoFlag == true"
                                    type="circle"
                                    :percentage="videoUploadPercent"
                                    style="margin-top:30px;"
                                ></el-progress>
                                请上传视频文件，且不超过200M
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
                <el-table
                    v-loading="loading"
                    :data="videoList"
                    highlight-current-row
                    style="width: 100%;"
                    @current-change="handleCurrentChange"
                    :header-cell-style="{
                        background: 'rgba(229, 229, 229, 1)',
                        color: '#4F4F4F',
                        fontSize: '13px',
                        fontWeight: '400'
                    }"
                >
                    <el-table-column
                        label="名字"
                        prop="issue_user"
                        min-width="120"
                        align="center"
                    >
                        <template slot-scope="{ row }">
                            <span>{{ row.file_name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="封面图"
                        prop="issue_user"
                        min-width="120"
                        align="center"
                    >
                        <template slot-scope="{ row }">
                            <img
                                class="cover-img"
                                :src="row.cover_url"
                                alt=""
                                srcset=""
                            />
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="视频链接"
                        prop="issue_user"
                        min-width="120"
                        align="center"
                    >
                        <template slot-scope="{ row }">
                            <span>{{ row.video_url }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label=""
                        width="120"
                        align="center"
                        fixed="right"
                    >
                        <template slot-scope="{ row }">
                            <el-button
                                type="text"
                                size="small"
                                @click="handleDel(row.video_id)"
                                >删除</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <pagination
                v-show="total_count > 0"
                :total="total_count"
                :page.sync="now_page"
                :limit.sync="page_size"
                @pagination="handleChangePage"
            />
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="handleSubmit"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Pagination from "@/components/Pagination";
export default {
    name: "SelectVideo",
    components: { Pagination },
    props: {
        dialog: {
            type: Boolean
        }
    },
    data() {
        return {
            loading: false,
            now_page: 1, // 当前页
            page_size: 10, // 每页条数
            total_count: 0, // 总条数
            videoList: [],
            choose_row: {}, //选中行

            formInline: {
                search_name: ""
            },
            token: "",
            app_id: "",
            shop_code: "",
            videoFlag: false,
            videoUploadPercent: 0
        };
    },
    watch: {
        dialog(val) {
            if (val) {
                this.getListData();
            }
        }
    },
    created() {},
    mounted() {
        this.token = localStorage.getItem("token");
        this.app_id = localStorage.getItem("app_id");
        this.shop_code = localStorage.getItem("shop_code");
    },
    methods: {
        onSearch() {
            this.page = 1;
            this.page_size = 10;
            this.getListData();
        },
        handleClose() {
            this.$emit("update:dialog", false);
        },
        // 分页
        handleChangePage(e) {
            this.now_page = e.page;
            this.page_size = e.limit;
            this.getListData();
        },
        // 获取列表
        getListData() {
            this.loading = true;
            const data = {
                search_name: this.formInline.search_name
                    ? this.formInline.search_name
                    : null,
                page: this.now_page,
                size: this.page_size
            };
            this.Api.getVideoList(data)
                .then(res => {
                    if (res.data.ret === 0) {
                        this.videoList = res.data.data.list || [];
                        this.total_count = res.data.data.total_count || 0;
                    } else {
                        this.$message.error(res.data.msg || "获取数据失败");
                    }
                })
                .catch(err => {
                    this.$message.error(`网络错误`);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleDel(video_id) {
            this.$confirm("此操作将删除该视频, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let params = {
                    video_id
                };
                this.Api.delVideoAdmin(params)
                    .then(res => {
                        if (res.data.ret === 0) {
                            this.$message({
                                message: "删除成功",
                                type: "success"
                            });
                            this.page = 1;
                            this.getListData();
                        } else {
                            this.$message.error(res.data.msg || "删除失败");
                        }
                    })
                    .catch(err => {
                        this.$message.error(`删除失败`);
                    });
            });
        },
        handleCurrentChange(val) {
            // console.log("ddd", val);
            this.choose_row = val;
        },
        handleSubmit() {
            if (!this.choose_row.video_id) {
                return this.$message.error("请选择视频");
            }
            this.$emit("submit", this.choose_row);
        },
        beforeAvatarUpload(file) {
            const isLt200M = file.size / 1024 / 1024 < 200;
            if (
                [
                    "video/mp4",
                    "video/ogg",
                    "video/flv",
                    "video/avi",
                    "video/wmv",
                    "video/rmvb"
                ].indexOf(file.type) == -1
            ) {
                this.$message.error("请上传正确的视频格式");
                return false;
            }
            if (!isLt200M) {
                this.$message.error("上传视频大小不能超过200MB哦!");
                return false;
            }
        },
        handleAvatarSuccess(res) {
            this.videoFlag = false;
            this.videoUploadPercent = 0;
            if (res.ret == 0) {
                this.$message({
                    message: "上传成功",
                    type: "success"
                });
                this.getListData();
            } else {
                this.$message.error(`${res.msg || "上传失败"}`);
            }
        },
        uploadVideoProcess(event, file, fileList) {
            this.videoFlag = true;
            this.videoUploadPercent = Math.floor(event.percent);
        }
    }
};
</script>
<style lang="scss" scoped>
.selectVideo-container {
    .cover-img {
        width: 100px;
        height: 50px;
    }
    .upload-box {
        margin: 0 10px;
    }
    /deep/ .el-dialog__body {
        padding: 0 20px;
    }
    .pagination-container {
        padding: 0;
    }
}
</style>
