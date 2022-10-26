<template>
  <div class="container">

    <!-- 轮播图 -->
    <el-form label-width="120px">
      <el-form-item label="轮播图：">
        <div class="photo-content-80">
          <div v-for="(item, index) in imageList" :key="index" class="photo-list">
            <img :src="item.img_url" />
            <div class="photo-delete-content">
              <i class="el-icon-delete" @click="removeImg(index, 'imageList')" />
              <i class="el-icon-edit" @click="openEdit('imageList', index, item)" />
            </div>
          </div>
          <selectImages slots @successCBK="val => successCBKs(val, 'imageList')">
            <template scope="{ openDetail }">
              <div class="photo-list photo-add-list" @click="openDetail()">+</div>
            </template>
          </selectImages>
        </div>
        <div class="alert">建议尺寸：345 x 175</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveData(1)">保存</el-button>
      </el-form-item>
    </el-form>


    <!-- 海报 -->
    <el-form label-width="120px">
      <el-form-item label="海报图：">
        <div class="photo-content-80">
          <div v-for="(item, index) in posterList" :key="index" class="photo-list">
            <img :src="item.img_url" />
            <div class="photo-delete-content">
              <i class="el-icon-delete" @click="removeImg(index, 'posterList')" />
            </div>
          </div>
          <selectImages slots @successCBK="val => successCBKs(val, 'posterList')">
            <template scope="{ openDetail }">
              <div class="photo-list photo-add-list" @click="openDetail()">+</div>
            </template>
          </selectImages>
        </div>
        <div class="alert">建议尺寸：105 x 80</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveData(3)">保存</el-button>
      </el-form-item>
    </el-form>

    
    <!-- 轮播图 -->
    <el-dialog title="编辑轮播图" :visible.sync="routeVisible" width="500px">
      <el-form label-width="120px">
        <el-form-item label="跳转链接：">
          <el-select v-model="routeObj.routing" placeholder="请选择">
            <el-option v-for="item in routeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="routeObj.routing == '/pages/recommend/recommendDetail/recommendDetail'" label="选择推文：">
          <el-button type="primary" @click="recommendVisible = true">选择</el-button>
          <div v-show="routeObj.param.id">{{routeObj.param.title}}</div>
        </el-form-item>
        <el-form-item v-show="routeObj.routing == '/pages/food/tweetsDetail/tweetsDetail'" label="选择美食推文：">
          <el-button type="primary" @click="tweetsVisible = true">选择</el-button>
          <div v-show="routeObj.param.id">{{routeObj.param.title}}</div>
        </el-form-item>

        
      </el-form>
      <div slot="footer">
        <el-button @click="routeVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveImage">保 存</el-button>
      </div>
    </el-dialog>


    <!-- 选择推文 -->
    <selectRecommend :visible="recommendVisible" @close="recommendVisible = false" @submit="selectRecommend" />

    <!-- 选择美食推文 -->
    <selectTweets :visible="tweetsVisible" @close="tweetsVisible = false" @submit="selectTweets" />

  </div>
</template>

<script>
import selectImages from "@/components/common/SelectImages";
import selectSingleImage from "@/components/common/selectSingleImage";
import selectRecommend from "@/components/common/selectRecommend";
import selectTweets from "@/components/common/selectTweets";

export default {
  name: "Home",
  components: { selectImages, selectSingleImage, selectRecommend, selectTweets },
  data() {
    return {

      imageList: [], // 轮播图
      imageLoading: false,
      
      posterList: [], // 海报

      routeList: [
        { label: '地图', value: '/pages/h5/siteMap/siteMap' },
        { label: '路线', value: '/pages/lineList/lineList' },
        { label: '餐厅列表', value: '/pages/home/home?navActive=2' },
        { label: '民宿列表', value: '/pages/home/home?navActive=3' },
        { label: '礼物列表', value: '/pages/home/home?navActive=4' },
        { label: '直播', value: '/pages/livePlayer/livePlayer' },
        { label: '推文', value: '/pages/recommend/recommendDetail/recommendDetail' },
        // { label: '美食推文', value: '/pages/food/tweetsDetail/tweetsDetail' },
      ],

      routeObj: {
        param: {}
      },
      curIndex: null,
      curProp: null,
      routeVisible: false,

      recommendVisible: false,

      tweetsVisible: false, // 美食推文
    };
  },
  created() {
    this.getData(1);
    this.getData(3);
  },
  methods: {
    // 获取数据
    getData(type) {
      this.imageLoading = true;
      const params = {
        type
      }
      this.Api.getCarouselList(params).then(res => {
        if (res.data.ret === 0) {
          const list = res.data.data || [];
          if (type == 1) { // 轮播图
            this.imageList = list;
          } else if (type == 2) { // 图标
            this.iconList = list;
          } else if (type == 3) { // 海报
            this.posterList = list;
          }
        } else {
          this.$message.error(`获取数据失败，${res.data.msg}`);
        }
      }).finally(() => {
        this.imageLoading = false;
      })
    },

    // 保存数据
    saveData(type) {
      let list = [];
      if (type == 1) {
        list = this.imageList;
      } else if (type == 3) {
        list = this.posterList;
      }
      const data = {
        type,
        list
      }
      this.Api.createOrUpdateCarousel(data).then(res => {
        if (res.data.ret === 0) {
          this.$message.success('保存成功！');
          this.getData(type);
        } else {
          this.$message.error(`保存失败，${res.data.msg}`);
        }
      })
    },
    
    // 打开路由跳转
    openEdit(prop, index, item) {
      console.log('打开路由跳转1', item)
      item = JSON.parse(JSON.stringify(item));
      console.log('打开路由跳转2', item)
      if (item.param) {
        item.param = JSON.parse(item.param);
      } else {
        item.param = {id: 0, name: ''};
      }
      console.log('打开路由跳转3', item)
      this.routeObj = item;
      this.curIndex = index;
      this.curProp = prop;
      this.routeVisible = true;
    },
    // 保存路由跳转
    saveImage() {
      let routeObj = JSON.parse(JSON.stringify(this.routeObj));
      routeObj.param = JSON.stringify(routeObj.param);
      this[this.curProp][this.curIndex] = routeObj;
      this.routeVisible = false;
    },

    // 选择推文
    selectRecommend(val) {
      console.log('选择推文', val)
      this.routeObj.param.id = val.recommend_id;
      this.routeObj.param.title = val.title;
      this.recommendVisible = false;
    },

    // 选择美食推文
    selectTweets(val) {
      console.log('选择美食推文', val)
      this.routeObj.param.id = val.gourmet_tweets_id;
      this.routeObj.param.title = val.title;
      this.tweetsVisible = false;
    },

    // 选择图片
    successCBKs(list, prop) {
      list.forEach(item => {
        this[prop].push({
          img_url: item.url,
          img_title: '',
          routing: '',
          param: ''
        })
      })
    },
    // 移除图片
    removeImg(index, prop) {
      this[prop].splice(index, 1);
    },
  }
};
</script>

<style lang="scss">
  .alert {
    color: #999;
    font-size: 12px;
    line-height: initial;
  }
</style>



