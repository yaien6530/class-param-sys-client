<template>
  <div class="analysis-container">
    <!-- 店铺实时数据 -->
    <div class="floor shop-box">
      <div class="floor-head">店铺实时数据</div>
      <div v-loading="shopLoading" class="floor-body flex">
        <!-- 指标描述 -->
        <div class="shop-indicator-list">
          <template v-for="(item, index) in shopIndicatorList">
            <div v-if="index < 4" :key="item.title" class="shop-indicator-item">
              <div class="top">
                <div class="popover-box">
                  <div class="popover-title">{{ item.title }}</div>
                  <el-popover :placement="popoverPlacement" :trigger="popoverTrigger" width="300">
                    <div><p v-for="(descItem, descIndex) in item.desc" :key="descIndex">{{ descItem }}</p></div>
                    <i slot="reference" class="popover-icon" />
                  </el-popover>
                </div>
                <div class="num">{{ item.todayCount }}</div>
              </div>
              <div class="amount-increase">
                <div class="amount-increase-item">
                  <span class="amount-increase-title">昨日全天</span>
                  <span class="amount-increase-num">{{ item.yesterdayCount }}</span>
                </div>
                <div class="amount-increase-item">
                  <span class="amount-increase-title">涨幅</span>
                  <i v-if="item.percent > 0" class="amount-increase-icon el-icon-top cl-red" />
                  <i v-else-if="item.percent < 0" class="amount-increase-icon el-icon-bottom cl-green" />
                  <i v-else class="amount-increase-icon equal" />
                  <span class="amount-increase-num">{{ Math.abs(item.percent) }}%</span>
                </div>
              </div>
            </div>
          </template>
        </div>
        <!-- 支付情况 -->
        <div class="shop-pay">
          <div class="head">
            <div class="popover-box">
              <div class="popover-title">{{ shopIndicatorList[4].title }}</div>
              <el-popover :placement="popoverPlacement" :trigger="popoverTrigger" width="300">
                <div>
                  <p v-for="(descItem, descIndex) in shopIndicatorList[4].desc" :key="descIndex">{{ descItem }}</p>
                </div>
                <i slot="reference" class="popover-icon" />
              </el-popover>
            </div>
            <div class="amount-increase">
              <div class="amount-increase-item">
                <div class="amount-increase-num today">{{ shopIndicatorList[4].todayCount }}元</div>
              </div>
              <div class="amount-increase-item">
                <div class="amount-increase-title">昨日全天</div>
                <div class="amount-increase-num">{{ shopIndicatorList[4].yesterdayCount }}</div>
              </div>
              <div class="amount-increase-item">
                <div class="amount-increase-title">涨幅</div>
                <i v-if="shopIndicatorList[4].percent > 0" class="amount-increase-icon el-icon-top cl-red" />
                <i v-else-if="shopIndicatorList[4].percent < 0" class="amount-increase-icon el-icon-bottom cl-green" />
                <i v-else class="amount-increase-icon equal" />
                <div class="amount-increase-num">{{ Math.abs(shopIndicatorList[4].percent) }}%</div>
              </div>
            </div>
          </div>
          <div class="echarts-box">
            <shopPayEcharts :list="payList" />
          </div>
        </div>
      </div>
    </div>

    <!-- 运营指标 -->
    <div class="floor operation-box">
      <div class="floor-head">运营指标</div>
      <div class="floor-body">
        <div class="date-box">
          <span>时间选择：</span>
          <el-date-picker v-model="operationTime" @change="changeOperationData" type="date" value-format="timestamp" :size="eleSize" />
        </div>
        <div v-loading="operationLoading">
          <div class="operation-indicator">
            <div class="operation-indicator-head">已选&nbsp;<span class="cl-blue">{{ operationLen }}</span>/{{ operationMax }}&nbsp;个指标</div>
            <div class="operation-indicator-body scroll-box">
              <i @click="changeScroll(1)" class="scroll-btn left el-icon-arrow-left" :class="{ not: curIndex == 0 }" />
              <div ref="scrollView" class="main scroll-main">
                <div :style="{ left: offsetL + 'px' }" class="operation-indicator-list scroll-list">
                  <div ref="scrollItem" v-for="(item, index) in operationList" :key="item.type" class="operation-indicator-item scroll-item" :class="{ active: item.checked }">
                    <div class="box">
                      <div class="top">
                        <div class="popover-box">
                          <div class="popover-title">{{ item.title }}</div>
                          <el-popover v-if="item.desc" :placement="popoverPlacement" :trigger="popoverTrigger" width="300">
                            <div><p v-for="(descItem, descIndex) in item.desc" :key="descIndex">{{ descItem }}</p></div>
                            <i slot="reference" class="popover-icon" />
                          </el-popover>
                        </div>
                        <div class="num">{{ item.todayCount }}{{ index == 3 ? '%' : '' }}</div>
                      </div>
                      <div class="bottom amount-increase">
                        <div class="amount-increase-item">
                          <span class="amount-increase-title">较前一日</span>
                          <i v-if="item.yesterdayCount > 0" class="amount-increase-icon el-icon-top cl-red" />
                          <i v-else-if="item.yesterdayCount < 0" class="amount-increase-icon el-icon-bottom cl-green" />
                          <i v-else class="amount-increase-icon equal" />
                          <span class="amount-increase-num">{{ Math.abs(item.yesterdayCount) }}{{ index == 3 ? '%' : '' }}</span>
                        </div>
                        <div class="amount-increase-item">
                          <span class="amount-increase-title">较上一周</span>
                          <i v-if="item.lastWeekCount > 0" class="amount-increase-icon el-icon-top cl-red" />
                          <i v-else-if="item.lastWeekCount < 0" class="amount-increase-icon el-icon-bottom cl-green" />
                          <i v-else class="amount-increase-icon equal" />
                          <span class="amount-increase-num">{{ Math.abs(item.lastWeekCount) }}{{ index == 3 ? '%' : '' }}</span>
                        </div>
                      </div>
                    </div>
                    <el-checkbox v-model="item.checked" @change="event => changeOperationInd(event, item.type)" :disabled="item.disabled" class="checkbox" />
                  </div>
                </div>
              </div>
              <i @click="changeScroll(2)" class="scroll-btn right el-icon-arrow-right" :class="{ not: curIndex == allIndex }" />
            </div>
          </div>
          <div class="echarts-box">
            <operationIndicatorEcharts :list="operationData" :show="operationShow" />
          </div>
        </div>
      </div>
    </div>

    <!-- 销售目标管理 -->
    <div class="floor sale-target-box">
      <div class="floor-head">销售目标管理</div>
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
          <quarter-picker v-show="periodType == 4" :defaultValue="periodQuarter" @getValue="event => changePeriod(event, 4)" />
        </div>
        <div v-loading="saleLoading">
          <div class="target-box">
            <div class="target-progress-box box">
              <div class="top">
                {{ saleMonth }}销售进度
                <el-button @click="openTargetSet" type="text">目标设定</el-button>
              </div>
              <el-progress :percentage="salePercent" :color="'#e52e2e'" />
              <div class="bottom">{{ curSale }}&nbsp;/&nbsp;{{ tarSale }}</div>
            </div>
            <div class="data-common box">
              <div class="data-common-item">
                <!-- <div class="data-common-title">{{saleTotalPayTitle}}（元）</div> -->
                <div class="data-common-title">本期（元）</div>
                <div class="data-common-num">{{saleTotalPay}}</div>
              </div>
              <div class="data-common-item"> 
                <!-- <div class="data-common-title">{{saleLastTotalPayTitle}}（元）</div> -->
                <div class="data-common-title">上期（元）</div>
                <div class="data-common-num">{{saleLastTotalPay}}</div>
              </div>
            </div>
          </div>
          <div class="echarts-box">
            <saleDataEcharts :list="saleList" :type="periodType" />
          </div>
        </div>
      </div>
    </div>

    <!-- 退款数据分析 echart -->
    <div class="floor refund-box">
      <div class="floor-head">退款数据分析</div>
      <div class="floor-body">
        <div v-loading="refundLoading" class="refund-echrt-box">
          <div v-for="item in refundList" :key="item.title" class="refund-echrt-item">
            <div class="popover-box">
              <div class="popover-title">{{ item.title }}</div>
              <el-popover :placement="popoverPlacement" :trigger="popoverTrigger" width="300">
                <div><p v-for="(descItem, descIndex) in item.desc" :key="descIndex">{{ descItem }}</p></div>
                <i slot="reference" class="popover-icon" />
              </el-popover>
            </div>
            <div v-loading="item.loading">
              <div class="data-common">
                <div class="data-common-item">
                  <div class="data-common-title">{{ item.todayDesc }}</div>
                  <div class="data-common-num">{{ item.todayCount }}</div>
                </div>
                <div class="data-common-item">
                  <div class="data-common-title">{{ item.yesterdayDesc }}</div>
                  <div class="data-common-num">{{ item.yesterdayCount }}</div>
                </div>
              </div>
              <div class="echarts-box">
                <refundDataEcharts :id="item.id" :list="item.list" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 退款数据分析 table -->
    <div class="floor refund-box">
      <div class="floor-body">
        <div v-loading="refundLoading" class="refund-table-box">
          <div class="refund-table-item">
            <div class="popover-box">
              <div class="popover-title">TOP5退款理由</div>
              <el-popover :placement="popoverPlacement" :trigger="popoverTrigger" width="300">
                <div><p v-for="(item, index) in refundReason.desc" :key="index">{{item}}</p></div>
                <i slot="reference" class="popover-icon" />
              </el-popover>
            </div>
            <el-table :data="refundReason.list" :header-cell-style="getRowClass" v-loading="refundReasonLoading">
              <el-table-column label="排行" type="index" min-width="50" align="center" />
              <el-table-column label="申请退款理由" prop="refund_target" min-width="180" align="center">
                <template slot-scope="{row}">
                  <el-popover
                    placement="top-start"
                    width="200"
                    trigger="hover"
                    :content="row.refund_target">
                    <div slot="reference" class="ellipsis">{{row.refund_target}}</div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="退款订单总数" prop="order_count" min-width="110" align="center" />
              <el-table-column label="占比" prop="rate" width="70" align="center" />
              <el-table-column label="退款总金额(元)" prop="refund_amount" width="120" align="center" />
            </el-table>
          </div>
          <div class="refund-table-item">
            <div class="popover-box">
              <div class="popover-title">TOP5退款商品</div>
              <el-popover :placement="popoverPlacement" :trigger="popoverTrigger" width="300">
                <div> <p v-for="(item, index) in refundOrder.desc" :key="index">{{item}}</p></div>
                <i slot="reference" class="popover-icon" />
              </el-popover>
            </div>
            <el-table :data="refundOrder.list" :header-cell-style="getRowClass" v-loading="refundOrderLoading">
              <el-table-column label="排行" type="index" min-width="50" align="center" />
              <el-table-column label="退款商品" prop="refund_target" min-width="180" align="center">
                <template slot-scope="{row}">
                  <el-popover placement="top-start" width="200" trigger="hover" :content="row.refund_target">
                    <div slot="reference" class="ellipsis">{{row.refund_target}}</div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="退款订单总数" prop="order_count" min-width="110" align="center" />
              <el-table-column label="占比" prop="rate" width="70" align="center" />
              <el-table-column label="退款总金额(元)" prop="refund_amount" width="120" align="center" />
            </el-table>
          </div>
        </div>
      </div>
    </div>

    <!-- 目标设定 -->
    <el-dialog title="目标设定" :visible.sync="targetVisible" width="360px">
      <el-form label-width="60px">
        <el-form-item label="月份">
            <el-date-picker v-model="saleData.date" type="month" placeholder="选择月" format="yyyy-MM" value-format="yyyyMM" @change="getSaleTarget" />
        </el-form-item>
        <el-form-item label="目标">
          <el-input v-model="saleData.amount" class="w220" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="targetVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateSaleTarget">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import shopPayEcharts from "./components/ShopPayEcharts";
import operationIndicatorEcharts from "./components/OperationIndicatorEcharts";
import saleDataEcharts from "./components/SaleDataEcharts";
import refundDataEcharts from "./components/RefundDataEcharts";
import quarterPicker from "./components/QuarterPicker";

export default {
  name: "ShopDataAnalysis",
  data() {
    return {
      eleSize: 'mini',
      popoverTrigger: 'hover',
      popoverPlacement: 'top',

      curTime: '', // 当前时间

      shopLoading: false,
      shopIndicatorList: [ // 店铺数据 - 指标
        {
          title: "店铺浏览量",
          desc: [
            "统计由当日0点截至当前时间的小程序店铺被浏览次数，一个客户在统计时间内浏览多次记为多次",
          ],
          todayCount: 0,
          yesterdayCount: 0,
          percent: 0,
        },
        {
          title: "实际访客数",
          desc: [
            "统计由当日0点截至当前时间的小程序店铺被浏览次数，有做去重处理，一个客户在统计时间内浏览多次记为一次。",
          ],
          todayCount: 0,
          yesterdayCount: 0,
          percent: 0,
        },
        {
          title: "付款总人数",
          desc: [
            "统计由当日0点截至当前时间，在小程序支付成功的客户数，一人一日内多次付款只算作一人。",
          ],
          todayCount: 0,
          yesterdayCount: 0,
          percent: 0,
        },
        {
          title: "付款订单数",
          desc: [
            "统计由当日0点截至当前时间，在小程序支付成功的客户数，一人一日内多次付款只算作一人。",
          ],
          todayCount: 0,
          yesterdayCount: 0,
          percent: 0,
        },
        {
          title: "支付情况",
          desc: [
            "统计一定时间内，所有支付订单金额之和，不包含余额储值部分。不剔除退款金额。",
            "拼团订单在成功成团后计入，未成团不计入计算。",
          ],
          todayCount: 99999,
          yesterdayCount: 888,
          percent: 10,
        },
      ],
      payList: [], // 店铺数据 - 支付情况

      operationLoading: false,
      operationTime: '', // 运营指标时间
      operationLen: 2, // 已选指标
      operationMax: 5, // 最多可选指标数
      operationList: [ // 运营指标列表
        {
          type: 1,
          title: "支付金额（元）",
          todayCount: 999,
          yesterdayCount: 888,
          lastWeekCont: 99,
          list: [],
          checked: true,
        },
        {
          type: 2,
          title: "支付人数",
          todayCount: 99999,
          yesterdayCount: 888,
          lastWeekCont: 99,
          list: [],
          checked: true,
        },
        {
          type: 3,
          title: "支付订单数",
          todayCount: 99999,
          yesterdayCount: 888,
          lastWeekCont: 99,
          list: [],
          checked: false,
        },
        {
          type: 4,
          title: "支付转化率",
          desc: ["支付数量/访客量*100，同一客户同一天支付多次和访问多次算一次。"],
          todayCount: 99999,
          yesterdayCount: 888,
          lastWeekCont: 99,
          list: [],
          checked: false,
          disabled: true
        },
        {
          type: 5,
          title: "客单价",
          todayCount: 99999,
          yesterdayCount: 888,
          lastWeekCont: 99,
          list: [],
          checked: false,
          disabled: true
        },
        {
          type: 6,
          title: "订单数量",
          todayCount: 99999,
          yesterdayCount: 888,
          lastWeekCont: 99,
          list: [],
          checked: false
        },
        {
          type: 7,
          title: "访问量",
          desc: ["如果是当天的，则统计由当日0点截至当前时间的小程序店铺被浏览次数，如果非当天，则统计0：00-23：59分59秒的访问量。做去重处理，一个客户在统计时间内浏览多次记为一次。"],
          todayCount: 99999,
          yesterdayCount: 888,
          lastWeekCont: 99,
          list: [],
          checked: false,
        },
      ],
      operationData: [ // 运营图表数据
        {
          date: "8:00",
          payMoney: 3821,
          payPeople: 34,
          payOrder: 19,
          payRate: 39,
          customerPrice: 336,
          orderNum: 38,
          visitNum: 482,
        }
      ],
      operationShow: [], // 展示
      viewW: 0, // 滑动可视区宽度
      offsetL: 0, // 偏移量
      mainW: 0, // 滑动内容区宽度
      allIndex: 0,
      curIndex: 0,

      periodList: [  // 周期列表
        { type: 1, name: '自然日' },
        { type: 2, name: '自然周' },
        { type: 3, name: '自然月' },
        { type: 4, name: '季度' },
      ],
      periodType: 1, // 周期类型
      periodDay: '', // 日
      periodMonth: '', // 月
      periodWeek: '', // 周
      periodQuarter: '', // 季度
      periodWeekData: {}, // 周 202031

      saleLoading: false,
      saleTimeType: 0, // 运营时间
      saleTime: '', // 运营时间
      curSale: 500, // 当前销售额
      tarSale: 1000, // 目标销售额
      tarSaleMonth: '', // 目标销售月份
      saleData: {
        date: '',
        amount: '',
      },
      salePercent: 0, // 销售百分比
      saleMonth: 5, // 月份
      saleTotalPay: 0, // 本日支付
      saleLastTotalPay: 0, // 昨日日支付
      saleTotalPayTitle: '本日', // 本日支付
      saleLastTotalPayTitle: '昨日', // 昨日日支付
      saleList: [], // 
      
      targetVisible: false,

      refundLoading: false,
      refundList: [
        {
          id: "completeRefund",
          title: "完成退款订单金额",
          desc: [
            "统计选择时间内，完成退款的订单金额，以系统完成退款的时间点为准。",
          ],
          todayDesc: "本日退款（元）",
          yesterdayDesc: "昨日退款（元）",
          todayCount: 99999,
          yesterdayCount: 888,
          list: [],
          loading: false,
        },
        {
          id: "refundRate",
          title: "订单退款率",
          desc: ["计算方式：统计选择时间内，完成退款订单数 / 支付订单数。"],
          todayDesc: "本日退款率",
          yesterdayDesc: "昨日退款率",
          todayCount: 99999,
          yesterdayCount: 888,
          list: [],
          loading: false,
        },
        {
          id: "applyRefund",
          title: "申请退款订单金额",
          desc: ["统计选择时间内，申请退款的订单金额。"],
          todayDesc: "本日（元）",
          yesterdayDesc: "昨日（元）",
          todayCount: 99999,
          yesterdayCount: 888,
          list: [],
          loading: false,
        },
      ],
      refundReason: {  // 退款理由
        desc: [
          '退款理由：被选择的时间内，成功退款订单对应的退款理由；',
          '退款金额：被选择的时间内，属于该理由并且成功退款的总金额；',
          '占比：被选择的时间内，属于该理由成功退款的总金额 /总退款金额。'
        ],
        list: [],
      },
      refundReasonLoading: false,
      refundOrder: {  // 退款商品
        desc: [
          '退款订单数：被选择时间内，包含该商品的订单并成功退款的订单数量；',
          '退款金额：被选择时间内，包含该商品的订单成功退款的总金额。'
        ],
        list: []
      },
      refundOrderLoading: false,

      quarter: {
        value: '',
      },
      
    };
  },
  created() {
    this.getCurTime();
    this.getShopData(); // 获取店铺数据
    this.getOperationData(); // 获取运营指标
    this.getSaleTargetAnalysis(); // 获取销售目标
    this.getRefundRateData(); // 获取订单退款率
    this.getCompleteRefundData(); // 获取完成退款订单金额
    this.getApplyRefundData(); // 获取申请退款订单金额
    this.getRefundCauseData(); // 获取退款理由
    this.getRefundOrderData(); // 获取退款商品
  },
  mounted() {
    this.getScrollData();
  },
  methods: {
    // 获取店铺实时数据 - api
    getShopData() {
      const params = {
        date: this.curTime
      };
      this.shopLoading = true;
      this.Api.getShopDayAnalysis(params).then(res => {
        if (res.data.ret === 0) {
          const { today_view_analysis, today_pay_user_analysis, today_pay_order_analysis, today_pay_analysis } = res.data.data;
          // 店铺浏览量
          this.shopIndicatorList[0].todayCount = today_view_analysis.today_view_total || 0;
          this.shopIndicatorList[0].yesterdayCount = today_view_analysis.yesterday_view_total || 0;
          this.shopIndicatorList[0].percent = today_view_analysis.dod_view_rate || 0;
          // 实际访客数
          this.shopIndicatorList[1].todayCount = today_view_analysis.today_view_user || 0;
          this.shopIndicatorList[1].yesterdayCount = today_view_analysis.yesterday_view_user || 0;
          this.shopIndicatorList[1].percent = today_view_analysis.dod_view_user_rate || 0;
          // 付款总人数
          this.shopIndicatorList[2].todayCount = today_pay_user_analysis.today_total_user || 0;
          this.shopIndicatorList[2].yesterdayCount = today_pay_user_analysis.yesterday_total_user || 0;
          this.shopIndicatorList[2].percent = today_pay_user_analysis.dod_user_rate || 0;
          // 付款订单数
          this.shopIndicatorList[3].todayCount = today_pay_order_analysis.today_total_order || 0;
          this.shopIndicatorList[3].yesterdayCount = today_pay_order_analysis.yesterday_total_order || 0;
          this.shopIndicatorList[3].percent = today_pay_order_analysis.dod_order_rate || 0;
          // 支付情况
          this.shopIndicatorList[4].todayCount = today_pay_analysis.today_pay || 0;
          this.shopIndicatorList[4].yesterdayCount = today_pay_analysis.yesterday_pay || 0;
          this.shopIndicatorList[4].percent = today_pay_analysis.dod_pay_rate || 0;
          this.payList = today_pay_analysis.hours_analysis_list || [];
        } else {
          this.$message.error(`获取店铺实时数据失败，${res.data.msg}`);
        }
      }).catch(err => {
        this.$message.error("网络错误");
      }).finally(() => {
        this.shopLoading = false;
      });
    },

    // 获取运营指标数据 - api
    getOperationData() {
      const params = {
        date: this.operationTime
      };
      this.operationLoading = true;
      this.Api.getShopDayAnalysis(params).then(res => {
        if (res.data.ret === 0) {
          const { today_pay_analysis, today_pay_user_analysis, today_pay_order_analysis, today_pay_trans_rate, today_user_pay_avg, today_order_analysis, today_view_analysis } = res.data.data;
          // 支付金额
          const {today_pay = 0, yesterday_pay = 0, last_week_pay = 0} = today_pay_analysis;
          this.operationList[0].todayCount = today_pay;
          this.operationList[0].yesterdayCount = this._handleMath(today_pay - yesterday_pay);
          this.operationList[0].lastWeekCount = this._handleMath(today_pay - last_week_pay);
          this.operationList[0].list = today_pay_analysis.hours_analysis_list;
          // 支付人数
          const {today_total_user = 0, yesterday_total_user = 0, last_week_total_user = 0} = today_pay_user_analysis;
          this.operationList[1].todayCount = today_total_user;
          this.operationList[1].yesterdayCount = this._handleMath(today_total_user - yesterday_total_user);
          this.operationList[1].lastWeekCount = this._handleMath(today_total_user - last_week_total_user);
          this.operationList[1].list = today_pay_user_analysis.hours_analysis_list;
          // 支付订单数
          const {today_total_order: today_total_order2 = 0, yesterday_total_order: yesterday_total_order2 = 0, last_week_total_order: last_week_total_order2 = 0} = today_pay_order_analysis;
          this.operationList[2].todayCount = today_total_order2;
          this.operationList[2].yesterdayCount = this._handleMath(today_total_order2 - yesterday_total_order2);
          this.operationList[2].lastWeekCount = this._handleMath(today_total_order2 - last_week_total_order2);
          this.operationList[2].list = today_pay_order_analysis.hours_analysis_list;
          // 支付转化率 支付人数/实际访客
          const {today_rate = 0, yesterday_rate = 0, last_week_rate = 0} = today_pay_trans_rate;
          this.operationList[3].todayCount = today_rate;
          this.operationList[3].yesterdayCount = this._handleMath(today_rate - yesterday_rate);
          this.operationList[3].lastWeekCount = this._handleMath(today_rate - last_week_rate);
          // 客单价 支付金额/支付人数
          const {today_pay: today_pay4 = 0, yesterday_pay: yesterday_pay4 = 0, last_week_pay: last_week_pay4 = 0} = today_user_pay_avg;
          this.operationList[4].todayCount = today_pay4;
          this.operationList[4].yesterdayCount = this._handleMath(today_pay4 - yesterday_pay4);
          this.operationList[4].lastWeekCount = this._handleMath(today_pay4 - last_week_pay4);
          // 订单数量
          const {today_total_order = 0, yesterday_total_order = 0, last_week_total_order = 0} = today_order_analysis;
          this.operationList[5].todayCount = today_total_order;
          this.operationList[5].yesterdayCount = this._handleMath(today_total_order - yesterday_total_order);
          this.operationList[5].lastWeekCount = this._handleMath(today_total_order - last_week_total_order);
          this.operationList[5].list = today_order_analysis.hours_analysis_list;
          // 访问量  店铺浏览量
          const {today_view_total = 0, yesterday_view_total = 0, last_week_view_total = 0} = today_view_analysis;
          this.operationList[6].todayCount = today_view_total;
          this.operationList[6].yesterdayCount = this._handleMath(today_view_total - yesterday_view_total);
          this.operationList[6].lastWeekCount = this._handleMath(today_view_total - last_week_view_total);
          this.operationList[6].list = today_view_analysis.hours_analysis_list;
          // 图标数据
          let operationData = [];
          today_pay_analysis.hours_analysis_list.forEach((item, index) => {
            operationData.push({
              date: item.date,
              payMoney: today_pay_analysis.hours_analysis_list[index].today_pay, // 支付金额
              payPeople: today_pay_user_analysis.hours_analysis_list[index].today_pay, // 支付人数
              payOrder: today_pay_order_analysis.hours_analysis_list[index].today_pay, // 支付订单数
              payRate: 0, // 支付转换率
              customerPrice: 0, // 客单价
              orderNum: today_order_analysis.hours_analysis_list[index].today_pay, // 订单数
              visitNum: today_view_analysis.hours_analysis_list[index].today_pay, // 访问量
            })
          })
          this.operationData = operationData;
          this.handleOperationData();
        } else {
          this.$message.error(`获取运营指标数据失败`);
        }
      }).catch(err => {
        this.$message.error("网络错误");
      }).finally(() => {
        this.operationLoading = false;
      });
    },
    // 切换运营指标数据
    changeOperationData(val) {
      this.operationTime = val;
      this.getOperationData();
    },
    // 处理运营指标列表
    handleOperationData() {
      let operationShow = [];
      this.operationList.forEach((item, index) => {
        operationShow[index] = item.checked;
      });

      this.operationShow = operationShow;
    },
    // 切换运营指标
    changeOperationInd(e, type) {
      let len = 0;
      this.operationList.forEach((item) => { // 获取选中个数
        if (item.checked) {
          len = len + 1;
        }
      });
      this.operationList.forEach((item, index) => {
        if (len == 0 && item.type == type) { // 选中数量为0，处理必选一个
          item.checked = true;
        } else if (len >= this.operationMax && !item.checked) { // 选中数量达到极限，没选中的禁选
          item.disabled = true;
        } else { // 全都不禁选
          item.disabled = false;
        }
        if (index == 3 || index == 4) {
          item.disabled = true;
        }
      });
      if (len != 0) {
        this.operationLen = len;
        this.handleOperationData();
      }
    },

    // 获取销售目标列表 - api
    getSaleTargetAnalysis() {
      const {periodType, periodDay, periodMonth, periodQuarter, periodWeekData} = this;
      let date = '';
      if (periodType == 1) {
        date = periodDay;
      } else if (periodType == 2) {
        date = `${periodWeekData.year}${periodWeekData.month}${periodWeekData.day}`
      } else if (periodType == 3) {
        date = periodMonth;
      } else if (periodType == 4) {
        const arr = periodQuarter.split('-');
        date = `${arr[0]}${arr[1]}`;
      }
      const params = {
        date,
        type: periodType
      };
      this.saleLoading = true;
      this.Api.getShopSaleTargetAnalysis(params).then(res => {
        if (res.data.ret === 0) {
        const { last_total_pay, total_pay, total_target, hours_analysis_list } = res.data.data;

        this.curSale = total_pay; // 当前销售额
        this.tarSale = total_target; // 目标销售额
        this.saleTotalPay = total_pay; // 本日支付
        this.saleLastTotalPay = last_total_pay; // 昨日日支付
        this.saleList = hours_analysis_list;

        let salePercent = 0;
        if (this.curSale == 0) {
          salePercent = 0;
        } else if (this.tarSale == 0) {
          salePercent = 100;
        } else {
          salePercent = (this.curSale / this.tarSale) * 100;
          salePercent = Math.round(salePercent * 100) / 100;
          // salePercent = salePercent > 100 ? 100 : salePercent;
        }
        this.salePercent = salePercent;
        } else {
          this.$message.error(`获取销售目标失败，${res.data.msg}`);
        }
      }).catch(err => {
        this.$message.error("网络错误");
      }).finally(() => {
        this.saleLoading = false;
      });
    },
    // 获取设定目标数据 - api
    getSaleTarget() {
      const params = {
        month: this.saleData.date,
        type: 1
      };
      this.Api.getShopSaleTarget(params).then(res => {
        if (res.data.ret === 0) {
          this.saleData.amount = res.data.data.target_amount || 0;
        } else {
          this.$message.error(`获取设定目标失败，${res.data.msg}`);
        }
      }).catch(err => {
        this.$message.error("网络错误");
      }).finally(() => {
      });
    },
    // 设定目标 - api
    updateSaleTarget() {
      const { amount, date } = this.saleData;

      const reg = /^[0-9]+[.]?[0-9]*$/;
      if (!date) {
        this.$message.error('请输入目标');
        return;
      } else if (!reg.test(date)) {
        this.$message.error('目标有误');
        return;
      }
      const params = {
        shop_code: localStorage.getItem('shop_code'),
        month: date,
        target_amount: Number(amount)
      };
      this.Api.editShopSaleTarget(params).then(res => {
        if (res.data.ret === 0) {
          const {periodType, periodDay, periodWeek, periodMonth, periodQuarter} = this;
          if (
            (periodType == 1 && periodDay) ||
            (periodType == 2 && periodWeek) || 
            (periodType == 3 && periodMonth) || 
            (periodType == 4 && periodQuarter)) 
          {
            this.getSaleTargetAnalysis();
          }
          this.$message.success('保存成功');
          this.targetVisible = false;
        } else {
          this.$message.error(`设定目标失败，${res.data.msg}`);
        }
      }).catch(err => {
        this.$message.error("网络错误");
      })
    },
    // 设定销售目标 - 打开
    openTargetSet() {
      this.targetVisible = true;
      this.saleData.date = this.tarSaleMonth;
      this.getSaleTarget();
    },
    // 切换周期类型
    changePeriodType() {
      this.periodDay = '';
      this.periodMonth = '';
      this.periodWeek = '';
      this.periodQuarter = '';
    },
    // 切换周期 type 1日 2周 3月 4季度
    changePeriod(value, type) {
      let saleTotalPayTitle = '';
      let saleLastTotalPayTitle = '';
      if (type == 1) {
        saleTotalPayTitle = '本日';
        saleLastTotalPayTitle = '昨日';
      } else if (type == 2) {
        saleTotalPayTitle = '本周';
        saleLastTotalPayTitle = '上周';
        this._handleWeek();
      } else if (type == 3) {
        saleTotalPayTitle = '本月';
        saleLastTotalPayTitle = '上月';
      }else if (type == 4) {
         saleTotalPayTitle = '本季';
        saleLastTotalPayTitle = '上季';
        this.periodQuarter = value;
      }
      if (value) {
        this.getSaleTargetAnalysis();
        this._handleMonth();
        this.saleTotalPayTitle = saleTotalPayTitle;
        this.saleLastTotalPayTitle = saleLastTotalPayTitle;
      }
    },
    // 修改自然周展示格式
    pickerFormat() {
      const {year, week} = this.periodWeekData;
      return `${year} 年第 ${week} 周`;
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
    // 获取月
    _handleMonth() {
      const {periodType, periodDay, periodMonth, periodQuarter, periodWeekData} = this;
      let saleMonth = 0;
      // let tarSaleMonth = 0;
      if (periodType == 1) {
        // tarSaleMonth = periodDay.slice(0, 6);
        saleMonth = Number(periodDay.slice(4, 6)) + '月';
      } else if (periodType == 2) {
        // tarSaleMonth = `${periodWeekData.year}${periodWeekData.month}`;
        saleMonth = Number(periodWeekData.month) + '月';
      } else if (periodType == 3) {
        // tarSaleMonth = periodMonth;
        saleMonth = Number(periodMonth.slice(4, 6)) + '月';
      } else if (periodType == 4) {
        // const arr = periodQuarter.split('-');
        // saleMonth = `${arr[0]}年第${arr[1]}季度`;
        saleMonth = `本季度`;
      }
      // this.tarSaleMonth = tarSaleMonth;
      this.saleMonth = saleMonth;
    },

    // 获取订单退款率 - api
    getRefundRateData() {
      const params = {
        times: this.curTime
      };
      this.refundList[1].loading = true;
      this.Api.getShopRefundRate(params).then(res => {
        if (res.data.ret === 0) {
          const {today_refund_rate, yesterday_refund_rate, refund_rate_list} = res.data.data;
          this.refundList[1].todayCount = today_refund_rate + '%';
          this.refundList[1].yesterdayCount = yesterday_refund_rate + '%';
          this.refundList[1].list = refund_rate_list;
        } else {
          this.$message.error(`获取订单退款率失败，${res.data.msg}`);
        }
      }).catch(err => {
        this.$message.error("网络错误");
      }).finally(() => {
        this.refundList[1].loading = false;
      });
    },
    // 获取完成退款订单金额 - api
    getCompleteRefundData() {
      const params = { 
        times: this.curTime,
        type: 1
      };
      this.refundList[0].loading = true;
      this.Api.getShopRefundAmount(params).then(res => {
        if (res.data.ret === 0) {
          const {today_refund_amount, yesterday_refund_amount, refund_rate_list} = res.data.data;
          this.refundList[0].todayCount = today_refund_amount;
          this.refundList[0].yesterdayCount = yesterday_refund_amount;
          this.refundList[0].list = refund_rate_list;
        } else {
          this.$message.error(`获取订单退款金额失败，${res.data.msg}`);
        }
      }).catch(err => {
        this.$message.error("网络错误");
      }).finally(() => {
        this.refundList[0].loading = false;
      });
    },
    // 获取申请退款订单金额 - api
    getApplyRefundData() {
      const params = { 
        times: this.curTime,
        type: 2
      };
      this.refundList[2].loading = true;
      this.Api.getShopRefundAmount(params).then(res => {
        if (res.data.ret === 0) {
          const {today_refund_amount, yesterday_refund_amount, refund_rate_list} = res.data.data;
          this.refundList[2].todayCount = today_refund_amount;
          this.refundList[2].yesterdayCount = yesterday_refund_amount;
          this.refundList[2].list = refund_rate_list;
        } else {
          this.$message.error(`获取申请退款订单金额失败，${res.data.msg}`);
        }
      }).catch(err => {
        this.$message.error("网络错误");
      }).finally(() => {
        this.refundList[2].loading = false;
      });
    },

    // 获取退款理由 - api
    getRefundCauseData() {
      const params = { 
        times: this.curTime,
        type: 1
      };
      this.refundReasonLoading = true;
      this.Api.getShopRefundTop(params).then(res => {
        if (res.data.ret === 0) {
          this.refundReason.list = res.data.data || [];
        } else {
          this.$message.error(`获取退款理由失败，${res.data.msg}`);
        }
      }).catch(err => {
        this.$message.error("网络错误");
      }).finally(() => {
        this.refundReasonLoading = false;
      });
    },  
    // 获取退款商品 - api
    getRefundOrderData() {
      const params = { 
        times: this.curTime,
        type: 2
      };
      this.refundOrderLoading = true;
      this.Api.getShopRefundTop(params).then(res => {
        if (res.data.ret === 0) {
          this.refundOrder.list = res.data.data || [];
        } else {
          this.$message.error(`获取退款商品失败，${res.data.msg}`);
        }
      }).catch(err => {
        this.$message.error("网络错误");
      }).finally(() => {
        this.refundOrderLoading = false;
      });
    },    

    // 获取当前时间
    getCurTime() {
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
      this.periodDay = `${year}${month}${day}`; // 销售时间
      this.tarSaleMonth = `${year}${month}`; // 目标月份

      this._handleMonth();
    },
    // 获取滑动区数据
    getScrollData() {
      const viewW = this.$refs.scrollView.offsetWidth; // 可视区宽度
      let mainW = 0; // 内容区宽度
      this.$refs.scrollItem.forEach((item, index) => {
        mainW = mainW + Number(item.offsetWidth);
        let marginR = getComputedStyle(item, null).marginRight.replace('px', '');
        if (index) {
          mainW = mainW + Number(marginR);
        }
      });
      this.viewW = viewW;
      this.mainW = mainW;
      this.allIndex = Math.ceil(mainW / viewW) - 1;
    },
    // 上下滑动
    changeScroll(type) {
      const viewW = this.viewW;
      const mainW = this.mainW;
      const curIndex = this.curIndex;
      const allIndex = this.allIndex;
      let offsetL = 0;
      if (type == 1) {
        // 上一页
        if (curIndex == 0) return;
        const tagIndex = curIndex - 1;
        this.curIndex = tagIndex;
        offsetL = tagIndex * viewW;
      } else {
        // 下一页
        if (curIndex == allIndex) return;
        const tagIndex = curIndex + 1;
        this.curIndex = tagIndex;
        if (tagIndex != allIndex) {
          offsetL = tagIndex * viewW;
        } else {
          // 目标页为最后一页时，滑动到最后
          offsetL = mainW - viewW;
        }
      }
      this.offsetL = -offsetL;
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
  components: {
    shopPayEcharts,
    operationIndicatorEcharts,
    saleDataEcharts,
    refundDataEcharts,
    quarterPicker,
  },
};
</script>

<style lang="scss" scoped>
@import "./style/dataAnalysis";

/* 店铺数据 */
.shop-indicator-list {
  width: 40%;
  display: flex;
  flex-wrap: wrap;
}
.shop-indicator-item {
  position: relative;
  width: 50%;
  height: 150px;
  margin: 0 10px 10px 0;
  border-radius: $bdr1;
  background: $bg-gray;
  &:nth-child(2n) {
    flex: 1;
    margin-right: 0;
  }
  .top {
    padding: 15px 20px 0;
  }
  .num {
    margin-top: 10px;
    color: #000;
    font-size: 28px;
  }
  .amount-increase {
    display: flex;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 14px 20px;
    border-top: 1px solid #ebebeb;
    &-item {
      margin-right: 16px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
.shop-pay {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 310px;
  margin-left: 50px;
  .head {
    flex: 1;
  }
  .popover-title {
    font-size: 14px;
  }
  .amount-increase {
    display: flex;
    align-items: flex-end;
    margin-top: 12px;
    &-item {
      margin-right: 18px;
      &:last-child {
        margin-right: 0;
      }
    }
    .today {
      color: #505050;
      font-size: 14px;
    }
  }
  .echarts-box {
    height: 250px;
  }
}

/* 运营指标 */
.operation-box {
  .echarts-box {
    height: 500px;
    margin-top: 40px;
  }
}
.operation-indicator {
  margin-top: 20px;
}
.operation-indicator-head {
  margin-bottom: 20px;
  color: $gray;
}
.operation-indicator-item {
  width: 178px;
  height: 126px;
  margin-right: 10px;
  padding: 15px 15px 10px;
  border: 1px solid #f7f7f7;
  border-radius: 5px;
  background: $bg-gray;
  &.active {
    background: #d9e9ff;
    border-color: $blue;
  }
  > .box {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .top {
    flex: 1;
  }
  .popover-title {
    font-size: 12px;
  }
  .num {
    margin-top: 8px;
    font-size: 14px;
  }
  .amount-increase {
    &-item {
      margin-bottom: 5px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .el-checkbox {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
}
.scroll {
  &-box {
    position: relative;
  }
  &-main {
    position: relative;
    overflow: hidden;
    margin: 0 40px;
  }
  &-list {
    position: relative;
    height: 126px;
    white-space: nowrap;
    font-size: 0;
    transition: all 0.6s;
  }
  &-item {
    position: relative;
    display: inline-block;
    vertical-align: top;
  }
  &-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    line-height: 18px;
    border-radius: 50%;
    border: 1px solid #4f4f4f;
    color: #4f4f4f;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
    &.not {
      cursor: no-drop;
      background: #f7f7f7;
    }
    &.left {
      left: 0;
    }
    &.right {
      right: 0;
    }
  }
}

/* 销售目标 */
.sale-target-box {
  .data-common {
    flex: 1;
  }
  .echarts-box {
    height: 360px;
    margin-top: 40px;
  }
}
.target-box {
  display: flex;
  margin-top: 20px;
}
.target-progress-box {
  width: 65%;
  height: 110px;
  margin-right: 30px;
  padding: 10px 20px 0;
  border-radius: $bdr1;
  background: $bg-gray;
  .bottom {
    margin-top: 10px;
  }
  .el-progress__text {
    font-size: 18px !important;
  }
}

/* 退款数据分析 */
.refund-echrt-box {
  display: flex;
  .echarts-box {
    height: 300px;
    margin-top: 20px;
  }
}
.refund-echrt-item {
  width: 34%;
  margin-right: 30px;
  &:last-child {
    margin-right: 0;
  }
  .data-common {
    margin-top: 20px;
  }
}
.refund-table-box {
  display: flex;
}
.refund-table-item {
  width: 50%;
  flex: 1;
  margin-right: 36px;
  .popover-box {
    margin-bottom: 20px;
    color: $blue;
    font-size: 16px;
    .popover-icon::after {
      border-color: $blue;
      color: $blue;
      transform: scale(1);
    }
  }
  &:last-child {
    margin-right: 0;
  }
}

/* 进度条 */
.el-progress {
  display: flex;
  align-items: center;
  color: #f00;
  font-size: 18px !important;
  .el-progress-bar__outer {
    height: 10px !important;
  }
  .el-progress__text {
    // position: absolute !important;
    // top: 2px !important;
    // font-size: 18px !important;
  }
}

/* 数据共用 */
.data-common {
  display: flex;
  height: 110px;
  padding: 0 30px;
  border-radius: $bdr1;
  background: $bg-gray;
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

.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
