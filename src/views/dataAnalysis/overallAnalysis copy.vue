<template>
  <div class="analysis-container">
    <!-- 整体分析 -->
    <div class="floor shop-box">
      <div class="floor-head">整体分析</div>
      <div class="floor-body">
        <el-form :inline="true">
          <el-form-item>
            <el-date-picker v-model="appDates" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getAppAnalysis">查询</el-button>
          </el-form-item>
        </el-form>
        <!-- 指标描述 -->
        <div v-loading="appLoading" class="app-list">
          <div v-for="item in appList" :key="item.label" class="item">
            <div class="title">{{ item.label }}</div>
            <div class="num">{{ item.value }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 年统计 -->
    <div class="floor year-box">
      <div class="floor-head">年统计</div>
      <div class="floor-body">
        <el-form :inline="true">
          <el-form-item>
            <el-date-picker v-model="yearDate" type="year" value-format="yyyy" placeholder="选择年" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getYearOrder">查询</el-button>
          </el-form-item>
        </el-form>
        <div v-loading="yearLoading" class="echarts-box">
          <yearEcharts :list="yearList" />
        </div>
      </div>
    </div>

    <!-- 月统计 -->
    <div class="floor year-box">
      <div class="floor-head">月统计</div>
      <div class="floor-body">
        <el-form :inline="true">
          <el-form-item>
            <el-date-picker v-model="monthDate" type="month" value-format="yyyyMM" placeholder="选择月" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getMonthOrder">查询</el-button>
          </el-form-item>
        </el-form>
        <div v-loading="monthLoading" class="echarts-box">
          <monthEcharts :list="monthList" />
        </div>
      </div>
    </div>

    <!-- 客户经理销售排行 -->
    <div class="floor">
      <div class="floor-head">客户经理销售排行</div>
      <div class="floor-body">
        <el-form :inline="true">
          <el-form-item>
            <el-date-picker v-model="managerRankDates" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getManagerRank">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="managerRankList" :header-cell-style="getRowClass" v-loading="managerRankLoading">
          <el-table-column label="排行" type="index" min-width="50" align="center" />
          <el-table-column label="经理名" prop="manager_name" min-width="110" align="center" />
          <el-table-column label="客户数" prop="customer_total" min-width="110" align="center" />
          <el-table-column label="当前询单数" prop="inquiry_order_count" min-width="110" align="center" />
          <el-table-column label="订单数" prop="order_count" min-width="110" align="center" />
          <el-table-column label="销售额" prop="sale_total_price" min-width="110" align="center" />
          <el-table-column label="转化率" prop="transfer_rate" min-width="110" align="center" />
          <el-table-column label="操作" width="70" align="center" fixed="right">
            <template slot-scope="{ row }">
              <el-button type="text" @click="getManagerPortrait(row.user_id)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 客户画像 -->
    <el-dialog title="客户画像" :visible.sync="customerPortraitVisible" width="500px">
      <el-table :data="customerPortrait.customer_portraits" :header-cell-style="getRowClass" v-loading="customerPortraitLoading">
        <el-table-column label="客户名" prop="name" min-width="110" align="center" />
        <el-table-column label="当前询单数" prop="inquiry_order_count" min-width="110" align="center" />
        <el-table-column label="订单数" prop="order_count" min-width="110" align="center" />
        <el-table-column label="销售额" prop="sale_total_price" min-width="110" align="center" />
      </el-table>
    </el-dialog>


  </div>
</template>

<script>
import yearEcharts from "./components/yearEcharts";
import monthEcharts from "./components/monthEcharts";
import managerRankEcharts from "./components/monthEcharts";


export default {
  name: "ShopDataAnalysis",
  components: { yearEcharts, monthEcharts, managerRankEcharts },
  data() {
    return {
      appDates: [],
      appList: [  // 平台整体
        { label: '订单总商品数', value: 0 },
        { label: '订单数', value: 0 },
        { label: '订单总金额', value: 0 },
        { label: '当前询单商品数', value: 0 },
        { label: '当前询单数', value: 0 },
        { label: '当前询单总金额', value: 0 },
        { label: '用户总数', value: 0 },
        { label: '客户经理总数', value: 0 },
        { label: '转化率', value: 0 },
      ],

      appLoading: false,


      yearDate: '',
      yearList: [],
      yearLoading: false,

      monthDate: '',
      monthList: [],
      monthLoading: false,

      managerRankDates: [],
      managerRankList: [],
      managerRankLoading: false,

      customerPortrait: {},
      customerPortraitLoading: false,
      customerPortraitVisible: false,

    };
  },
  created() {
    new Promise(resolve => {
      this.getCurTime(resolve);
    }).then(() => {
      this.getAppAnalysis();
      this.getYearOrder();
      this.getMonthOrder();
      this.getManagerRank();
    })
  },
  methods: {
    // 获取平台整体经营分析 - api
    getAppAnalysis() {
      const appDates = this.appDates || [];
      let params = {};
      if (appDates.length == 2) {
        params = {
          date_begin: appDates[0] || '',
          date_end: appDates[1] || '',
        };
      }
      this.appLoading = true;
      this.Api.getAppAnalysis(params).then(res => {
        if (res.data.ret === 0) {
          let {order_total_count = 0, order_count = 0, order_total_price = 0, inquiry_total_count = 0, inquiry_order_count = 0, inquiry_total_price = 0, user_total = 0, manager_total = 0 } = res.data.data || {};
          let transfer_rate = order_count / (order_count + inquiry_order_count) * 100;
          transfer_rate = this._handleMath(transfer_rate) || 0;
          this.appList = [
            { label: '订单总商品数', value: order_total_count },
            { label: '订单数', value: order_count },
            { label: '订单总金额', value: order_total_price },
            { label: '当前询单商品数', value: inquiry_total_count },
            { label: '当前询单数', value: inquiry_order_count },
            { label: '当前询单总金额', value: inquiry_total_price },
            { label: '用户总数', value: user_total },
            { label: '客户经理总数', value: manager_total },
            { label: '转化率', value: transfer_rate + '%' },
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
    // 获取年度 - api
    getYearOrder() {
      const params = {
        year: this.yearDate || '',
      };
      this.yearLoading = true;;
      this.Api.queryYearMonthOrder(params).then(res => {
        if (res.data.ret === 0) {
          this.yearList = res.data.data || [];
        } else {
          this.$message.error(`获取年度数据失败，${res.data.msg}`);
        }
      }).catch(err => {
        this.$message.error("网络错误");
      }).finally(() => {
        this.yearLoading = false;
      });
    },
    // 获取月度 - api
    getMonthOrder() {
      const params = {
        month: this.monthDate || '',
      };
      this.monthLoading = true;
      this.Api.queryMonthDaysOrder(params).then(res => {
        if (res.data.ret === 0) {
          this.monthList = res.data.data || [];
        } else {
          this.$message.error(`获取年度数据失败，${res.data.msg}`);
        }
      }).catch(err => {
        this.$message.error("网络错误");
      }).finally(() => {
        this.monthLoading = false;
      });
    },

    // 客户经理销售排行 - api
    getManagerRank() {
      const managerRankDates = this.managerRankDates || [];
      let params = {};
      if (managerRankDates.length == 2) {
        params = {
          date_begin: managerRankDates[0] || '',
          date_end: managerRankDates[1] || '',
        };
      }
      this.managerRankLoading = true;
      this.Api.queryManagerRank(params).then(res => {
        if (res.data.ret === 0) {
          this.managerRankList = res.data.data || [];
        } else {
          this.$message.error(`获取年度数据失败，${res.data.msg}`);
        }
      }).catch(err => {
        this.$message.error("网络错误");
      }).finally(() => {
        this.managerRankLoading = false;
      });
    },
    // 客户经理画像 - api
    getManagerPortrait(user_id) {
      const params = {
        manager_user_id: user_id
      };
      this.customerPortraitLoading = true;
      this.customerPortraitVisible = true;
      this.Api.queryManagerPortrait(params).then(res => {
        if (res.data.ret === 0) {
          let customerPortrait = res.data.data || {};
          customerPortrait.customer_portraits = customerPortrait.customer_portraits || [];
          this.customerPortrait = customerPortrait;
        } else {
          this.$message.error(`获取年度数据失败，${res.data.msg}`);
        }
      }).catch(err => {
        this.$message.error("网络错误");
      }).finally(() => {
        this.customerPortraitLoading = false;
      });
    },

    // 获取当前时间
    getCurTime(resolve) {
      const curTime = new Date().getTime();
      this.curTime = curTime;
      this.operationTime = curTime; // 运营时间
      this.saleTime = curTime; // 销售时间

      const curData = new Date();
      const year = curData.getFullYear();
      let month = curData.getMonth() + 1;
      let day = curData.getDate();
      month = month > 10 ? month : '0' + month;
      day = day > 10 ? day : '0' + day;

      this.yearDate = `${year}`;
      this.monthDate = `${year}${month}`;

      resolve();
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


.year-box {
  .echarts-box {
    height: 350px;
  }
}

</style>
