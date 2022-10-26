

<template>
  <div class="edit-common-container">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="160px">
      <el-form-item label="民宿名：" prop="housing_name">
        <el-input v-model="formData.housing_name" class="w300" />
      </el-form-item>
      <el-form-item label="类型：" prop="type">
        <el-select v-model="formData.type" class="w300">
          <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="联系电话：" prop="phone">
        <el-input v-model="formData.phone" class="w300" />
      </el-form-item>
      <el-form-item label="价格：" prop="money">
        <el-input v-model="formData.money" class="w300" />
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
      <el-form-item v-if="false" label="设施图：" prop="facility_img_list">
        <el-button @click="openImg('facility_img_list')" type="text">新增</el-button>
        <el-table :data="formData.facility_img_list" :header-cell-style="val => Fun.getRowClass(val.rowIndex)" :key="imgKey">
          <el-table-column label="主图" align="center" width="80">
            <template slot-scope="{row}">
              <img v-if="row.img_url" :src="row.img_url" class="img50" />
            </template>
          </el-table-column>
          <el-table-column label="标题" prop="img_title" min-width="160" align="center" />
          <el-table-column align="center" label="操作" width="120" fixed="right">
            <template slot-scope="{row, $index}">
              <el-button @click="openImg('facility_img_list', $index, row)" type="text">编辑</el-button>
              <el-button @click="delImg('dishes_img_list', $index)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="图文详情" prop="content">
        <tinymce v-model="formData.content" :height="500" :width="580" />
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
import Tinymce from '@/components/Tinymce';
import { cityData } from '@/assets/js/cityData';

export default {
  components: { selectImages, selectSingleImage, Tinymce },
  data() {
    return {
      rules: {
        housing_name: [
          { required: true, message: '请输入民宿名', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        money: [
          { required: true, message: '请输入人均价格', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' },
        ],

      },


      formData: {
        housing_id: 0,
        housing_name: '', // 民宿名称
        money: '', // 价格
        phone: '', // 联系电话
        type: 0, // 类型 0酒店 1民宿 2民俗户
        address: '', // 地址
        latitude: 0,
        longitude: 0,
        applets_link: {  // 跳转小程序链接
          app_id: '',
          path: ''
        },
        facility_img_list: [], // 设施图片列表
        head_img_list: [], // 主轮播图列表
        content: '', // 图文详情
      },

      typeList: [
        {value: 0, label: '酒店'},
        {value: 1, label: '民宿'},
        {value: 2, label: '民俗户'},
      ],


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
    const housing_id = Number(this.$route.query.housing_id);
    if (housing_id) {
      this.getData(housing_id);
    }
    this.getCityData();
  },
  mounted() {
    this.mapInit();
  },
  methods: {
    // 获取数据
    getData(housing_id) {
      const params = {
        housing_id
      }
      this.getLoading = true;
      this.Api.getHousingtDetail(params).then(res => {
        if (res.data.ret === 0) {
          const resData = res.data.data || {};

          this.formData = {
            housing_id: resData.housing_id || 0,
            housing_name: resData.housing_name || '',
            money: resData.money || '',
            phone: resData.phone || '',
            type: resData.type || 0,

            address: resData.address || '',
            latitude: resData.latitude || '',
            longitude: resData.longitude || '',

            head_img_list: resData.head_img_list || [],
            facility_img_list: resData.facility_img_list || [],
            
            content: resData.content || '',
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
        formData.money = Number(formData.money) || 0;
        this.Api.createOrChangeHousingt(formData).then(res => {
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
        path: 'housingList'
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
