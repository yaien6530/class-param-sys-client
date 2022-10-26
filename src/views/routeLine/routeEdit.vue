

<template>
  <div class="edit-common-container">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="100px">

      <el-form-item label="路线名：" prop="name">
        <el-input v-model="formData.name" class="w300" />
      </el-form-item>

      <el-form-item label="简介：" prop="description">
        <el-input v-model="formData.description" type="textarea" class="w300" />
      </el-form-item>

      <el-form-item label="标签：">
        <el-tag v-for="(item, index) in formData.tag_list" :key="item" closable :disable-transitions="false" @close="delTag(index)">{{item}}</el-tag>
        <el-input class="w200" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" @keyup.enter.native="addTag" @blur="addTag" size="mini" />
        <el-button v-else @click="openTag" size="mini">添加标签</el-button>
      </el-form-item>

      <el-form-item label="封面图：" prop="image_url">
        <div class="choose-picture-80">
          <img v-show="formData.image_url" :src="formData.image_url" class="img" />
          <p v-show="!formData.image_url"><i class="el-icon-plus icon" /></p>
          <selectSingleImage slots @successCBK=" val => successSingle(val, 'image')">
            <template scope="{ openDetail }">
              <div class="select-image-component" @click="openDetail()" />
            </template>
          </selectSingleImage>
        </div>
        <div class="alert-box">建议尺寸：1 : 1</div>
      </el-form-item>

      <el-form-item label="路线地图：" prop="map_image_url">
        <div class="choose-picture-80">
          <img v-show="formData.map_image_url" :src="formData.map_image_url" class="img" />
          <p v-show="!formData.map_image_url"><i class="el-icon-plus icon" /></p>
          <selectSingleImage slots @successCBK=" val => successSingle(val, 'map_image')">
            <template scope="{ openDetail }">
              <div class="select-image-component" @click="openDetail()" />
            </template>
          </selectSingleImage>
        </div>
        <div class="alert-box">建议尺寸：2000 x 2000</div>
      </el-form-item>

      <!-- 地图 -->
      <el-form-item label="地图标注：">
        <div id="map" />
      </el-form-item>

      <!-- 未标景点 -->
      <el-form-item label="未标景点：">
        <div class="tag-list">
          <div v-for="item in attrList" :key="item.attractions_id" v-show="!item.disabled" @click="choiceCoor(item)" :class="{active: item.attractions_id == attrId}" class="tag-item">{{item.name}}</div>
        </div>
      </el-form-item>

      <!-- 已标景点 -->
      <el-form-item label="已标景点：">
        <el-tag v-for="(item, index) in coorList" :key="item.attractions_id" @close="delCoor(item.attractions_id, index)" effect="dark" closable>{{ item.name }}</el-tag>
      </el-form-item>
    </el-form>
    
    <div class="bottom-btn">
      <el-button @click="goBack">返回</el-button>
      <el-button type="primary" @click="saveData('ruleForm')">保存</el-button>
    </div>
  </div>
</template>

<script>
let map = null, // 地图
    mapLayer = null; // 地图图层
import selectSingleImage from "@/components/common/selectSingleImage";
export default {
  components: { selectSingleImage },
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
        name: [
          { required: true, message: '请输入景点名', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        image_url: [
          { required: true, message: '请上传封面图', trigger: 'blur' }
        ],
        map_image_url: [
          { required: true, message: '请上传路线地图', trigger: 'blur' }
        ],
      },

      route_id: null,

      formData: {
        route_id: null,
        name: '', // 路线名
        description: '', // 简介
        tag_list: [], // 标签
        image_id: 0,
        image_url: '', // 封面图
        map_image_id: 0,
        map_image_url: '', // 地图
        
      },
      getLoading: false,
      setLoading: false,

      inputVisible: false,
      inputValue: '',

      attrList: [], // 全部景点
      coorList: [], // 已标景点
      attrData: {}, // 待标景点
      attrId: null,
      attrType: 1, // 1新增 2修改

      imgSize: 500, // 地图图片尺寸 
    };
  },
  created() {
    const route_id = Number(this.$route.query.route_id);
    new Promise(resolve => {
      if (route_id) {
        this.route_id = route_id;
        this.getData(route_id, resolve);
      } else {
        resolve()
      }
    }).then(() => {
      this.getAttrList();
      this.initMap();
    })
  },
  methods: {
    // 初始化地图
    initMap() {
      map = L.map('map', {
        center: [-this.imgSize / 2, this.imgSize / 2], // 地图中心点
        zoom: 1, // 缩放比例
        minZoom: 1,
        maxZoom: 10,
        crs: L.CRS.Simple,
        doubleClickZoom: false, // 禁用双击放大
        attributionControl: false, // 移除右下角leaflet标识
        zoomSnap: 0.1,
      })
      this.handleMapImg();
      this.handleMapMarker();
      this.onMapClick();
    },
    // 地图图片
    handleMapImg() {
      const southWest = map.unproject([0, this.imgSize], map.getMinZoom() - 1),
            northEast = map.unproject([this.imgSize, 0], map.getMinZoom() - 1);
      const bounds = new L.LatLngBounds(southWest, northEast);
      L.imageOverlay(this.formData.map_image_url, bounds).addTo(map);
      map.setMaxBounds(bounds);
    },
    // 地图标记
    handleMapMarker() {
      if (mapLayer) { // 删除layer图层
        map.removeLayer(mapLayer);
      }
      mapLayer = new L.layerGroup(); // 新增layer图层
      this.coorList.forEach(item => {
        // 图标
        const icon = L.icon({
          iconUrl: item.image_url,
          iconSize: [30, 30],
        });
        L.marker([item.xaxis, item.yaxis], {icon: icon}).addTo(mapLayer).on('click', () => {
          this.choiceCoor(item, 2);
				});
        // 文字
        const text = L.divIcon({
          html: item.name,
          className: 'div-icon',
          iconSize: [100, 18],
          iconAnchor: [50, -15]
        });
        L.marker([item.xaxis, item.yaxis], {icon: text}).addTo(mapLayer).on('click', () => {
          this.choiceCoor(item, 2);
				});
      })
    
      mapLayer.addTo(map);
    },
    // 地图绑定事件
    onMapClick() {
      map.on('click', e => { // 绑定点击事件
        if (this.attrId === null) return;
        
        const {lat, lng} = e.latlng;

         // 处理已标景点
        if (this.attrType == 1) {
          this.coorList.push({
            ...this.attrData,
            xaxis: lat,
            yaxis: lng
          })
        } else {
          this.coorList.forEach(item => {
            if (item.attractions_id == this.attrId) {
              item.xaxis = lat;
              item.yaxis = lng;
            }
          })
        }

        // 处理未标景点
        this.attrList.forEach(item => {
          if (item.attractions_id === this.attrId) {
            item.disabled = true;
          }
        })

        this.attrId = null;

        this.handleMapMarker();
      })
    },


    // 获取数据
    getData(route_id, resolve) {
      const params = {
        route_id
      }
      this.getLoading = true;
      this.Api.getRouteDetail(params).then(res => {
        if (res.data.ret === 0) {
          const resData = res.data.data || {};

          this.formData = {
            route_id: resData.route_id || 0,
            name: resData.name || '',
            description: resData.description || '',
            tag_list: resData.tag_list || [],
            image_id: resData.image_id || 0,
            image_url: resData.image_url || '',
            map_image_id: resData.map_image_id || 0,
            map_image_url: resData.map_image_url || '',
          }

          let coorList = resData.attractions_list || [];
          coorList.forEach(coorItem => {
            coorItem.name = coorItem.attractions_name;
          })
          this.coorList = coorList;
        } else {
          this.$message.error(`获取数据失败，${res.data.msg}`);
        }
      }).finally(() => {
        resolve();
        this.getLoading = false;
      });
    },
    // 保存数据
    saveData() {
      this.$refs['formData'].validate((valid) => {
        if (!valid) return;

        this.setLoading = true;
        let formData = JSON.parse(JSON.stringify(this.formData));
        this.coorList.forEach(item => {
          item.route_id = this.route_id
        });
        formData.attractions_list = this.coorList;

        this.Api.createOrChangeRoute(formData).then(res => {
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

    // 获取全部景点
    getAttrList() {
      this.mapLoading = true;
      this.Api.getAttractionDropDownList().then(res => {
        if (res.data.ret === 0) {
          const attrList = res.data.data || [];
          this.coorList.forEach(coorItem => {
            attrList.forEach(arrtItem => {
              if (coorItem.attractions_id == arrtItem.attractions_id) {
                arrtItem.disabled = true;
              }
            })
          })
          this.attrList = attrList;
        } else {
          this.$message.error(`获取景点列表失败，${res.data.msg}`);
        }
      }).finally(() => {
        this.mapLoading = false;
      });
    },

    // 选中坐标
    choiceCoor(item, type = 1) {
      this.$message.success(`当前操作景点：${item.name}`);
      this.attrData = item;
      this.attrId = item.attractions_id;
      this.attrType = type;
    },
    // 删除坐标
    delCoor(id, index) {
      this.coorList.splice(index, 1);
      this.attrList.forEach(item => {
        if (item.attractions_id === id) {
          item.disabled = false;
        }
      })
      this.handleMapMarker();
    },


    // 打开标签
    openTag() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 添加标签
    addTag() {
      const inputValue = this.inputValue;
      if (inputValue) {
        this.formData.tag_list.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    // 删除标签
    delTag(index) {
      this.formData.tag_list.splice(index, 1);
    },

    // 选择图片
    successSingle(obj, prop) {
      const idProp =  prop + '_id';
      const urlProp = prop + '_url';
      this.formData[idProp] = obj.image_id;
      this.formData[urlProp] = obj.url;
      this.$forceUpdate();
      if (prop == 'map_image') {
        this.handleMapImg();
      }
    },

    // 返回
    goBack() {
      this.$router.push({
        path: 'routeList'
      })
    },
  },
};
</script>

<style lang="scss" scoped>

  /deep/ #map {
		width: 800px;
		height: 800px;
    .div-icon {
      padding: 0px 10px;
      border-radius: 100px;
      font-size: 12px;
      background: #fff;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.6);
      text-align: center;
      white-space: nowrap; 
      overflow: hidden;
      text-overflow: ellipsis;
      box-sizing: border-box;
    }
	}

  .el-tag {
    margin-right: 5px;
  }


  .tag-list {
    display: flex;
    flex-wrap: wrap;
    .tag-item {
      height: 28px;
      line-height: 28px;
      margin: 6px 10px 0 0;
      padding: 0 10px;
      border: 1px solid #ccc;
      font-size: 12px;
      cursor: pointer;
      border-radius: 3px;
      &.active {
        border-color: #4090ff;
        background: #4090ff;
        color: #fff;
      }
    }
  }

  .coor-box {
    position: absolute;
    .img {
      position: absolute;
      bottom: 0px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 40px;
      border: 2px solid #fff;
      border-radius: 50%;
      box-shadow: 0 3px 5px rgba(0, 0, 0, 0.6);
    }
    .name {
      position: absolute;
      top: 2px;
      left: 50%;
      transform: translateX(-50%);
      height: 20px;
      line-height: 20px;
      border-radius: 100px;
      padding: 0px 10px;
      background: #fff;
      font-size: 12px;
      box-shadow: 0 3px 5px rgba(0, 0, 0, 0.6);
      white-space: nowrap; 
    }
    &.move {
      display: none;
      position: fixed;
      &.show {
        display: block;
      }
    }
  }
</style>
