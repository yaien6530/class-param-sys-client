<template>
  <div class="analysis-container">
    <!-- 产品分析 -->
    <div class="floor shop-box">
      <div class="floor-head">产品分析</div>
      <div class="floor-body">
        <el-form :inline="true">
          <el-form-item>
            <el-date-picker v-model="appDates" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getProductTotal">查询</el-button>
          </el-form-item>
        </el-form>
        <div v-loading="appLoading" class="app-list">
          <div v-for="item in appList" :key="item.label" class="item">
            <div class="title">{{ item.label }}</div>
            <div class="num">{{ item.value }}</div>
          </div>
        </div>
      </div>
    </div>


    <!-- 产品排行 -->
    <div class="floor rank-box">
      <div class="floor-head">产品排行</div>
      <div class="floor-body">
        <el-form :inline="true">
          <el-form-item>
            <el-date-picker v-model="rankDates" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getProductRank">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="rankList" :header-cell-style="getRowClass" v-loading="rankLoading">
          <el-table-column label="排行" type="index" min-width="60" align="center" />
          <el-table-column label="商品" prop="name" min-width="220" align="center" />
          <el-table-column label="当前询单数" prop="inquiry_order_count" min-width="120" align="center" />
          <el-table-column label="当前询单商品数" prop="inquiry_total_count" min-width="120" align="center" />
          <el-table-column label="当前询单总金额" prop="inquiry_total_price" min-width="120" align="center" />
          <el-table-column label="订单数" prop="order_count" min-width="120" align="center" />
          <el-table-column label="订单总商品数" prop="order_total_count" min-width="120" align="center" />
          <el-table-column label="订单总金额" prop="order_total_price" min-width="120" align="center" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import productRankEcharts from "./components/productRankEcharts";

export default {
  name: "ShopDataAnalysis",
  components: { productRankEcharts },
  data() {
    return {

      appLoading: false,
      appDates: [],
      appList: [  // 平台整体
        { label: '分类总数', value: 0 },
        { label: '当前询单数', value: 0 },
        { label: '当前询单商品数', value: 0 },
        { label: '当前询单总金额', value: 0 },
        { label: '订单数', value: 0 },
        { label: '订单总商品数', value: 0 },
        { label: '订单总金额', value: 0 },
        { label: '商品总数', value: 0 }
      ],

      rankLoading: false,
      rankDates: [],
      rankList: [],

    };
  },
  created() {
    this.getProductTotal();
    this.getProductRank();
  },
  methods: {
    // 平台产品整体销售分析 - api
    getProductTotal() {
      const appDates = this.appDates || [];
      let params = {};
      if (appDates.length == 2) {
        params = {
          date_begin: appDates[0] || '',
          date_end: appDates[1] || '',
        };
      }
      this.appLoading = true;
      this.Api.queryProductTotal(params).then(res => {
        if (res.data.ret === 0) {
          const appData = res.data.data || {};
          this.appList = [
            { label: '分类总数', value: appData.category_total || 0 },
            { label: '当前询单数', value: appData.inquiry_order_count || 0 },
            { label: '当前询单商品数', value: appData.inquiry_total_count || 0 },
            { label: '当前询单总金额', value: appData.inquiry_total_price || 0 },
            { label: '订单数', value: appData.order_count || 0 },
            { label: '订单总商品数', value: appData.order_total_count || 0 },
            { label: '订单总金额', value: appData.order_total_price || 0 },
            { label: '商品总数', value: appData.product_total || 0 },
          ]
        } else {
          this.$message.error(`获取店铺实时数据失败，${res.data.msg}`);
        }
      }).catch(err => {
        this.$message.error("网络错误");
      }).finally(() => {
        this.appLoading = false;
      });
    },

    // 获取排行 - api
    getProductRank() {
      const rankDates = this.rankDates || [];
      let params = {};
      if (rankDates.length == 2) {
        params = {
          date_begin: rankDates[0] || '',
          date_end: rankDates[1] || '',
        };
      }
      this.rankLoading = true;
      this.Api.queryProductRank(params).then(res => {
        if (res.data.ret === 0) {
          this.rankList = res.data.data || [];
        } else {
          this.$message.error(`获取年度数据失败，${res.data.msg}`);
        }
      }).catch(err => {
        this.$message.error("网络错误");
      }).finally(() => {
        this.rankLoading = false;
      });
    },

    // 设置表头样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return this.Fun.getRowClass(rowIndex);
    },
    // 处理小数点
    _handleMath(num) {
      return Math.round(num * 100) / 100;
    },
  },
  
};
</script>

<style lang="scss" scoped>
@import "./style/dataAnalysis";

.app-list {
  display: flex;
  flex-wrap: wrap;
  .item {
    width: 200px;
    height: 100px;
    background: #f7f7f7;
    padding: 20px;
    margin: 0 20px 20px 0;
  }
  .title {
    font-size: 14px;
    text-align: center;
  }
  .num {
    margin-top: 20px;
    font-size: 20px;
    text-align: center;
  }
}


.rank-box {
  .echarts-box {
    height: 350px;
  }
}

</style>
