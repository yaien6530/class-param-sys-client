<template>
  <div class="wrap">
    <div class="chart" :id="id" />
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
      let chart = this.$echarts.init(document.getElementById(this.id));
      // 绘制图表
      chart.setOption({
        tooltip: {
          trigger: "axis"
        },
        // legend: {
        //   data: ["今日", "昨日"]
        // },
        grid: {
          left: "50",
          right: "20",
          bottom: "25",
          top: "40",
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
            name: "今日",
            type: "line",
            smooth: true,
            data: this.count,
            itemStyle: {
              normal: {
                color: "#4090ff" // 线条颜色
              }
            }
          },
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
      return this.list.map(item => {
        return item.date;
      });
    },
    count() {
      return this.list.map(item => {
        return item.refund_rate;
      });
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      default: 'echart'
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
