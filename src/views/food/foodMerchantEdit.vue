

<template>
  <div class="edit-common-container">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="150px">
      <el-form-item label="商家名：" prop="merchant_name">
        <el-input v-model="formData.merchant_name" class="w300" />
      </el-form-item>
      <el-form-item label="联系电话：" prop="phone">
        <el-input v-model="formData.phone" class="w300" />
      </el-form-item>
      <el-form-item label="人均价格：" prop="average_price">
        <el-input v-model="formData.average_price" class="w300" />
      </el-form-item>
      <el-form-item label="地址：" prop="address">
        <div>
          <span>城市</span>
          <el-cascader v-model="active_region" :options="cityList" :props="{ label: 'name', value: 'name', children: 'children' }" />
          <span style="padding-left: 20px;">搜索</span>
          <el-select
            v-model="formData.address"
            popper-class="shop-search-address"
            filterable
            remote
            reserve-keyword
            placeholder="输入关键词搜索"
            :loading="input_loading"
            :disabled="!(active_region && active_region.length)"
            :remote-method="searchAddress"
          >
            <el-option v-for="(item,index) in address_arr" :key="index" :label="item.title" :value="item.address">
              <div class="search-address-li" @click="handleSelectAddress(item)">
                <div class="title" style="line-height: 20px">{{ item.title }}</div>
                <div class="address" style="line-height: 20px; color: #8492a6; font-size: 13px">{{ item.address }}</div>
              </div>
            </el-option>
          </el-select>
        </div>
        <div style="margin-top: 10px">地址：{{formData.address}}</div>
        <div>经度：{{ formData.longitude }}，纬度：{{ formData.latitude }}</div>
        <div id="map-container" />
      </el-form-item>
      <el-form-item label="营业时间：" prop="business_hours">
        <el-time-picker v-model="formData.business_hours.begin" format="HH:mm" value-format="HH:mm" placeholder="开始时间" />
        -
        <el-time-picker v-model="formData.business_hours.end" format="HH:mm" value-format="HH:mm" placeholder="结束时间" />
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
      <el-form-item label="菜品图：" prop="dishes_img_list">
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
      <el-form-item label="环境图：" prop="setting_img_list">
        <el-button @click="openImg('setting_img_list')" type="text">新增</el-button>
        <el-table :data="formData.setting_img_list" :header-cell-style="val => Fun.getRowClass(val.rowIndex)" :key="imgKey">
          <el-table-column label="主图" align="center" width="80">
            <template slot-scope="{row}">
              <img v-if="row.img_url" :src="row.img_url" class="img50" />
            </template>
          </el-table-column>
          <el-table-column label="标题" prop="img_title" min-width="160" align="center" />
          <el-table-column align="center" label="操作" width="120" fixed="right">
            <template slot-scope="{row, $index}">
              <el-button @click="openImg('setting_img_list', $index, row)" type="text">编辑</el-button>
              <el-button @click="delImg('setting_img_list', $index)" type="text">删除</el-button>
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
  </div>
</template>

<script>
import selectImages from "@/components/common/SelectImages";
import selectSingleImage from "@/components/common/selectSingleImage";

import { cityData } from '@/assets/js/cityData';

export default {
  components: { selectImages, selectSingleImage },
  data() {
    const validateCarousel = (rule, value, callback) => {
      const length = this.formData.carousel.length;
      if (length < 1 || length > 3) {
        callback(new Error('请上传1-3张景点轮播图'));
      } else {
        callback();
      }
    };
    const validatePhoto = (rule, value, callback) => {
      const length = this.formData.photo_album.length;
      if (length > 50) {
        callback(new Error('请上传0-50张景点相册'));
      } else {
        callback();
      }
    };
    return {
      rules: {
        merchant_name: [
          { required: true, message: '请输入商家名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        average_price: [
          { required: true, message: '请输入人均价格', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' },
        ],

        carousel: [
          { validator: validateCarousel, trigger: 'change' }
        ],
        photo_album: [
          { validator: validatePhoto, trigger: 'change' }
        ],
      },


      formData: {
        gourmet_merchant_id: 0,
        merchant_name: '', // 商家名称
        phone: '', // 联系电话
        average_price: '', // 人均价格

        address: '', // 商家地址
        latitude: 0, // 纬度
        longitude: 0, // 经度

        business_hours: { // 营业时间 08：00
          begin: '',
          end: '',
        },
        head_img_list: [], // 主图
        dishes_img_list: [], // 菜品图
        setting_img_list: [], // 环境图
        applets_link: { // 跳转小程序
          app_id: '',
          path: ''
        },
      },


      getLoading: false,
      setLoading: false,

      imgData: {},
      imgProp: '',
      imgIndex: null,
      imgVisible: false,
      imgKey: false,

      cityList: [], // 城市列表
      tmap_key: 'JSEBZ-SXZYP-XP5DB-LQ35F-34SJH-RMFXC',
      map: null,
      marker: null,
      my_location: {
          latitude: 39.984104, // 纬度
          longitude: 116.307503, // 经度
          geted: false
      },
      city_data: [],
      active_region: [],
      address_arr: [],
      input_loading: false,
    };
  },
  created() {
    let gourmet_merchant_id = Number(this.$route.query.gourmet_merchant_id);
    if (gourmet_merchant_id) {
      this.getData(gourmet_merchant_id);
    }
    this.getCityData();
  },
  mounted() {
    this.mapInit();
  },
  methods: {
    // 获取数据
    getData(gourmet_merchant_id) {
      const params = {
        gourmet_merchant_id
      }
      this.getLoading = true;
      this.Api.getGourmetMerchantDetail(params).then(res => {
        if (res.data.ret === 0) {
          const resData = res.data.data || {};

          this.formData = {
            gourmet_merchant_id: resData.gourmet_merchant_id || 0,
            merchant_name: resData.merchant_name || '',
            phone: resData.phone || '',
            average_price: resData.average_price || '',

            address: resData.address || '',
            latitude: resData.latitude || '',
            longitude: resData.longitude || '',

            business_hours: resData.business_hours ||  { begin: '', end: '' },
            head_img_list: resData.head_img_list || [],
            dishes_img_list: resData.dishes_img_list || [],
            setting_img_list: resData.setting_img_list || [],

            applets_link: resData.applets_link || { app_id: '', path: '' },
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
        this.setLoading = true;
        let formData = JSON.parse(JSON.stringify(this.formData));
        formData.latitude = Number(formData.latitude);
        formData.longitude = Number(formData.longitude);
        formData.average_price = Number(formData.average_price);
        this.Api.createOrChangeGourmetMerchant(formData).then(res => {
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


    // 获取城市列表
    getCityData() {
      const cityList = JSON.parse(JSON.stringify(cityData.areaList));
      cityList.map((item0, index0) => {
        if (item0.province_list) {
          item0.children = item0.province_list;
          item0.province_list = null;
          if (item0.children && item0.children.length) {
            item0.children.map((item1) => {
              if (item1.city_list) {
                item1.children = item1.city_list;
                item1.city_list = null;
              }
            });
          }
        }
      });
      this.cityList = cityList;
    },
    // 初始化地图
    mapInit() {
      this.map = new qq.maps.Map('map-container', {
        rotation: 20, // 设置地图旋转角度
        pitch: 30, // 设置俯仰角度（0~45）
        zoom: 12, // 设置地图缩放级别
        center: new qq.maps.LatLng(this.my_location.latitude, this.my_location.longitude)// 设置地图中心点坐标
      });
    },
    getLocation() {
      let time = 0;
      const _getLocation = () => {
        time++;
        const Geolocation = new qq.maps.Geolocation(this.tmap_key, 'myapp');
        const showPosition = (res) => {
          if (this.my_location.geted) return;
          this.my_location = {
            latitude: res.lat, // 纬度
            longitude: res.lng, // 经度
            geted: true
          };
          this.map.setCenter(new qq.maps.LatLng(res.lat, res.lng));
          this.createPoint();
        };
        const showErr = (res) => {
          if (time <= 2) {
            _getLocation();
          }
        };
        Geolocation.getLocation(showPosition, showErr);
        Geolocation.getIpLocation(showPosition, showErr);
      };
      _getLocation();
    },
    // 搜索城市
    getLocaltionLatLng(query) {
      const self = this;
      this.$jsonp('https://apis.map.qq.com/ws/place/v1/search', {
        key: self.tmap_key,
        boundary: `region(${self.active_region[self.active_region.length - 1]},0)`,
        keyword: query || '',
        output: 'jsonp'
      }).then(res => {
        console.log('jsonp, suc', res.data)
        self.address_arr = res.data || [];
        self.input_loading = false;
      }).catch(err => {
        console.log('jsonp, err', err)
        self.address_arr = [];
      })
    },
    searchAddress(query) {
      console.log('搜索地址：', query);
      if (query !== '' && this.active_region && this.active_region.length) {
        this.input_loading = true;
        this.getLocaltionLatLng(query);
      } else {
        this.options = [];
      }
    },
    handleSelectAddress(item) {
      console.log('选择详细地址：', item.location);
      this.formData.latitude = item.location.lat;
      this.formData.longitude = item.location.lng;
      this.map.setCenter(new qq.maps.LatLng(this.formData.latitude, this.formData.longitude));
      this.createPoint();
    },
    createPoint() {
      console.log('点坐标：', this.map.getCenter());
      if (this.marker) this.marker.setMap(null);
      this.marker = new qq.maps.Marker({
        position: this.map.getCenter(),
        map: this.map
      });
    },

    // 返回
    goBack() {
      this.$router.push({
        path: 'foodMerchantList'
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
