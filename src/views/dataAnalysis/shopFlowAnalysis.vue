<template>
  <div class="analysis-container">
    <!-- 周期选择 -->
    <div class="floor">
      <div class="floor-body">
        <div class="date-box">
          <span>周期选择：</span>
          <el-select v-model="periodType" @change="changePeriodType" :size="eleSize" placeholder="请选择">
            <el-option v-for="item in periodList" :key="item.type" :label="item.name" :value="item.type" />
          </el-select>
          <div v-show="periodType == 1">
            <el-date-picker v-model="periodDay" @change="event => changePeriod(event, 1)" type="date" value-format="yyyyMMdd" :size="eleSize" placeholder="请选择自然日" />
          </div>
          <div v-show="periodType == 2">
            <el-date-picker v-model="periodWeek" @change="event => changePeriod(event, 2)" type="date" :format="pickerFormat()" :picker-options="{firstDayOfWeek: 1}" :size="eleSize" placeholder="请选择自然周" />
          </div>
          <div v-show="periodType == 3">
            <el-date-picker v-model="periodMonth" @change="event => changePeriod(event, 3)" type="month" value-format="yyyyMM" :size="eleSize" placeholder="请选择自然月" />
          </div>
          <div v-show="periodType == 4">
            <el-date-picker v-model="periodYear" @change="event => changePeriod(event, 4)" type="year" value-format="yyyy" :size="eleSize" placeholder="请选择自然年" />
          </div>
          <!-- <quarter-picker v-show="periodType == 4" @getValue="event => changePeriod(event, 4)" /> -->
        </div>
      </div>
    </div>

    <!-- 流量数据总览 -->
    <div class="floor">
      <div class="floor-head">流量数据总览</div>
      <div class="floor-body flex">
        <div class="overview-list">
          <div v-for="(item, index) in overviewList" :key="index" class="overview-item">
            <div class="left" :style="{ background: item.leftBg }">
              <img :src="item.img" class="icon" />
              <div>{{ item.title }}</div>
            </div>
            <div class="right" :style="{ background: item.rightBg }">
              <div v-for="(subitem, subindex) in item.child" :key="subindex" class="overview item">
                <div class="popover-box">
                  <div class="popover-title">{{ subitem.name }}</div>
                  <el-popover :placement="popoverPlacement" :trigger="popoverTrigger" width="300">
                    <div><p v-for="(descItem, descIndex) in subitem.desc" :key="descIndex">{{ descItem }}</p></div>
                    <i slot="reference" class="popover-icon" />
                  </el-popover>
                </div>
                <div class="num">{{ subitem.count }}{{ subitem.isPercent ? '%' : '' }}</div>
                <div class="amount-increase">
                  <div class="amount-increase-item">
                    <span class="amount-increase-title">较上期</span>
                    <i v-if="subitem.lastDiff > 0" class="amount-increase-icon el-icon-top cl-red" />
                    <i v-else-if="subitem.lastDiff < 0" class="amount-increase-icon el-icon-bottom cl-green" />
                    <i v-else class="amount-increase-icon equal" />
                    <span class="amount-increase-num">{{ Math.abs(subitem.lastDiff) }}{{ subitem.isPercent ? '%' : '' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 流量走势图 -->
    <div class="floor">
      <div class="floor-head">流量走势图</div>
      <div class="floor-body trend-box">
        <div class="indicator-box">
          <el-form label-width="100px">
            <el-form-item v-for="item in trendList" :key="item.title" :label="item.title">
              <div class="indicator-list">
                <div v-for="subitem in item.list" :key="subitem.label" class="indicator-item">
                  <el-checkbox v-model="subitem.checked" @change="event => changeTrend(event, subitem.label)" :disabled="subitem.disabled">{{ subitem.value }}</el-checkbox>
                  <div v-if="subitem.desc" class="popover-box">
                    <el-popover :placement="popoverPlacement" :trigger="popoverTrigger" width="300">
                      <div><p v-for="(descItem, descIndex) in subitem.desc" :key="descIndex">{{ descItem }}</p></div>
                      <i slot="reference" class="popover-icon" />
                    </el-popover>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-form>
          <div class="indicator-num">已选&nbsp;<span class="cl-blue">{{ trendLen }}</span>/{{ trendMax }}&nbsp;个指标</div>
        </div>
        <div class="echarts-box">
          <flowTrendEcharts :list="trendData" :show="trendShow" />
        </div>
      </div>
    </div>

    <!-- 流量来源分析-->
    <div class="floor">
      <div class="floor-head">流量来源分析</div>
      <div class="floor-body source-box">
        <div class="indicator-box">
          <el-form label-width="100px">
            <el-form-item v-for="item in sourceList" :key="item.title" :label="item.title">
              <div class="indicator-list">
                <div v-for="subitem in item.list" :key="subitem.label" class="indicator-item">
                  <el-checkbox v-model="subitem.checked" @change="event => changeSource(event, subitem.label)" :disabled="subitem.disabled">{{ subitem.value }}</el-checkbox>
                  <div v-if="subitem.desc" class="popover-box">
                    <el-popover :placement="popoverPlacement" :trigger="popoverTrigger" width="300">
                      <div><p v-for="(descItem, descIndex) in subitem.desc" :key="descIndex">{{ descItem }}</p></div>
                      <i slot="reference" class="popover-icon" />
                    </el-popover>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-form>
          <div class="indicator-num">已选&nbsp;<span class="cl-blue">{{ sourceLen }}</span>/{{ sourceMax }}&nbsp;个指标</div>
        </div>
        <div class="table-box">
          <el-table :data="sourceTableList" :header-cell-style="getRowClass">
            <el-table-column label="来源类型" prop="page_name" align="center" />
            <el-table-column v-if="sourceShow[0]" label="现有访客数量" prop="visit_user" align="center" />
            <el-table-column v-if="sourceShow[1]" label="新访客数量" prop="new_visit_user" align="center" />
            <el-table-column v-if="sourceShow[2]" label="浏览量(占比)" align="center">
              <template slot-scope="{ row }">
                <div>{{row.visit_rate}}%</div>
              </template>
            </el-table-column>
            <el-table-column v-if="sourceShow[3]" label="总浏览量" prop="visit_count" align="center" />
            <el-table-column v-if="sourceShow[4]" label="人均浏览量" prop="visit_count_avg" align="center" />
          </el-table>
          <!-- 分页 -->
          <!-- <div class="pagination-common">
            <pagination v-show="total > 0" :total="total" :page.sync="now_page" :limit.sync="page_size" @pagination="getPage" />
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import quarterPicker from "./components/QuarterPicker";
import flowTrendEcharts from "./components/FlowTrendEcharts";
import Pagination from "@/components/Pagination";
export default {
  name: "ShopFlowAnalysis",
  components: { quarterPicker, flowTrendEcharts, Pagination },
  data() {
    return {
      eleSize: "mini",
      popoverTrigger: "hover",
      popoverPlacement: "top",

      periodList: [ // 周期列表
        { type: 1, name: '自然日' },
        { type: 2, name: '自然周' },
        { type: 3, name: '自然月' },
        { type: 4, name: '自然年' },
      ],
      periodType: 1, // 周期类型
      periodDay:'', // 日
      periodMonth:'', // 月
      periodWeek:'', // 周
      periodWeek2:'', // 周
      periodYear: '', // 年
      periodQuarter:'', // 季度
      periodWeekData: {}, // 周 202031

      overviewList: [ // 数据总览
        {
          title: "浏览量",
          leftBg: "#4cd48c",
          rightBg: "#c3f1d9",
          img: require("@/assets/images/flowData1.png"),
          child: [
            {
              name: "浏览量",
              desc: ["统计选择时间内，小程序所有页面（包括首页页、商品详情页、商品分类页，会员页等）被访问的次数，一个人在统计时间内访问多次记为多次。"],
              count: 100,
              lastDiff: 15
            },
            {
              name: "人均浏览量",
              desc: ["统计选择时间内的浏览量/访客数。多天的人均浏览量统计逻辑与单日相同，访客数统计跨天去重。"],
              count: 100,
              lastDiff: 15
            },
            {
              name: "客户平均停留时长(秒)",
              desc: ["统计选择的时间内，小程序所有访客停留时长总和/访客数。如果所选时间超过1天，则统计时间内的访客数跨天去重。"],
              count: 100,
              lastDiff: 15
            },
            {
              name: "跳失率",
              desc: ["统计被选择的时间内，只访问了一个页面就离开的访客数/小程序总访客数。若所选时间超过1天，访客数跨天去重。"],
              count: 100,
              lastDiff: 15
            }
          ]
        },
        {
          title: "访问量",
          leftBg: "#f07b97",
          rightBg: "#fad7e0",
          img: require("@/assets/images/flowData2.png"),
          child: [
            {
              name: "访客数量",
              desc: ["统计选择时间内，小程序所有页面（包括首页页、商品详情页、商品分类页，会员页等）被访问的人数，作去重处理，即一个人在统计时间范围内访问多次只记为一次。"],
              count: 100,
              lastDiff: 15
            },
            {
              name: "新访客数量",
              desc: ["统计选择时间内此前从未访问过小程序的新访客。若所选时间超过1天，则访客访问的第一次为新访客，之后为老访客。"],
              count: 100,
              lastDiff: 15
            },
            {
              name: "商品访问量",
              desc: ["统计选择时间内的小程序内所有商品的访问量，一个人访问多次记多次。"],
              count: 100,
              lastDiff: 15
            }
          ]
        },
        {
          title: "支付量",
          leftBg: "#0084e1",
          rightBg: "#b2daf6",
          img: require("@/assets/images/flowData3.png"),
          child: [
            {
              name: "UV价值",
              desc: ["UV价值=支付金额／访客数，若所选的时间超过1天，访客数做跨天去重处理。"],
              count: 100,
              lastDiff: 15
            },
            {
              name: "支付人数",
              desc: ["统计被选择的时间内，下单并且成功付款的客户数，做去重处理，即同一时间内一人多次付款则记为一人（不剔除退款订单）。"],
              count: 100,
              lastDiff: 15
            },
            {
              name: "支付金额",
              desc: [
                "统计被选择时间内，所有已付款的订单金额总和（会员储值不计入该指标内。且不剔除退款金额）。",
                "注：拼团订单在成团时计入付款金额。"
              ],
              count: 100,
              lastDiff: 15
            },
            {
              name: "客单价",
              desc: ["统计被选择时间内，支付金额/支付买家数。若所选时间超过一天，则支付的买家数做去重处理。"],
              count: 100,
              lastDiff: 15
            }
          ]
        },
        {
          title: "下单量",
          leftBg: "#eac258",
          rightBg: "#f9edcd",
          img: require("@/assets/images/flowData4.png"),
          child: [
            {
              name: "下单人数",
              desc: ["统计被选择的时间内，在小程序下单人数的总和。一个人在被选择时间内下单多次记为一人。"],
              count: 100,
              lastDiff: 15
            },
            {
              name: "下单金额",
              desc: ["统计被选择的时间内，成功下单的订单金额的总和（不剔除退款订单）。"],
              count: 100,
              lastDiff: 15
            },
            {
              name: "订单总数",
              desc: ["统计被选择的时间内，在小程序下单人数的总和。一个人在被选择时间内下单多次记为一人。"],
              count: 100,
              lastDiff: 15
            },
            // {
            //   name: "加购人数",
            //   desc: ["统计被选择的时间内，把商品进入添加购物车的人数，做去重处理，即一个人在统计时间内多次将商品添加到购物车记一人。"],
            //   count: 100,
            //   lastDiff: 15
            // }
          ]
        },
        {
          title: "转化率",
          leftBg: "#ff523a",
          rightBg: "#ffcbc4",
          img: require("@/assets/images/flowData5.png"),
          child: [
            {
              name: "商品访问转化率",
              desc: ["统计被选择时间内，商品访客数 / 访客数。"],
              count: 100,
              lastDiff: 15,
              isPercent: true,
            },
            {
              name: "访问-支付转化率",
              desc: ["统计被选择时间内，付款人数 / 访客数。"],
              count: 100,
              lastDiff: 15,
              isPercent: true,
            },
            // {
            //   name: "访问-加购转化率",
            //   desc: ["统计被选择时间内，将商品加入购物车的人数 / 访客数。"],
            //   count: 100,
            //   lastDiff: 15,
            //   isPercent: true,
            // }
          ]
        }
      ],

      trendList: [ // 流量走势图
        {
          title: "浏览访问量：",
          list: [
            {
              label: 1,
              value: "现有访客数量",
              checked: true
            },
            {
              label: 2,
              value: "新访客数量",
              checked: false
            },
            {
              label: 3,
              value: "总浏览量",
              desc: ["统计时间内，小程序的所有页面被浏览的总量"],
              checked: false,
            },
            {
              label: 4,
              value: "人均浏览量",
              desc: ["统计时间内，小程序的浏览量/总访客数。"],
              checked: false,
            },
            {
              label: 5,
              value: "跳失率",
              desc: ["统计被选择时间内，访客只访问了一个小程序页面就离开店铺的人数/总访客数。"],
              checked: false,
            },
            {
              label: 6,
              value: "平均停留时长(秒)",
              desc: ["在统计时间内，访问小程序的所有访客总的停留时长/总访客数，单位为秒。"],
              checked: false,
            }
          ]
        },
        {
          title: "成交转化量：",
          list: [
            {
              label: 7,
              value: "访问-支付转化率",
              checked: true
            },
            // {
            //   label: 8,
            //   value: "访问-加购转化率",
            //   checked: false
            // },
            {
              label: 9,
              value: "商品访问转化率",
              checked: false
            },
            {
              label: 10,
              value: "支付人数",
              desc: ["统计时间内，小程序的支付人数总数。"],
              checked: false,
            }
          ]
        }
      ],
      trendData: [  // 图表数据
        {
          date: '2020-04-12',
          nowViewUser: 102, 
          newViewUser: 291,
          totalViewNum: 191,
          aveViewNum: 191,
          jumpLoseRate: 80,
          aveRemainDuration: 108,
          viewPayRate: 71,
          viewBuyRate: 17,
          productViewRate: 91,
          payUser: 182,
        },
        {
          date: '2020-04-13',
          nowViewUser: 112, 
          newViewUser: 211,
          totalViewNum: 91,
          aveViewNum: 61,
          jumpLoseRate: 56,
          aveRemainDuration: 198,
          viewPayRate: 82,
          viewBuyRate: 87,
          productViewRate: 79,
          payUser: 112,
        },
        {
          date: '2020-04-15',
          nowViewUser: 151, 
          newViewUser: 291,
          totalViewNum: 31,
          aveViewNum: 93,
          jumpLoseRate: 26,
          aveRemainDuration: 178,
          viewPayRate: 62,
          viewBuyRate: 32,
          productViewRate: 59,
          payUser: 132,
        }
      ],
      trendShow: [], // 展示判断
      trendLen: 2,
      trendMax: 5,

      sourceList: [ // 流量来源分析
        {
          title: "流量访问量：",
          list: [
            {
              label: 1,
              value: "现有访客数量",
              desc: ["统计时间内，访问对应小程序页面的访客总数量"],
              checked: true
            },
            {
              label: 2,
              value: "新访客数量",
              desc: ["统计时间内，新进入小程序对应页面的访客总量，做去重处理，一个人访问多次算一次。"],
              checked: false
            },
            {
              label: 3,
              value: "浏览量(占比)",
              desc: [
                "统计时间内，小程序所有页面（包括但不限于首页登录、分享、商品详情页，秒杀，拼团等）被访问的并去重人数，即一个人在统计时间多次访问记为一个。",
                "浏览量占比：统计时间内，流量页面的来源的访客数/所有流量来源的访客数的累加之和，不做去重处理。"
              ],
              checked: true
            },
            {
              label: 4,
              value: "总浏览量",
              desc: ["统计时间内，小程序的所有页面被浏览的总量"],
              checked: false
            },
            {
              label: 5,
              value: "人均浏览量",
              desc: ["统计时间内，小程序所有页面的浏览总量/总访客数。"],
              checked: false
            }
          ]
        },
        // {
        //   title: "成交转化量：",
        //   list: [
        //     {
        //       label: 6,
        //       value: "访问-支付转化率",
        //       desc: ["统计时间内，小程序付款人数 / 总访客数。"],
        //       checked: true
        //     },
        //     {
        //       label: 7,
        //       value: "访问-加购转化率",
        //       desc: ["统计时间内，小程序付款人数 / 总访客数。"],
        //       checked: false
        //     },
        //     {
        //       label: 8,
        //       value: "商品访问转化率",
        //       desc: ["统计时间内，访问小程序商品的访客数 / 总访客数。"],
        //       checked: false
        //     },
        //     {
        //       label: 9,
        //       value: "UV价值",
        //       desc: ["统计时间内，UV价值=支付金额／访客数，若所选的时间超过1天，访客数做跨天去重处理。"],
        //       checked: false
        //     }
        //   ]
        // },
        // {
        //   title: "下单量：",
        //   list: [
        //     {
        //       label: 10,
        //       value: "支付人数",
        //       desc: ["统计时间内，小程序的支付人数总数。"],
        //       checked: false
        //     },
        //     {
        //       label: 11,
        //       value: "支付金额",
        //       desc: ["统计时间内，小程序的支付金额总数。"],
        //       checked: false
        //     },
        //     {
        //       label: 12,
        //       value: "下单人数",
        //       desc: ["统计时间内，小程序的下单人数总数。"],
        //       checked: false
        //     },
        //     {
        //       label: 13,
        //       value: "下单金额",
        //       desc: ["统计时间内，小程序的下单金额总和。"],
        //       checked: false
        //     },
        //     {
        //       label: 14,
        //       value: "加购人数",
        //       desc: ["统计时间内，在小程序把商品加入购物车的人数总和，做去重处理，即一个人在统计时间内多次添加商品到购物车只记为一人。"],
        //       checked: false
        //     },
        //     {
        //       label: 15,
        //       value: "客单价",
        //       desc: ["统计时间内，平均每个支付买家的支付金额，如选择时间超过一天，则支付买家数做跨天去重处理。支付金额/支付买家数，"],
        //       checked: false
        //     }
        //   ]
        // }
      ],
      sourceShow: [],
      sourceLen: 2,
      sourceMax: 5,
      sourceCheckedList: [],
      sourceTableList: [],

      now_page: 1, // 当前页
      page_size: 10, // 每页条数
      total: 10, // 订单条数
    };
  },
  created() {
    this.getCurTime();
    this.getShopFlows();
  },
  methods: {
    // 获取数据总览 - api
    getShopFlows() {
      const {periodType, periodDay, periodMonth, periodYear, periodWeekData} = this;
      let date = '';
      if (periodType == 1) {
        date = periodDay;
      } else if (periodType == 2) {
        date = `${periodWeekData.year}${periodWeekData.month}${periodWeekData.day}`
      } else if (periodType == 3) {
        date = periodMonth;
      } else if (periodType == 4) {
        date = periodYear;
      }
      const params = {
        date,
        type: periodType
      };
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.Api.getShopFlows(params).then(res => {
        if (res.data.ret === 0) {
          const resData = res.data.data;
          this.getOverviewData(resData); // 处理浏览数据总览
          this.getTrendData(resData.flows); // 处理流量走势图
          this.getSourceData(resData.page_visits); // 处理流量来源分析数据
        } else {
          this.$message.error(`获取数据总览失败，${res.data.msg}`);
        }
      }).catch(err => {
        this.$message.error("网络错误");
      }).finally(() => {
        loading.close();
      });
    },
    
    // 获取浏览数据总览
    getOverviewData(resData) {
      // 浏览量
      this.overviewList[0].child[0].count = resData.visit_count || 0;
      this.overviewList[0].child[0].lastDiff = this._handleMath((resData.visit_count || 0) - (resData.last_visit_count || 0))
      this.overviewList[0].child[1].count = resData.visit_avg || 0;
      this.overviewList[0].child[1].lastDiff = this._handleMath((resData.visit_avg || 0) - (resData.last_visit_avg || 0));
      this.overviewList[0].child[2].count = resData.visit_time_avg || 0;
      this.overviewList[0].child[2].lastDiff = this._handleMath((resData.visit_time_avg || 0) - (resData.last_visit_time_avg || 0));
      this.overviewList[0].child[3].count = resData.lost_rate || 0;
      this.overviewList[0].child[3].lastDiff = this._handleMath((resData.lost_rate || 0) - (resData.last_lost_rate || 0));
      // 访问量
      this.overviewList[1].child[0].count = resData.visit_user || 0;
      this.overviewList[1].child[0].lastDiff = this._handleMath((resData.visit_user || 0) - (resData.last_visit_user || 0));
      this.overviewList[1].child[1].count = resData.new_visit_user || 0;
      this.overviewList[1].child[1].lastDiff = this._handleMath((resData.new_visit_user || 0) - (resData.last_new_visit_user || 0));
      this.overviewList[1].child[2].count = resData.product_visit || 0;
      this.overviewList[1].child[2].lastDiff = this._handleMath((resData.product_visit || 0) - (resData.last_product_visit || 0));
      // 支付量
      this.overviewList[2].child[0].count = resData.uvalue || 0;
      this.overviewList[2].child[0].lastDiff = this._handleMath((resData.uvalue || 0) - (resData.last_uvalue || 0));
      this.overviewList[2].child[1].count = resData.pay_user || 0;
      this.overviewList[2].child[1].lastDiff = this._handleMath((resData.pay_user || 0) - (resData.last_pay_user || 0));
      this.overviewList[2].child[2].count = resData.pay_amount || 0;
      this.overviewList[2].child[2].lastDiff = this._handleMath((resData.pay_amount || 0) - (resData.last_pay_amount || 0));
      this.overviewList[2].child[3].count = resData.pay_amount_avg || 0;
      this.overviewList[2].child[3].lastDiff = this._handleMath((resData.pay_amount_avg || 0) - (resData.last_pay_amount_avg || 0));
      // 下单量
      this.overviewList[3].child[0].count = resData.pay_user || 0;
      this.overviewList[3].child[0].lastDiff = this._handleMath((resData.pay_user || 0) - (resData.last_pay_user || 0));
      this.overviewList[3].child[1].count = resData.pay_amount || 0;
      this.overviewList[3].child[1].lastDiff = this._handleMath((resData.pay_amount || 0) - (resData.last_pay_amount || 0));
      this.overviewList[3].child[2].count = resData.pay_order || 0;
      this.overviewList[3].child[2].lastDiff = this._handleMath((resData.pay_order || 0) - (resData.last_pay_order || 0));
      // 转化率
      this.overviewList[4].child[0].count = resData.product_visit_rate || 0;
      this.overviewList[4].child[0].lastDiff = this._handleMath((resData.product_visit_rate || 0) - (resData.last_product_visit_rate || 0));
      this.overviewList[4].child[1].count = resData.visit_pay_rate || 0;
      this.overviewList[4].child[1].lastDiff = this._handleMath((resData.visit_pay_rate || 0) - (resData.last_visit_pay_rate || 0));
    },
    // 处理小数
    _handleMath(num) {
      return Math.round(num * 100) / 100;
    },

    // 获取流量走势图
    getTrendData(resList) {
      this.trendData = resList.map(item => {
        return {
          date: item.date,
          nowViewUser: item.visit_user || 0,  // 现有访客数
          newViewUser: item.new_visit_user || 0, // 新访客数
          totalViewNum: item.visit_count || 0, // 总浏览量
          aveViewNum: item.visit_avg || 0, // 人均浏览量
          jumpLoseRate: item.lost_rate || 0, // 跳失率
          aveRemainDuration: item.visit_time_avg || 0, // 平均停留时长
          viewPayRate: item.visit_pay_rate || 0, // 访问-支付转化率
          viewBuyRate: 0, // 访问-加购转化率
          productViewRate: item.product_visit_rate || 0, // 商品访问转化率
          payUser: item.pay_user || 0, // 支付人数
        }
      })
      this._handleShowList(1);
    },

    // 获取流量来源分析数据
    getSourceData(resList) {
      this.sourceTableList = resList;
      this._handleShowList(2);
    },

    // 获取当前时间
    getCurTime() {
      const curData = new Date();
      const year = curData.getFullYear();
      let month = curData.getMonth() + 1;
      let day = curData.getDate();
      month = month > 10 ? month : '0' + month;
      day = day > 10 ? day : '0' + day;
      this.periodDay = `${year}${month}${day}`;
    },
    // 切换周期类型
    changePeriodType() {
      this.periodDay = '';
      this.periodMonth = '';
      this.periodWeek = '';
      this.periodYear = '';
    },
    // 切换周期 type 1日 2周 3月 4年
    changePeriod(value, type) {
      if (type == 2) {
        this._handleWeek();
      }
      if (value) {
        this.getShopFlows();
      }
    },
    // 获取某年中第几周
    _handleWeek() {
      const date = this.periodWeek;
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = month > 10 ? month : '0' + month;
      day = day > 10 ? day : '0' + day;

      let dateNow = new Date(year, parseInt(month) - 1, day);
      let dateFirst = new Date(year, 0, 1);
      let dataNumber = Math.round(
        (dateNow.valueOf() - dateFirst.valueOf()) / 86400000
      );
      let week = Math.ceil((dataNumber + (dateFirst.getDay() + 1 - 1)) / 7);
      week = week > 10 ? week : `0${week}`;

      this.periodWeekData = { year, month, day, week };
    },
    // 修改自然周展示格式
    pickerFormat() {
      const {year, week} = this.periodWeekData;
      return `${year}年 第 ${week} 周`;
    },

    // 切换流量走势图
    changeTrend(e, label) {
      let len = 0;
      this.trendList.forEach(item => {
        item.list.forEach(subitem => {
          if (subitem.checked) {
            len = len + 1;
          }
        });
      });
      this.trendList.forEach(item => {
        item.list.forEach(subitem => {
          if (len == 0 && subitem.label == label) { // 选中数量为0，处理必选一个
            subitem.checked = true;
          } else if (len >= this.trendMax && !subitem.checked) { // 选中数量达到极限，没选中的禁选
            subitem.disabled = true;
          } else { // 全都不禁选
            subitem.disabled = false;
          }
        });
      });
      if (len != 0) {
        this.trendLen = len;
      }
      this._handleShowList(1);
    },
    // 切换流量来源分析
    changeSource(e, label) {
      let len = 0;
      let checkedList = [];
      this.sourceList.forEach(item => {
        item.list.forEach(subitem => {
          if (subitem.checked) {
            len = len + 1;
          }
        });
      });
      this.sourceList.forEach(item => {
        item.list.forEach(subitem => {
          if (len == 0 && subitem.label == label) {
            subitem.checked = true;
          } else if (len >= this.trendMax && !subitem.checked) {
            subitem.disabled = true;
          } else {
            subitem.disabled = false;
          }
        });
      });
      if (len != 0) {
        this.sourceLen = len;
        this.sourceCheckedList = checkedList;
      }
      this._handleShowList(2);
    },
    // 处理展示list
    _handleShowList(type) {
      let propList = '';
      let propShow = '';
      if (type == 1) { // 浏览走势图
        propList = 'trendList';
        propShow = 'trendShow';
        this.trendShow[7] = false;
      } else if (type == 2) { // 浏览来源分析
        propList = 'sourceList';
        propShow = 'sourceShow';
        this.sourceShow = [];
      }

      let showList = [];
      this[propList].forEach(item => {
        item.list.forEach(subitem => {
          showList[subitem.label - 1] = subitem.checked || false;
        })
      })
      this[propShow] = showList;
    },
    
    //  分页
    getPage(val) {
      this.now_page = val.page;
      this.page_size = val.limit;
      this.getData();
    },
    // 设置表头样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return this.Fun.getRowClass(rowIndex);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./style/dataAnalysis";

/* 流量数据总览 */
.overview-list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.overview-item {
  display: flex;
  width: 50%;
  margin: 0 20px 20px 0;
  &:nth-child(2n) {
    margin-right: 0;
    flex: 1;
  }
  > .left {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    width: 70px;
    color: #fff;
    text-align: center;
    .icon {
      width: 24px;
      margin: 0 auto 15px;
    }
  }
  > .right {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    padding: 16px 0 16px 30px;
    > .item {
      width: 50%;
      margin-top: 26px;
      &:nth-child(-n + 2) {
        margin-top: 0;
      }
    }
    .num {
      margin: 6px 0;
      font-size: 14px;
    }
  }
}

/* 流量走势图 */
.trend-box {
  .indicator-item {
    min-width: 150px;
  }
  .echarts-box {
    height: 400px;
    margin-top: 40px;
  }
}

/* 流量来源分析 */
.source-box {
  .indicator-item {
    min-width: 160px;
  }
  .table-box {
    margin-top: 20px;
  }
}

/* 指标 */
.indicator-box {
  padding: 10px 20px 15px;
  border-radius: 6px;
  background: #f7f7f7;
  .el-form-item {
    margin-bottom: 0;
  }
}
.indicator-num {
  margin-top: 10px;
  color: #999;
  font-size: 14px;
}
.indicator-list {
  display: flex;
  flex-wrap: wrap;
}
.indicator-item {
  display: flex;
  align-items: center;
  margin-right: 10px;
  .el-checkbox {
    margin-right: 5px;
  }
  .el-form {
    .el-form-item {
      margin-bottom: 0;
    }
  }
}

/* 数据共用 */
.data-common {
  display: flex;
  height: 100px;
  padding: 0 30px;
  border-radius: $bdr1;
  background: $bg-gray;
  font-size: 14px;
  &-item {
    width: 50%;
    text-align: center;
  }
  &-title {
    margin-top: 30px;
  }
  &-num {
    margin-top: 15px;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
