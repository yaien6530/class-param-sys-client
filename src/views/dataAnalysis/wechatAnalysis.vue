<template>
  <div class="analysis-container">
    <!-- 整体分析 -->
    <div class="floor year-box">
      <div class="floor-head">小程序整体统计</div>
      <div class="floor-body">
        <div v-loading="allLoading" class="app-list">
          <div v-for="item in allList" :key="item.label" class="item">
            <div class="title">{{ item.date }}</div>
            <div class="cont">
              <div class="num">点击数：{{ item.click }}</div>
              <div class="num">登录数：{{ item.login }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 月统计 -->
    <div class="floor year-box">
      <div class="floor-head">小程序统计</div>
      <div class="floor-body">
        <el-form :inline="true">
          <el-form-item>
            <el-select v-model="type" placeholder="请选择">
              <el-option label="月份" :value="3" />
              <el-option label="年度" :value="4" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="type === 3">
            <el-date-picker v-model="monthDate" type="month" value-format="yyyyMM" placeholder="选择月" />
          </el-form-item>
          <el-form-item v-else-if="type === 4">
            <el-date-picker v-model="yearDate" type="year" value-format="yyyy" placeholder="选择年" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getUserAnalysis">查询</el-button>
          </el-form-item>
        </el-form>
        <div v-loading="userLoading" class="echarts-box">
          <!-- <monthEcharts :list="userList" /> -->
          <yearEcharts :list="userList" />
        </div>
      </div>
    </div>

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
      allList: [],
      allLoading: false,

      type: 3,
      yearDate: '', // 年
      monthDate: '', // 月
      userLoading: false,
      userList: [],


    };
  },
  created() {
    new Promise(resolve => {
      this.getCurTime(resolve);
    }).then(() => {
      this.getAnalysisAll();
      this.getUserAnalysis();
    })
  },
  methods: {
    // 整体分析
    getAnalysisAll() {
      this.allLoading = true;
      this.Api.getAnalysisAll().then(res => {
        if (res.data.ret === 0) {
          this.allList = res.data.data || [];
        } else {
          this.$message.error(`获取店铺实时数据失败，${res.data.msg}`);
        }
      }).catch(err => {
        this.$message.error("网络错误");
      }).finally(() => {
        this.allLoading = false;
      });
    },

    // 获取年度 - api
    getUserAnalysis() {
      const type = this.type;
      let date = '';
      if (type === 3) {
        date = this.monthDate;
      } else if (type == 4) {
        date = this.yearDate
      }
      const params = {
        type,
        date
      };
      this.userLoading = true;;
      this.Api.getUserAnalysis(params).then(res => {
        if (res.data.ret === 0) {
          this.userList = res.data.data || [];
        } else {
          this.$message.error(`获取年度数据失败，${res.data.msg}`);
        }
      }).catch(err => {
        this.$message.error("网络错误");
      }).finally(() => {
        this.userLoading = false;
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
  .item {
    width: 33%;
    background: #f7f7f7;
    padding: 20px;
    margin-right: 20px;
    &:last-child {
      margin-right: 0;
    }
  }
  .title {
    font-size: 18px;
    text-align: center;
    margin-bottom: 10px;
  }
  .cont {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  .num {
    margin: 10px 20px;
    font-size: 16px;
    text-align: center;
  }
}


.year-box {
  .echarts-box {
    height: 350px;
  }
}

</style>
