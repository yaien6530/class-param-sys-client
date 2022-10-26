<template>
  <div class="select-quarter-container">
    <el-popover placement="bottom-start" trigger="click" v-model="visible" class="popover-box" width="320">
      <div class="quarter-box">
        <div slot="header" class="head">
          <button
            type="button"
            aria-label="前一年"
            class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left"
            @click="changeYear(1)"
          />
          <div class="date"><span class="num">{{year}}</span>年</div>
          <button
            type="button"
            aria-label="后一年"
            @click="changeYear(2)"
            class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"
          />
        </div>
        <div class="body">
          <div @click="selectSeason(0)" class="item">第一季度</div>
          <div @click="selectSeason(1)" class="item">第二季度</div>
          <div @click="selectSeason(2)" class="item">第三季度</div>
          <div @click="selectSeason(3)" class="item">第四季度</div>
        </div>
      </div>
      <el-input slot="reference" v-model="showValue" placeholder="请选择季度" size="mini" clearable>
        <i slot="prefix" class="el-input__icon el-icon-date" />
      </el-input>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    valueArr: {
      type: Array,
      default: () => {
        return ['01-03', '04-06', '07-09', '10-12'];
      },
    },
    defaultValue: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      visible: false, // 继续选择弹出框是否显示
      year: new Date().getFullYear(), // 年
      season: '', // 季度
      showValue: ''
    };
  },
  watch: {
    defaultValue(value, oldValue) {
      if (!value) return;
      let arr = value.split('-');
      this.year = arr[0];
      this.showValue = `${arr[0]} 年第 ${arr[1]} 季度`;
      // let arr = value.split('-');
      // this.year = arr[0].slice(0, 4);
      // let str = arr[0].slice(4, 6) + '-' + arr[1].slice(4, 6);
      // let arrAll = this.valueArr;
      // this.showValue = `${this.year}年${arrAll.indexOf(str) + 1}季度`;
    }
  },
  created() {
    if (this.defaultValue) {
      let value = this.defaultValue;
      if (!value) return;
      // let arr = value.split('-');
      // this.year = arr[0].slice(0, 4);
      // let str = arr[0].slice(4, 6) + '-' + arr[1].slice(4, 6);
      // let arrAll = this.valueArr;
      // this.showValue = `${this.year}年${arrAll.indexOf(str) + 1}季度`;
      let arr = value.split('-');
      this.year = arr[0];
      this.showValue = `${arr[0]} 年第 ${arr[1]} 季度`;
    }
  },
  methods: {
    // 切换年
    changeYear(type) {
      const curYear = Number(this.year);
      // let tarYear = 0;
      // if (type == 1) { // 上一年
      //   tarYear = curYear - 1;
      // } else { // 下一年
      //   tarYear = curYear + 1;
      // }
      this.year = type == 1 ? curYear - 1 : curYear + 1;
    },
    // 选中季度
    selectSeason(i) {
      this.season = i + 1;
      let arr = this.valueArr[i].split('-');
      this.showValue = `${this.year} 年第 ${this.season} 季度`;
      this.visible = false;
      // this.$emit('getValue', this.year + arr[0] + '-' + this.year + arr[1]);
      this.$emit('getValue', `${this.year}-${this.season}`);

    }
  }
};
</script>

<style lang="scss" scoped>
$blue: #4090ff;
.select-quarter-container {
  position: relative;
  
}
.popover-box {
  padding: 0 !important;
}
.quarter-box {
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: solid 1px #e6ebf5;
    .date {
      flex: 1;
      color: #606266;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
    }
    .num {
      padding-right: 5px;
    }
  }
  .body {
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 50%;
      height: 50px;
      line-height: 50px;
      color: #606266;
      text-align: center;
      cursor: pointer;
      &:hover {
        color: $blue;
      }
    }
  }
}
.el-picker-panel__icon-btn {
  margin-top: 0 !important;
}

</style>