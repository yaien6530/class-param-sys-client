

<template>
  <div class="edit-common-container">
    <el-form label-width="100px">
      <el-form-item label="海报图：">
        <div class="choose-picture-180">
          <img v-show="poster_url" :src="poster_url" class="img" />
          <p v-show="!poster_url"><i class="el-icon-plus icon" /></p>
          <selectSingleImage slots @successCBK="successMap">
            <template scope="{ openDetail }">
              <div class="select-image-component" @click="openDetail()" />
            </template>
          </selectSingleImage>
        </div>
        <div class="alert-box">建议尺寸：275 x 320</div>
      </el-form-item>
    </el-form>
    <div class="bottom-btn">
      <el-button type="primary" @click="submitData">保存</el-button>
    </div>
  </div>
</template>

<script>
import selectSingleImage from "@/components/common/selectSingleImage";
export default {
  components: { selectSingleImage },
  data() {
    return {
      poster_url: '',
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    // 获取数据
    getDetail() {
      this.mapLoading = true;
      this.Api.getPoster().then(res => {
        if (res.data.ret === 0) {
          const resData = res.data.data || {};
          // this.poster_id = resData.poster_id || 0;
          this.poster_url = resData.poster_url || '';
        } else {
          this.$message.error(`获取海报图失败，${res.data.msg}`);
        }
      }).finally(() => {
        this.mapLoading = false;
      });
    },
    // 保存数据
    submitData() {
      const data = {
        url: this.poster_url
      }
      this.Api.createOrChangePoster(data).then(res => {
        if (res.data.ret === 0) {
          this.$message.success('保存成功');
          this.getDetail();
        } else {
          this.$message.error(`保存失败，${res.data.msg}`);
        }
      }).finally(() => {
        this.setLoading = false;
      });
    },

    // 上传图片
    successMap(val) {
      this.poster_url = val.url;
    }
  },
};
</script>

<style lang="scss">
</style>
