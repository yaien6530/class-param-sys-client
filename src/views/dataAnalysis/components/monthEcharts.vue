<template>
  <div class="wrap">
    <div class="chart" id="chartMonthData" />
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
      let chart = this.$echarts.init(document.getElementById("chartMonthData"));
      // 绘制图表
      chart.setOption({
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["订单数", "询单数"]
        },
        grid: {
          left: "60",
          right: "20",
          top: "35",
          bottom: "50", 
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
            name: '订单数',
            type: "line",
            smooth: true,
            data: this.order_count,
            itemStyle: {
              normal: {
                color: "#4090ff" // 线条颜色
              }
            }
          },
          {
            name: '询单数',
            type: "line",
            smooth: true,
            data: this.inquiry_order_count,
            itemStyle: {
              normal: {
                color: "#15d265" // 线条颜色
              }
            }
          }
        ]
      });
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
      const time = this.list.map(item => {
        return item.month_day;
      });
      return time;
    },
    order_count() {
      return this.list.map(item => {
        return item.order_count;
      });
    },
    inquiry_order_count() {
      return this.list.map(item => {
        return item.inquiry_order_count;
      });
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
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
