<template>
  <div class="wrap">
    <div class="chart" id="chartOperation" />
    <div v-show="list.length == 0" class="nodata">暂无数据</div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    this.drawLine();
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    show: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let chart = this.$echarts.init(document.getElementById("chartOperation"));
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        grid: {
          left: "50",
          right: "50",
          bottom: "25",
          top: "50",
        },
        legend: {
          data: ["支付金额", "支付人数", "支付订单数", '支付转化率', '客单价' , '订单数量', '访问量']
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: this.time,
          axisLine:{
            lineStyle:{
              color:'#4090ff',
            }
          },
          axisLabel: {
            textStyle: {
              color: "#4F4F4F"
            }
          },
          axisTick: {
            alignWithLabel: true
          },
        },
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ["#BFBFBF"],
                width: 1,
                type: "dotted"
              }
            },
            axisLine: {
              show: false
            },
          },
          {
            type: "value",
            min: 0,
            max: 100,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              formatter: "{value} %"
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ["#BFBFBF"],
                width: 1,
                type: "dotted"
              }
            },
          }
        ],
        series: [
          {
            name: "支付金额",
            data: this.payMoney
          },
          {
            name: "支付人数",
            data: this.payPeople,
          },
          {
            name: "支付订单数",
            data: this.payOrder,
          },
          {
            name: "支付转化率",
            yAxisIndex: 1,
            data: this.payRate,
          },
          {
            name: "客单价",
            data: this.customerPrice,
          },
          {
            name: "订单数量",
            data: this.orderNum,
          },
          {
            name: "访问量",
            data: this.visitNum,
          },
        ]
      }

      // 处理数据
      const colors = ['#4090FF', '#55C474', '#e52e2e', '#ff9448', '#2d4553'];
      const legendList = option.legend.data;
      const seriesList = option.series;
      let targetLegend = [];
      let tagetSeries = [];
      let num = 0;
      this.show.forEach((item, index) => {
        if (item) {
           // 处理legend
          targetLegend.push(legendList[index]);

           // 处理series
          let curSerie = seriesList[index];
          curSerie = {
            ...curSerie,
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                color: colors[num] // 线条颜色
              }
            }
          }
          tagetSeries.push(curSerie);
          num ++;
        }
      })
      option.legend.data = targetLegend;
      option.series = tagetSeries;

      // 绘制图表 true避免与更新前的数据合并
      chart.setOption(option, true);
    }
  },
  computed: {
    time() {
      return this.list.map(item => {
        return item.date;
      });
    },
    payMoney() { // 支付金额
      return this.list.map(item => {
        return item.payMoney;
      });
    },
    payPeople() { // 支付人数
      return this.list.map(item => {
        return item.payPeople;
      });
    },
    payOrder() { // 支付订单数
      return this.list.map(item => {
        return item.payOrder;
      });
    },
    payRate() { // 支付转化率
      return this.list.map(item => {
        return item.payRate;
      });
    },
    customerPrice() { // 客单价
      return this.list.map(item => {
        return item.customerPrice;
      });
    },
    orderNum() { // 订单数
      return this.list.map(item => {
        return item.orderNum;
      });
    },
    visitNum() { // 访问量
      return this.list.map(item => {
        return item.visitNum;
      });
    },
  },
  watch: {
    list: {
      handler() {
        this.drawLine();
      },
      deep: true // 对象内部属性的监听，关键。
    },
    show: {
      handler() {
        this.drawLine();
      },
      deep: true
    },
  },
};
</script>

<style scoped>
.wrap {
  position: relative;
  width: 100%;
  height: 100%;
}
.nodata {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #999;
}
.chart {
  width: 100%;
  height: 100%;
}
</style>
