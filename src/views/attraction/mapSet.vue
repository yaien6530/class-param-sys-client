

<template>
  <div class="edit-common-container">
    <el-form label-width="100px">
      <el-form-item label="地图：">
        <div class="choose-picture-180">
          <img v-show="image_vo.url" :src="image_vo.url" class="img" />
          <p v-show="!image_vo.url"><i class="el-icon-plus icon" /></p>
          <selectSingleImage slots @successCBK="successMap">
            <template scope="{ openDetail }">
              <div class="select-image-component" @click="openDetail()" />
            </template>
          </selectSingleImage>
        </div>
        <div class="alert-box">建议尺寸：2000 x 2000</div>
      </el-form-item>
    </el-form>
    <div class="bottom-btn">
      <el-button type="primary" @click="saveMap">保存</el-button>
    </div>
  </div>
</template>

<script>
import selectSingleImage from "@/components/common/selectSingleImage";
export default {
  components: { selectSingleImage },
  data() {
    return {
      route_id: 0,
      image_vo: { // 地图
        image_id: 0,
        url: ''
      },
    };
  },
  created() {
    this.getMap();
  },
  methods: {
    // 获取地图图片
    getMap() {
      this.mapLoading = true;
      this.Api.getMainMap().then(res => {
        if (res.data.ret === 0) {
          const resData = res.data.data || {};
          this.route_id = resData.route_id || 0;
          this.image_vo = resData.image_vo ||  { image_id: 0, url: '' }
        } else {
          this.$message.error(`获取地图图片失败，${res.data.msg}`);
        }
      }).finally(() => {
        this.mapLoading = false;
      });
    },
    // 保存地图
    saveMap() {
      const data = {
        route_id: this.route_id,
        image_vo: this.image_vo
      }
      this.Api.createOrChangeMapImage(data).then(res => {
        if (res.data.ret === 0) {
          this.$message.success('保存成功');
          this.getMap();
        } else {
          this.$message.error(`保存失败，${res.data.msg}`);
        }
      }).finally(() => {
        this.setLoading = false;
      });
    },

    // 上传图片
    successMap(val) {
      this.image_vo = {
        image_id: val.image_id,
        url: val.url
      }
    }
  },
};
</script>

<style lang="scss">
</style>
