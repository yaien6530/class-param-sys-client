<template>
    <div class="selectVideo-container">
        <el-dialog title="选择音频" :visible.sync="dialog" width="60%" :before-close="handleClose">
            <div>
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="搜索内容">
                        <el-input v-model="formInline.search_name" placeholder="请输入音频名字" />
                    </el-form-item>
                    <el-form-item>
                        <div style="display:flex;align-items: center;">
                            <el-button type="primary" @click="onSearch">查询</el-button>
                            <div class="upload-box">
                                <el-upload
                                    class="avatar-uploader"
                                    :action="baseAudioUrl"
                                    :headers="{ shop_code, token, app_id }"
                                    :show-file-list="false"
                                    :before-upload="beforeAvatarUpload"
                                    :on-success="handleAvatarSuccess"
                                    :on-progress="uploadVideoProcess"
                                    name="audioFile"
                                >
                                    <el-button type="primary">上传音频</el-button>
                                </el-upload>
                            </div>
                            <div class="el-upload__tip">
                                <el-progress v-if="videoFlag == true" type="circle" :percentage="videoUploadPercent" style="margin-top:30px;" />
                                请上传mp3文件，且不超过10M
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
                <el-table
                    v-loading="loading"
                    :data="audioList"
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
                    <el-table-column label="名字" prop="file_name" min-width="120" align="center" />
                    <el-table-column label="链接" prop="audio_url" min-width="180" align="center" />
                    <el-table-column label="操作" width="120" align="center" fixed="right">
                        <template slot-scope="{ row }">
                            <el-button type="text" size="small" @click="handleDel(row.audio_id)">删除</el-button>
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
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Pagination from "@/components/Pagination";
export default {
    name: "SelectAudio",
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
            audioList: [],
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
    created() {
        this.token = localStorage.getItem("token");
        this.app_id = localStorage.getItem("app_id");
        this.shop_code = localStorage.getItem("shop_code");
    },
    mounted() {
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
                search_name: this.formInline.search_name ? this.formInline.search_name : null,
                page: this.now_page,
                size: this.page_size
            };
            this.Api.getAudioList(data)
                .then(res => {
                    if (res.data.ret === 0) {
                        this.audioList = res.data.data.list || [];
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
        handleDel(audio_id) {
            this.$confirm("此操作将删除该音频, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let params = {
                    audio_id
                };
                this.Api.delAudioAdmin(params)
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
            this.choose_row = val;
        },
        handleSubmit() {
            if (!this.choose_row.audio_id) {
                return this.$message.error("请选择音频");
            }
            this.$emit("submit", this.choose_row);
        },
        beforeAvatarUpload(file) {
            const isLt200M = file.size / 1024 / 1024 < 10;
            if (
                [ "audio/mp3", "audio/mpeg" ].indexOf(file.type) == -1
            ) {
                this.$message.error("请上传正确的音频格式");
                return false;
            }
            if (!isLt200M) {
                this.$message.error("上传音频大小不能超过10MB哦!");
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
