<template>
  <div class="wrap">
    <div class="chart" id="flowTrendEcharts" />
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
      let chart = this.$echarts.init(document.getElementById("flowTrendEcharts"));
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
          data: ["现有访客数量", "新访客数量", "总浏览量", '人均浏览量', '跳失率' , '平均停留时长(秒)', '访问-支持转化率', '访问-加购转化率', '商品访问转化率', '支付人数']
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
            // max: 100,
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
            name: "现有访客数量",
            data: this.nowViewUser
          },
          {
            name: "新访客数量",
            data: this.newViewUser
          },
          {
            name: "总浏览量",
            data: this.totalViewNum,
          },
          {
            name: "人均浏览量",
            data: this.aveViewNum,
          },
          {
            name: "跳失率",
            data: this.jumpLoseRate,
            yAxisIndex: 1,
          },
          {
            name: "平均停留时长(秒)",
            data: this.aveRemainDuration,
          },
          {
            name: "访问-支持转化率",
            data: this.viewPayRate,
            yAxisIndex: 1,
          },
          {
            name: "访问-加购转化率",
            data: this.viewBuyRate,
            yAxisIndex: 1,
          },
          {
            name: "商品访问转化率",
            data: this.productViewRate,
            yAxisIndex: 1,
          },
          {
            name: "支付人数",
            data: this.payUser,
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
  computed: {
    time() {
      return this.list.map(item => {
        return item.date;
      });
    },
    nowViewUser() {
      return this.list.map(item => {
        return item.nowViewUser;
      });
    },
    newViewUser() {
      return this.list.map(item => {
        return item.newViewUser;
      });
    },
    totalViewNum() {
      return this.list.map(item => {
        return item.totalViewNum;
      });
    },
    aveViewNum() {
      return this.list.map(item => {
        return item.aveViewNum;
      });
    },
    jumpLoseRate() {
      return this.list.map(item => {
        return item.jumpLoseRate;
      });
    },
    aveRemainDuration() {
      return this.list.map(item => {
        return item.aveRemainDuration;
      });
    },
    viewPayRate() {
      return this.list.map(item => {
        return item.viewPayRate;
      });
    },
    viewBuyRate() {
      return this.list.map(item => {
        return item.viewBuyRate;
      });
    },
    productViewRate() {
      return this.list.map(item => {
        return item.productViewRate;
      });
    },
    payUser() {
      return this.list.map(item => {
        return item.payUser;
      });
    }
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

<style lang="scss" scoped>
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

.FlowTrendEcharts-container {
  background: #fff;
  margin-top: 20px;
}
#flowTrendEcharts {
  width: 100%;
  height: 400px;
}
</style>
