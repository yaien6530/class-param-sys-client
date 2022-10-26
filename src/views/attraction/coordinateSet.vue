

<template>
  <div class="edit-common-container">
    <el-form label-width="100px">
      <!-- 地图 -->
      <el-form-item label="地图：">
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
        <el-tag v-for="(item, index) in coorList" :key="item.attractions_id" @close="delCoor(item.attractions_id, index)" effect="dark" closable>{{item.name}}</el-tag>
      </el-form-item>
    </el-form>

    <div class="bottom-btn">
      <el-button type="primary" @click="saveCoor">保存</el-button>
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
    return {
      route_id: 0,

      map_image_url: '',

      mapLoading: false,
      setLoading: false,

      attrList: [], // 全部景点
      coorList: [], // 已标景点
      attrData: {}, // 待标景点
      attrId: null,
      attrType: 1, // 1新增 2修改

      imgSize: 500, // 地图图片尺寸 
    };
  },
  created() {
    this.getAttrList();
    new Promise(resolve => {
      this.getMap(resolve);
    }).then(() => {
      this.getCoor();
      this.initMap();
    });
  },
  methods: {
    // 获取地图图片
    getMap(resolve) {
      this.mapLoading = true;
      this.Api.getMainMap().then(res => {
        if (res.data.ret === 0) {
          const {route_id = 0, image_vo = {}} = res.data.data || {};
          this.route_id = route_id;
          this.map_image_url = image_vo.url || '';
          resolve();
        } else {
          this.$message.error(`获取地图图片失败，${res.data.msg}`);
        }
      }).finally(() => {
        this.mapLoading = false;
      });
    },

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
      L.imageOverlay(this.map_image_url, bounds).addTo(map);
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
          iconUrl: item.image_url || '',
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
    
    // 获取全部景点
    getAttrList() {
      this.mapLoading = true;
      this.Api.getAttractionDropDownList().then(res => {
        if (res.data.ret === 0) {
          this.attrList = res.data.data || [];
        } else {
          this.$message.error(`获取景点列表失败，${res.data.msg}`);
        }
      }).finally(() => {
        this.mapLoading = false;
      });
    },

    // 获取坐标
    getCoor() {
      const params = {
        route_id: this.route_id
      }
      this.Api.getMainMapAttractionsList(params).then(res => {
        if (res.data.ret === 0) {
          let coorList = res.data.data || [];
          coorList.forEach(coorItem => {
            coorItem.name = coorItem.attractions_name;
            this.attrList.forEach(arrtItem => {
              if (coorItem.attractions_id == arrtItem.attractions_id) {
                arrtItem.disabled = true;
              }
            })
          })
          this.coorList = coorList;
          this.handleMapMarker();
        } else {
          this.$message.error(`获取地图坐标点失败，${res.data.msg}`);
        }
      });
    },
    // 保存坐标
    saveCoor() {
      this.setLoading = true;
      this.Api.addCoordinate(this.coorList).then(res => {
        if (res.data.ret === 0) {
          this.$message.success('保存成功');
          this.getCoor();
        } else {
          this.$message.error(`保存失败，${res.data.msg}`);
        }
      }).finally(() => {
        this.setLoading = false;
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

  },
};
</script>

<style lang="scss">
  #map {
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

  .el-tag {
    margin: 0 10px 10px 0;
    cursor: pointer;
  }
</style>
