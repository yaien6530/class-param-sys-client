<template>
  <div class="FlowTrendEcharts-container">
    <div class="chart" id="flowTrendEcharts" />
    <!-- <div v-show="date_list.length == 0" class="nodata">暂无数据</div> -->
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
      let chart = this.$echarts.init(
        document.getElementById("flowTrendEcharts")
      );
      var colors = ["#5793f3", "#d14a61", "#675bba", "#91C7AE", "#D48265"];
      // 指定图表的配置项和数据
      var option = {
        color: colors,
        tooltip: {
          //设置tip提示
          trigger: "axis"
        },

        legend: {
          //设置区分（哪条线属于什么）
          data: ["现有访客量", "访问支付转化率"],
          icon: "roundRect", //改变样式,将线加圈改成线条
          itemWidth: 40, // 设置宽度
          itemHeight: 2 // 设置高度
        },
        xAxis: {
          //设置x轴
          type: "category",
          boundaryGap: false, //坐标轴两边不留白
          data: [
            "2019-1-1",
            "2019-2-1",
            "2019-3-1",
            "2019-4-1",
            "2019-5-1",
            "2019-6-1",
            "2019-7-1",
            "2019-1-1",
            "2019-2-1",
            "2019-3-1",
            "2019-4-1",
            "2019-5-1",
            "2019-6-1",
            "2019-7-1"
          ],
          nameTextStyle: {
            //坐标轴名称的文字样式
            color: "#838383",
            fontSize: 16,
            padding: [0, 0, 0, 20]
          },
          axisLine: {
            //坐标轴轴线相关设置。
            lineStyle: {
              color: "#838383"
            }
          },
          boundaryGap: true // 距离坐标原点是否有间隙
        },
        yAxis: {
          nameTextStyle: {
            color: "#838383",
            fontSize: 16,
            padding: [0, 0, 10, 0]
          },
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              color: ["#e5e5e5"]
            }
          },
          // y轴的颜色和宽度
          axisLine: {
            show: false, //是否显示y轴
            lineStyle: {
              color: "#000", // y坐标轴的轴线颜色
              width: 1 //这里是坐标轴的宽度,可以去掉
            }
          },
          axisTick: {
            show: false //是否显示刻度
          }
        },
        series: [
          {
            name: "现有访客量",
            data: [
              220,
              232,
              201,
              234,
              290,
              230,
              220,
              220,
              232,
              201,
              234,
              290,
              230,
              220
            ],
            type: "line", // 类型为折线图
            lineStyle: {
              // 线条样式 => 必须使用normal属性
              normal: {
                color: colors[0]
              }
            },
            smooth: true,
            showSymbol: true,
            showAllSymbol: true,
            symbol: "circle", //设定为实心点
            symbolSize: 7, //设定实心点的大小
            hoverAnimation: true,
            animation: true
          },
          {
            name: "访问支付转化率",
            data: [
              120,
              200,
              150,
              80,
              70,
              110,
              130,
              120,
              200,
              150,
              80,
              70,
              110,
              130
            ],
            type: "line",
            lineStyle: {
              normal: {
                color: colors[1]
              }
            },
            smooth: true,
            showSymbol: true,
            showAllSymbol: true,
            symbol: "circle", //设定为实心点
            symbolSize: 7, //设定实心点的大小
            hoverAnimation: true,
            animation: true
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      chart.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
.FlowTrendEcharts-container {
  background: #fff;
  margin-top: 20px;
}
#flowTrendEcharts {
  width: 100%;
  height: 400px;
}
</style>
