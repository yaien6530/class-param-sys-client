

<template>
  <div class="edit-common-container">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="150px">
      <el-form-item label="厨师名称：" prop="chef_name">
        <el-input v-model="formData.chef_name" class="w300" />
      </el-form-item>
      <el-form-item label="价格：" prop="money">
        <el-input v-model="formData.money" class="w300" />
      </el-form-item>
      <el-form-item label="联系电话：" prop="phone">
        <el-input v-model="formData.phone" class="w300" />
      </el-form-item>
      <el-form-item label="主图：" prop="head_img_url">
        <div class="choose-picture-80">
          <img v-show="formData.head_img_url" :src="formData.head_img_url" class="img" />
          <p v-show="!formData.head_img_url"><i class="el-icon-plus icon" /></p>
          <selectSingleImage slots @successCBK="successSingle">
            <template scope="{ openDetail }">
              <div class="select-image-component" @click="openDetail()" />
            </template>
          </selectSingleImage>
        </div>
        <div class="alert-box">建议尺寸：1 : 1</div>
      </el-form-item>
      <el-form-item label="厨师图片：" prop="img_url_list">
        <div class="photo-content-80">
          <div v-for="(item, index) in formData.img_url_list" :key="index" class="photo-list">
            <img :src="item" />
            <div class="photo-delete-content">
              <i class="el-icon-delete" @click="removeImg(index)" />
            </div>
          </div>
          <selectImages slots @successCBK="successCBKs">
            <template scope="{ openDetail }">
              <div class="photo-list photo-add-list" @click="openDetail()">+</div>
            </template>
          </selectImages>
        </div>
        <div class="alert-box">建议尺寸：105 x 80</div>
      </el-form-item>

      <el-form-item label="图文详情" prop="content">
        <tinymce v-model="formData.content" :height="500" :width="580" />
      </el-form-item>
    </el-form>

    <div class="bottom-btn">
      <el-button @click="goBack">返回</el-button>
      <el-button type="primary" @click="saveData('ruleForm')">保存</el-button>
    </div>

  </div>
</template>

<script>
import selectImages from "@/components/common/SelectImages";
import selectSingleImage from "@/components/common/selectSingleImage";
import Tinymce from '@/components/Tinymce';
export default {
  components: { selectImages, selectSingleImage, Tinymce },
  data() {
    return {
      rules: {
        chef_name: [
          { required: true, message: '请输入厨师名称', trigger: 'blur' }
        ],
        money: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
      },

      formData: {
        chef_id: 0,
        chef_name: '', // 厨师名称
        money: '', // 厨师价格
        phone: '', // 联系电话
        head_img_url: '', // 主图
        img_url_list: [], // 厨师图片列表
        content: '', // 厨师图文详情
      },

      getLoading: false,
      setLoading: false,
    };
  },
  created() {
    let chef_id = Number(this.$route.query.chef_id);
    if (chef_id) {
      this.getData(chef_id);
    }
  },
  mounted() {
  },
  methods: {
    // 获取数据
    getData(chef_id) {
      const params = {
        chef_id
      }
      this.getLoading = true;
      this.Api.geChefDetail(params).then(res => {
        if (res.data.ret === 0) {
          const resData = res.data.data || {};
          this.formData = {
            chef_id: resData.chef_id || null,
            chef_name: resData.chef_name || '',
            money: resData.money || '',
            phone: resData.phone || '',
            content: resData.content || '',
            head_img_url: resData.head_img_url || '',
            img_url_list: resData.img_url_list || [],
          }
        } else {
          this.$message.error(`获取数据失败，${res.data.msg}`);
        }
      }).finally(() => {
        this.getLoading = false;
      });
    },
    // 保存数据
    saveData() {
      this.$refs['formData'].validate((valid) => {
        if (!valid) return;
        
        let formData = JSON.parse(JSON.stringify(this.formData));
        formData.money = Number(formData.money) || 0;
        
        this.setLoading = true;
        this.Api.createOrChangChef(formData).then(res => {
          if (res.data.ret === 0) {
            this.$message.success('保存成功');
            this.goBack();
          } else {
            this.$message.error(`保存失败，${res.data.msg}`);
          }
        }).finally(() => {
          this.setLoading = false;
        });
      });
    },

    // 选择图片 - 单选
    successSingle(val) {
      this.formData.head_img_url = val.url;
    },
    // 选择图片 - 多选
    successCBKs(list) {
      list.forEach(item => {
        this.formData.img_url_list.push(item.url)
      })
    },
    // 移除图片
    removeImg(index) {
      this.formData.img_url_list.splice(index, 1);
    },

    // 返回
    goBack() {
      this.$router.push({
        path: 'chefList'
      })
    },

  },
};
</script>

<style lang="scss">
  #map-container{
    width: 600px;
    height: 400px;
  }
  .shop-search-address{
    .el-select-dropdown__item{
      height: auto;
      padding: 0;
      .search-address-li{
        max-width: 360px;
        height: auto;
        padding: 10px 20px;
        .title {

        }
      }
    }
  }
  .el-select-dropdown__item {
    white-space: initial !important;
  }
</style>
