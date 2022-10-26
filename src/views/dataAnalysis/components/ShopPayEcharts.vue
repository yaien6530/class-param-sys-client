<template>
  <div class="wrap">
    <div class="chart" id="chartPayData" />
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
      let chart = this.$echarts.init(document.getElementById("chartPayData"));
      // 绘制图表
      chart.setOption({
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["今日", "昨日"]
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
          axisLine: { // 隐藏左边坐标轴线条
            show: false 
          },
          axisTick: {
            show: false
          },
          splitLine: { // 网格线
            show: true,
            lineStyle: {
              color: ["#BFBFBF"],
              type: "dotted"
            }
          },
        },
        dataZoom: [
          {
            type: "slider",
            top: "93%",
            bottom: '0',
            left: '90',
            right: '50',
            start: 0,
            end: 100
          },
        ],
        series: [
          {
            name: '今日',
            type: "line",
            smooth: true,
            data: this.today_pay,
            itemStyle: {
              normal: {
                color: "#4090ff" // 线条颜色
              }
            }
          },
          {
            name: '昨日',
            type: "line",
            smooth: true,
            data: this.yesterday_pay,
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
        return item.date;
      });
      return time;
    },
    today_pay() {
      return this.list.map(item => {
        return item.today_pay;
      });
    },
    yesterday_pay() {
      return this.list.map(item => {
        return item.yesterday_pay;
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
