<template>
  <div class="wrap">
    <div class="chart" id="saleDataEcharts" />
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
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let chart = this.$echarts.init(document.getElementById('saleDataEcharts'));
      
      // 绘制图表
      let option = {
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["本期", "上期"]
        },
        grid: {
          left: "50",
          right: "20",
          bottom: "25",
          top: "50",
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
        yAxis: {
          type: "value",
          axisTick: {
            show: false
          },
          axisLine: {
            show: false // 隐藏左边坐标轴线条
          },
          splitLine: { // 网格线
            show: true,
            lineStyle: {
              color: ["#BFBFBF"],
              type: "dotted"
            }
          },
        },
        series: [
          {
            name: "本期",
            type: "line",
            smooth: true,
            data: this.todayPay,
            itemStyle: {
              normal: {
                color: "#4090ff" // 线条颜色
              }
            }
          },
          {
            name: "上期",
            type: "line",
            smooth: true,
            data: this.yesterdayPay,
            itemStyle: {
              normal: {
                color: "#15d265" // 线条颜色
              }
            }
          }
        ]
      }

      // if (this.type == 1) {
      //   option.legend.data = ["今日", "昨日"];
      //   option.series[0].name = '今日';
      //   option.series[1].name = '昨日';
      // } else if (this.type == 2) {
      //   option.legend.data = ["本周", "上周"];
      //   option.series[0].name = '本周';
      //   option.series[1].name = '上周';
      // } else if (this.type == 3) {
      //   option.legend.data = ["本月", "上月"];
      //   option.series[0].name = '本月';
      //   option.series[1].name = '上月';
      // } else if (this.type == 4) {
      //   option.legend.data = ["本季", "上季"];
      //   option.series[0].name = '本季';
      //   option.series[1].name = '上季';
      // }

      // 绘制图表 true避免与更新前的数据合并
      chart.setOption(option, true);
    }
  },
  watch: {
    list: {
      handler() {
        this.drawLine();
      },
      deep: true // 对象内部属性的监听，关键。
    }
  },
  computed: {
    time() {
      return this.list.map(item => {
        return item.date;
      });
    },
    todayPay() {
      return this.list.map(item => {
        return item.today_pay;
      });
    },
    yesterdayPay() {
      return this.list.map(item => {
        return item.yesterday_pay;
      });
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: Number,
      default: 1
    }
  }
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
