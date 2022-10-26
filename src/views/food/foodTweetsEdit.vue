

<template>
  <div class="edit-common-container">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="150px">
      <el-form-item label="标题：" prop="title">
        <el-input v-model="formData.title" class="w300" />
      </el-form-item>
      <el-form-item label="价格：" prop="money">
        <el-input v-model="formData.money" class="w300" />
      </el-form-item>

      <el-form-item label="主图：" prop="head_img_list">
        <div class="photo-content-80">
          <div v-for="(item, index) in formData.head_img_list" :key="index" class="photo-list">
            <img :src="item.img_url" />
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
        <div class="alert-box">建议尺寸：375 x 175</div>
      </el-form-item>

      <el-form-item label="推荐菜品图：" prop="dishes_img_list">
        <el-button @click="openImg('dishes_img_list')" type="text">新增</el-button>
        <el-table :data="formData.dishes_img_list" :header-cell-style="val => Fun.getRowClass(val.rowIndex)" :key="imgKey">
          <el-table-column label="主图" align="center" width="80">
            <template slot-scope="{row}">
              <img v-if="row.img_url" :src="row.img_url" class="img50" />
            </template>
          </el-table-column>
          <el-table-column label="标题" prop="img_title" min-width="160" align="center" />
          <el-table-column align="center" label="操作" width="120" fixed="right">
            <template slot-scope="{row, $index}">
              <el-button @click="openImg('dishes_img_list', $index, row)" type="text">编辑</el-button>
              <el-button @click="delImg('dishes_img_list', $index)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="推荐美食商家：" prop="gourmet_merchant_id_list">
        <el-button @click="merchantVisible = true" type="text">新增</el-button>
        <el-table :data="formData.gourmet_merchant_id_list" :header-cell-style="val => Fun.getRowClass(val.rowIndex)" max-height="300px">
          <el-table-column label="商家名称" prop="merchant_name" min-width="160" />
          <el-table-column label="商家地址" prop="address" min-width="160" align="center" />
          <el-table-column label="联系电话" prop="phone" min-width="120" align="center" />
          <el-table-column label="操作" width="80" align="center" fixed="right">
            <template slot-scope="{$index}">
              <el-button @click="delMerchant($index)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="跳转小程序appid：" prop="applets_link">
        <el-input v-model="formData.applets_link.app_id" class="w300" />
      </el-form-item>
      <el-form-item label="跳转小程序路径：" prop="applets_link">
        <el-input v-model="formData.applets_link.path" class="w300" />
        <div class="alert-box">如：page/index/index?id=123</div>
      </el-form-item>
      
      <el-form-item label="图文详情" prop="content">
        <tinymce v-model="formData.content" :height="500" :width="580" />
      </el-form-item>
    </el-form>

    <div class="bottom-btn">
      <el-button @click="goBack">返回</el-button>
      <el-button type="primary" @click="saveData('ruleForm')">保存</el-button>
    </div>


    <!-- 图片编辑 -->
    <el-dialog title="图片编辑" :visible.sync="imgVisible" width="500px">   
      <el-form label-width="100px">
        <el-form-item label="图片：">
          <div class="choose-picture-80">
            <img v-show="imgData.img_url" :src="imgData.img_url" class="img" />
            <p v-show="!imgData.img_url"><i class="el-icon-plus icon" /></p>
            <selectSingleImage slots @successCBK="successSingle">
              <template scope="{ openDetail }">
                <div class="select-image-component" @click="openDetail()" />
              </template>
            </selectSingleImage>
          </div>
          <div class="alert-box">建议尺寸：1 : 1</div>
        </el-form-item>
        <el-form-item label="标题：">
          <el-input v-model="imgData.img_title" class="w300" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="imgVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveImg">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 美食商家 -->
    <SelectFoodMerchant :visible="merchantVisible" :multiple="true" @close="merchantVisible = false" @submit="selectMerchant" />
  </div>
</template>

<script>
import selectImages from "@/components/common/SelectImages";
import selectSingleImage from "@/components/common/selectSingleImage";
import SelectFoodMerchant from "@/components/common/selectFoodMerchant";
import Tinymce from '@/components/Tinymce';
export default {
  components: { selectImages, selectSingleImage, SelectFoodMerchant, Tinymce },
  data() {
    return {
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        money: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
      },


      formData: {
        gourmet_tweets_id: null,
        title: '', // 标题
        money: '', // 价格

        applets_link: { // 跳转小程序
          app_id: '',
          path: ''
        },
        content: '', // 图文详情
        gourmet_merchant_id_list: [], // 推荐美食商家ID
        head_img_list: [], // 主图
        dishes_img_list: [], // 推荐菜品图
      },


      getLoading: false,
      setLoading: false,

      imgData: {},
      imgProp: '',
      imgIndex: null,
      imgVisible: false,
      imgKey: false,


      merchantVisible: false,

    };
  },
  created() {
    let gourmet_tweets_id = Number(this.$route.query.gourmet_tweets_id);
    if (gourmet_tweets_id) {
      this.getData(gourmet_tweets_id);
    }
  },
  mounted() {
  },
  methods: {
    // 获取数据
    getData(gourmet_tweets_id) {
      const params = {
        gourmet_tweets_id
      }
      this.getLoading = true;
      this.Api.getGourmetTweetsDetail(params).then(res => {
        if (res.data.ret === 0) {
          const resData = res.data.data || {};
          this.formData = {
            gourmet_tweets_id: resData.gourmet_tweets_id || null,
            title: resData.title || '',
            money: resData.money || '',
            applets_link: resData.applets_link || { app_id: '', path: '' },
            content: resData.content || '',
            gourmet_merchant_id_list: resData.merchant_list || [],
            head_img_list: resData.head_img_list || [],
            dishes_img_list: resData.dishes_img_list || [],
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
        formData.gourmet_merchant_id_list = formData.gourmet_merchant_id_list.map(item => item.gourmet_merchant_id);
        
        this.setLoading = true;
        this.Api.createOrChangeGourmetTweets(formData).then(res => {
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

    // 选择商家
    selectMerchant(list) {
      console.log('选择推文', list)
      list.forEach(item => {
        this.formData.gourmet_merchant_id_list.push(item);
      })
      this.merchantVisible = false;
    },
    // 删除已选商家
    delMerchant(index) {
      this.formData.gourmet_merchant_id_list.splice(index, 1);
    },

    // 打开图片编辑
    openImg(prop, index = null, row = {}) {
      if (index !== null) {
        this.imgData = JSON.parse(JSON.stringify(row));
      } else {
        this.imgData = { img_title: '', img_url: '' }
      }
      this.imgProp = prop;
      this.imgIndex = index;
      this.imgVisible = true;
    },
    // 保存图片
    saveImg() {
      let imgData = this.imgData;
      if (!imgData.img_url) {
        this.$message.error('请选择图片');
        return;
      }
      if (this.imgIndex !== null) { // 编辑
        this.formData[this.imgProp][this.imgIndex] = imgData;
      } else { // 新增
        this.formData[this.imgProp].push(imgData);
      }
      this.imgVisible = false;
      this.imgKey = !this.imgKey;
    },
    // 删除图片
    delImg(prop, index) {
      this.formData[prop].splice(index, 1);
    },
    // 选择图片
    successSingle(obj) {
      this.imgData.img_url = obj.url;
      this.$forceUpdate();
    },



    // 选择图片 - 多选
    successCBKs(list) {
      list.forEach(item => {
        this.formData.head_img_list.push({
          img_url: item.url,
          img_title: ''
        })
      })
    },
    // 移除图片
    removeImg(index) {
      this.formData.head_img_list.splice(index, 1);
    },

    // 返回
    goBack() {
      this.$router.push({
        path: 'foodTweetsList'
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
