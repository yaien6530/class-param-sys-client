<template>
  <div class="title-container" :class="{'line': line}">
    <div class="title cl-blue">{{title}}</div>
    <div class="desc">{{content}}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    line: {
      type: Boolean,
      default: true
    }
  },
}
</script>

<style lang="scss" scoped>
.title-container {
  padding-bottom: 20px;
  .title {
    font-size: 20px;
  }
  .desc {
    margin-top: 20px;
    font-size: 12px;
    color: #8F8F8F;
  }
  &.line {
    border-bottom: 1px solid #ccc;
  }
}
</style>

