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
          data: ["当前询单数", "当前询单商品数", '当前询单总金额', '订单数', '订单总商品数', '订单总金额']
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
          data: this.name,
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
            name: '当前询单数',
            type: "line",
            smooth: true,
            data: this.inquiry_order_count,
            // itemStyle: {
            //   normal: { color: "#4090ff" } // 线条颜色
            // }
          },
          {
            name: '当前询单商品数',
            type: "line",
            smooth: true,
            data: this.inquiry_total_count
          },
          {
            name: '当前询单总金额',
            type: "line",
            smooth: true,
            data: this.inquiry_total_price
          },
          {
            name: '订单数',
            type: "line",
            smooth: true,
            data: this.order_count
          },
          {
            name: '订单总商品数',
            type: "line",
            smooth: true,
            data: this.order_total_count
          },
          {
            name: '订单总金额',
            type: "line",
            smooth: true,
            data: this.order_total_price
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
    name() { // 产品名
      return this.list.map(item => {
        return item.name;
      });
    },
    inquiry_order_count() {
      return this.list.map(item => {
        return item.inquiry_order_count;
      });
    },
    inquiry_total_count() {
      return this.list.map(item => {
        return item.inquiry_total_count;
      });
    },
    inquiry_total_price() {
      return this.list.map(item => {
        return item.inquiry_total_price;
      });
    },
    order_count() {
      return this.list.map(item => {
        return item.order_count;
      });
    },
    order_total_count() {
      return this.list.map(item => {
        return item.order_total_count;
      });
    },
    order_total_price() {
      return this.list.map(item => {
        return item.order_total_price;
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
