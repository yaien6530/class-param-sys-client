<template>
<!--    <div class="upload-container">-->
<!--        <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">-->
<!--            添加图片-->
<!--        </el-button>-->
<!--        <el-dialog :visible.sync="dialogVisible">-->
<!--            <el-button @click="uploadDialogVisible = false">-->
<!--                取消-->
<!--            </el-button>-->
<!--            <el-button type="primary" @click="handleSubmit">-->
<!--                确定-->
<!--            </el-button>-->
<!--        </el-dialog>-->
<!--        -->
<!--        <el-dialog :visible.sync="uploadDialogVisible">-->
<!--            <el-upload-->
<!--                :multiple="true"-->
<!--                :file-list="fileList"-->
<!--                :show-file-list="true"-->
<!--                :on-remove="handleRemove"-->
<!--                :on-success="handleSuccess"-->
<!--                :before-upload="beforeUpload"-->
<!--                class="editor-slide-upload"-->
<!--                :action="baseUploadUrl"-->
<!--                list-type="picture-card"-->
<!--            >-->
<!--                <el-button size="small" type="primary">-->
<!--                    点击上传-->
<!--                </el-button>-->
<!--            </el-upload>-->
<!--            <el-button @click="uploadDialogVisible = false">-->
<!--                取消-->
<!--            </el-button>-->
<!--            <el-button type="primary" @click="handleSubmit">-->
<!--                上传-->
<!--            </el-button>-->
<!--        </el-dialog>-->
<!--    </div>-->

    <div class="upload-container">
        <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
            添加图片
        </el-button>
        <el-dialog :visible.sync="dialogVisible" append-to-body class="upload-dialog-container" width="827px">
            <el-upload
                    :multiple="true"
                    :file-list="fileList"
                    :show-file-list="true"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    :before-upload="beforeUpload"
                    class="editor-slide-upload"
                    :action="upload_url"
                    :headers="upImgInfo"
                    name="imageFile"
                    list-type="picture-card"
            >
                <el-button size="small" type="primary">
                    点击上传
                </el-button>
            </el-upload>
            <el-button type="primary" class="fr" style="margin-top: 20px;margin-right: 10px;" @click="handleSubmit">
                完成
            </el-button>
        </el-dialog>
    </div>
</template>

<script>
// import { getToken } from 'api/qiniu'

    export default {
        name: 'EditorSlideUpload',
        props: {
            color: {
                type: String,
                default: '#1890ff'
            }
        },
        data() {
            return {
                upImgInfo: {
                    // 上传图片的额外参数
                    token: localStorage.getItem('token'),
                    app_id: localStorage.getItem("app_id"),
                    shop_code: localStorage.getItem("shop_code")
                },
                dialogVisible: false,
                // uploadDialogVisible: false,
                listObj: {},
                fileList: [],
                token: '', // upload请求头
                app_id: '',
                upload_url: ''
            };
        },
        mounted() {
            this.token = localStorage.getItem('token');
            this.app_id = this.commonAppId;
            this.upload_url = this.baseUploadUrl + '?app_id=' + this.app_id;
        },
        methods: {
            checkAllSuccess() {
                return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess);
            },
            handleSubmit() {
                const arr = Object.keys(this.listObj).map(v => this.listObj[v]);
                if (!this.checkAllSuccess()) {
                    this.$message('请等待所有图像成功上传。如果有网络问题，请刷新页面并重新上传！');
                    return;
                }
                this.$emit('successCBK', arr);
                this.listObj = {};
                this.fileList = [];
                // this.uploadDialogVisible = false;
                this.dialogVisible = false;
            },
            handleSuccess(response, file) {
                const uid = file.uid;
                const objKeyArr = Object.keys(this.listObj);
                for (let i = 0, len = objKeyArr.length; i < len; i++) {
                    if (this.listObj[objKeyArr[i]].uid === uid) {
                        this.listObj[objKeyArr[i]].url = response.data.url;
                        this.listObj[objKeyArr[i]].hasSuccess = true;
                        return;
                    }
                }
            },
            handleRemove(file) {
                const uid = file.uid;
                const objKeyArr = Object.keys(this.listObj);
                for (let i = 0, len = objKeyArr.length; i < len; i++) {
                    if (this.listObj[objKeyArr[i]].uid === uid) {
                        delete this.listObj[objKeyArr[i]];
                        return;
                    }
                }
            },
            beforeUpload(file) {
                const _self = this;
                const _URL = window.URL || window.webkitURL;
                const fileName = file.uid;
                this.listObj[fileName] = {};
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = _URL.createObjectURL(file);
                    img.onload = function() {
                        _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height };
                    };
                    resolve(true);
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /*/deep/ .el-upload--picture-card {*/
  /*  width: 100%;*/
  /*}*/
}
</style>
