<!--
 * @Description:
 * @Version: 2.0
 * @Author: Xing
 * @Date: 2020-07-28 10:29:44
 * @LastEditors: Xing
 * @LastEditTime: 2020-07-28 10:54:34
-->
// 流量来源分析饼状图
<template>
  <div>
    <el-dialog :visible="pie_dialog" width="30%" :before-close="handleClose">
      <div class="chart" id="flowSourceEcharts" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    pie_dialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  mounted() {},
  watch: {
    pie_dialog(val) {
      if (val) {
        this.drawLine();
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit("update:pie_dialog", false);
    },
    drawLine() {
      var pieId = document.getElementById("flowSourceEcharts");
      if (!pieId) {
        return setTimeout(() => {
          this.drawLine();
        }, 2000);
      }
      let chart = this.$echarts.init(pieId);
      var option = {
        title: {
          text: "流量来源分析",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
        },
        series: [
          {
            name: "流量来源分析",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1548, name: "搜索引擎" }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
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
#flowSourceEcharts {
  width: 400px;
  height: 400px;
}
</style>
