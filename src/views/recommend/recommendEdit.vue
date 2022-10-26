<!--客户数据概览-->
<template>
  <div class="edit-common-container">

    <el-form :model="formData" :rules="rules" ref="formData" label-width="100px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" class="w220" />
      </el-form-item>
      <el-form-item label="介绍" prop="remark">
        <el-input type="textarea" v-model="formData.remark" class="w220"  />
      </el-form-item>
      <el-form-item label="封面图">
        <div class="choose-picture-180">
          <img v-show="formData.cover" :src="formData.cover" class="img" />
          <p v-show="!formData.cover"><i class="el-icon-plus icon" /></p>
          <selectSingleImage slots @successCBK="successMap">
            <template scope="{ openDetail }">
              <div class="select-image-component" @click="openDetail()" />
            </template>
          </selectSingleImage>
        </div>
        <div class="alert-box">建议尺寸：1 : 1</div>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <tinymce v-model="formData.content" :height="500" :width="580" />
      </el-form-item>
      <el-form-item label="排序" prop="order_by">
        <el-input v-model="formData.order_by" class="w220" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="Number(0)">下架</el-radio>
          <el-radio :label="Number(1)">上架</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div class="bottom-btn">
      <el-button @click="goBack">返回</el-button>
      <el-button type="primary" @click="saveData">保存</el-button>
    </div>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce';
import selectSingleImage from "@/components/common/selectSingleImage";
export default {
  name: "Recommend",
  components: { Tinymce, selectSingleImage },
  data() {
    return {
      content: '', // 数据
      getLoading: false,
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
      },

      formData: {
        recommend_id: 0,
        title: '', // 标题
        cover: '', // 封面图
        remark: '', // 介绍
        content: '', // 内容
        order_by: '', // 排序
        status: 0, // 状态
      }

    };
  },
  created() {
    const recommend_id = Number(this.$route.query.recommend_id);
    if (recommend_id) {
      this.recommend_id = recommend_id;
      this.formData.recommend_id = recommend_id;
      this.getData();
    }
  },
  methods: {
    // 获取数据
    getData() {
      this.getLoading = true;
      const params = {
        recommend_id: this.recommend_id
      }
      this.Api.getRecommend(params).then(res => {
        if (res.data.ret === 0) {
          const resData = res.data.data || {};
          this.formData = {
            recommend_id: resData.recommend_id || 0,
            title: resData.title || '', // 标题
            cover: resData.cover || '', // 封面图
            remark: resData.remark || '', // 介绍
            content: resData.content || '', // 内容
            order_by: resData.order_by || '',
            status: resData.status || 0, // 状态
          }

          this.content = res.data.data || '';
        } else {
          this.$message.error(`获取数据失败，${res.data.msg}`);
        }
      }).finally(() => {
        this.getLoading = false;
      })
    },
    // 保存数据
    saveData() {
      this.$refs['formData'].validate((valid) => {
        if (!valid) return;
        let formData = JSON.parse(JSON.stringify(this.formData));
        formData.order_by = Number(formData.order_by) || null;
        this.Api.createRecommend(formData).then(res => {
          if (res.data.ret === 0) {
            this.$message.success('保存成功！');
            this.goBack();
          } else {
            this.$message.error(`保存失败，${res.data.msg}`);
          }
        })
      });
    },

    // 上传图片
    successMap(val) {
      this.formData.cover = val.url;
    },

    // 返回
    goBack() {
      this.$router.push({
        path: 'recommendList'
      })
    },

  }
};
</script>

<style lang="scss" scoped>

</style>



