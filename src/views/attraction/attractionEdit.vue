

<template>
  <div class="edit-common-container">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="100px">

      <el-form-item label="景点名：" prop="name">
        <el-input v-model="formData.name" class="w300" />
      </el-form-item>
      <el-form-item label="描述：" prop="description">
        <el-input v-model="formData.description" type="textarea" class="w300" />
      </el-form-item>
      <el-form-item label="分类：" prop="sort_id">
        <el-select v-model="formData.sort_id" class="w300">
          <el-option v-for="item in sortList" :key="item.attractions_sort_id" :label="item.sort_name" :value="item.attractions_sort_id" />
        </el-select>
      </el-form-item>


      <el-form-item label="坐标地址：" prop="address">
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
        <div>地址：{{formData.address}}</div>
        <div>经度：{{ formData.longitude }}，纬度：{{ formData.latitude }}</div>
        <div id="map-container" />
      </el-form-item>

      <el-form-item label="vr链接：" prop="vr_url">
        <el-input v-model="formData.vr_url" class="w300" />
      </el-form-item>

      <el-form-item label="封面图：" prop="main_image">
        <div class="choose-picture-80">
          <img v-show="formData.main_image.url" :src="formData.main_image.url" class="img" />
          <p v-show="!formData.main_image.url"><i class="el-icon-plus icon" /></p>
          <selectSingleImage slots @successCBK=" val => successSingle(val, 'main_image')">
            <template scope="{ openDetail }">
              <div class="select-image-component" @click="openDetail()" />
            </template>
          </selectSingleImage>
        </div>
        <div class="alert-box">建议尺寸：1 : 1</div>
      </el-form-item>

      <el-form-item label="轮播图：" prop="carousel">
        <div class="photo-content-80">
          <div v-for="(item, index) in formData.carousel" :key="index" class="photo-list">
            <img :src="item.url" />
            <div class="photo-delete-content">
              <i class="el-icon-delete" @click="removeImage(index, 'carousel')" />
            </div>
          </div>
          <selectImages slots @successCBK="list => successCBKs(list, 'carousel')">
            <template scope="{ openDetail }">
              <div class="photo-list photo-add-list" @click="openDetail()">+</div>
            </template>
          </selectImages>
        </div>
        <div class="alert-box">请上传1-3张，建议尺寸：375 x 175</div>
      </el-form-item>

      <el-form-item label="相册：" prop="photo_album">
        <div class="photo-content-80">
          <div v-for="(item, index) in formData.photo_album" :key="index" class="photo-list">
            <img :src="item.url" />
            <div class="photo-delete-content">
              <i class="el-icon-delete" @click="removeImage(index, 'photo_album')" />
            </div>
          </div>
          <selectImages slots @successCBK="list => successCBKs(list, 'photo_album')">
            <template scope="{ openDetail }">
              <div class="photo-list photo-add-list" @click="openDetail()">+</div>
            </template>
          </selectImages>
        </div>
        <div class="alert-box">请上传0-50张</div>
      </el-form-item>

      <el-form-item label="音频：">
        <el-button type="text" @click="audioVisible = true">选择</el-button>
        <div>
          <el-tag v-show="formData.audio.url" @close="removeAudio" closable>{{formData.audio.url}}</el-tag>
        </div>
      </el-form-item>

      <el-form-item label="视频：">
        <div class="photo-content-80">
          <div v-for="(item, index) in formData.video_list" :key="index" class="photo-list">
            <!-- <video :src="item.url" /> -->
            <img :src="item.cover_url" />
            <div class="photo-delete-content">
              <i class="el-icon-delete" @click="removeImage(index, 'video_list')"  />
            </div>
          </div>
          <div class="photo-list photo-add-list" style="margin-left:10px;" @click="videoVisible = true">
            <i class="el-icon-video-camera" />
          </div>
        </div>
      </el-form-item>
    </el-form>
    

    <div class="bottom-btn">
      <el-button @click="goBack">返回</el-button>
      <el-button type="primary" @click="saveData('ruleForm')">保存</el-button>
    </div>

    <!-- 选择视频 -->
    <SelectVideo :dialog.sync="videoVisible" @submit="selectVideoSus" />

    <!-- 选择音频 -->
    <SelectAudio :dialog.sync="audioVisible" @submit="selectAudioSus" />

    
  </div>
</template>

<script>
import selectImages from "@/components/common/SelectImages";
import selectSingleImage from "@/components/common/selectSingleImage";
import SelectVideo from "@/components/common/selectVideo";
import SelectAudio from "@/components/common/selectAudio";

import { cityData } from '@/assets/js/cityData';

export default {
  components: { selectImages, selectSingleImage, SelectVideo, SelectAudio },
  data() {
    const validateMainImage = (rule, value, callback) => {
      if (!this.formData.main_image.image_id) {
        callback(new Error('请上传封面图'));
      } else {
        callback();
      }
    };
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
      headers: {
        token: localStorage.getItem('token'),
        app_id: localStorage.getItem('app_id'),
        shop_code: localStorage.getItem('shop_code')
      },

      rules: {
        name: [
          { required: true, message: '请输入景点名', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        sort_id: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' },
        ],
        latitude: [
          { required: true, message: '请输入纬度', trigger: 'blur' },
        ],
        longitude: [
          { required: true, message: '请输入经度', trigger: 'blur' },
        ],
        main_image: [
          { required: true, message: '请上传封面图', trigger: 'change' },
          { validator: validateMainImage, trigger: 'change' }
        ],
        carousel: [
          { required: true, message: '请上传轮播图', trigger: 'change' },
          { validator: validateCarousel, trigger: 'change' }
        ],
        photo_album: [
          { validator: validatePhoto, trigger: 'change' }
        ],
      },

      formData: {
        attractions_id: 0,

        name: '', // 景点名称
        description: '', // 景点描述

        address: '', // 地址名称
        latitude: '', // 纬度
        longitude: '', // 经度

        main_image: { // 封面图
          image_id: 0,
          url: ''
        },
        carousel: [], // 轮播图
        photo_album: [], // 景点相册

        audio: { // 音频
          audio_id: 0,
          url: ''
        },
        video_list: [], // 视频
        vr_url: '', // vr链接
        sort_id: null, // 分类
      },
      getLoading: false,
      setLoading: false,

      videoVisible: false, // 选择视频弹窗
      audioVisible: false,

      sortList: [], // 分类列表

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
    let attractions_id = Number(this.$route.query.attractions_id);
    if (attractions_id) {
      this.getData(attractions_id);
    }
    this.getCityData();
    this.getSortList();
  },
  mounted() {
    this.mapInit();
  },
  methods: {
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

    // 获取数据
    getData(attractions_id) {
      const params = {
        attractions_id
      }
      this.getLoading = true;
      this.Api.getAttractionDetail(params).then(res => {
        if (res.data.ret === 0) {
          const resData = res.data.data || {};

          this.formData = {
            attractions_id: resData.attractions_id || 0,
            name: resData.name || '', // 景点名称
            description: resData.description || '', // 景点描述
            address: resData.address || '', // 地址名称
            latitude: resData.latitude || '', // 纬度
            longitude: resData.longitude || '', // 经度
            main_image: resData.main_image || { image_id: 0, url: '' },  // 封面图
            carousel: resData.carousel || [], // 轮播图
            photo_album: resData.photo_album || [], // 景点相册
            audio: resData.audio || { audio_id: 0, url: '' },  // 音频
            video_list: resData.video_list || [], // 视频
            vr_url: resData.vr_url || '', // vr链接
            sort_id: resData.sort_id || null,
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
        this.Api.addOrChangeAttraction(formData).then(res => {
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

    // 获取分类列表
    getSortList() {
      this.getLoading = true;
      this.Api.getAttractionSortList().then(res => {
        if (res.data.ret === 0) {
          this.sortList = res.data.data || [];
        } else {
          this.$message.error(`获取分类失败，${res.data.msg}`);
        }
      }).finally(() => {
        this.getLoading = false;
      });
    },

    // 选择图片 - 单张
    successSingle(obj, prop) {
      this.formData[prop].image_id = obj.image_id;
      this.formData[prop].url = obj.url;
      this.$forceUpdate();
    },

    // 选择图片 - 多张
    successCBKs(list, prop) {
      console.log('选择轮播图', list)
      list.forEach(item => {
        this.formData[prop].push({
          image_id: item.image_id,
          url: item.url
        })
      })
    },
    // 删除图片 - 多张
    removeImage(index, prop) {
      this.formData[prop].splice(index, 1);
    },


    // 选择视频回调
    selectVideoSus(val) {
      console.log('选择视频回调', val)
      this.formData.video_list.push({
        video_id: val.video_id,
        cover_url: val.cover_url,
        url: val.video_url,
      });
      this.videoVisible = false;
    },

    // 选择音频回调
    selectAudioSus(val) {
      console.log('选择音频回调', val)
      this.formData.audio = {
        audio_id: val.audio_id,
        url: val.audio_url 
      }
      this.audioVisible = false;
    },
    // 移除音频
    removeAudio() {
      this.formData.audio = {
        audio_id: 0,
        url: ''
      };
    },

    // 返回
    goBack() {
      this.$router.push({
        path: 'attractionList'
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
