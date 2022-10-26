<template>
    <el-dialog
        :visible.sync="isShowImageDialog"
        @closed="clearImg"
    >
        <el-carousel indicator-position="outside" height="600px">
            <el-carousel-item v-for="(src,index) in imgs" :key="index">
                <img :src="src" style="max-width: 100%;max-height: 100%;display: block; margin: 0 auto;">
            </el-carousel-item>
        </el-carousel>
    </el-dialog>
</template>

<script>
    export default {
        name: 'ImgPreview',
        data() {
            return {
                imgs: '',
                isShowImageDialog: false
            };
        },
        methods: {
            clearImg() {
                this.imgs = null;
            }
        }
    };
</script>

<style scoped>

</style>
