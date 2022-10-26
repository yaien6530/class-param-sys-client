<template>
    <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
    import echarts from 'echarts';
    require('echarts/theme/macarons'); // echarts theme
    import mixins from './mixins';
    const animationDuration = 1500;
    export default {
        mixins: [mixins],
        props: {
            className: {
                type: String,
                default: 'chart'
            },
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                default: '300px'
            },
            data: {
                type: Object,
                default: function() {
                    return {
                        labels: [],
                        values: [],
                        label_title: '',
                        value_title: ''
                    };
                }
            }
        },
        data() {
            return {
                chart: null
            };
        },
        watch: {
            data() {
                this.initChart();
            }
        },
        created() {
        },
        mounted() {
            this.$nextTick(() => {
                this.initChart();
            });
        },
        beforeDestroy() {
            if (!this.chart) {
                return;
            }
            this.chart.dispose();
            this.chart = null;
        },
        methods: {
            initChart() {
                this.chart = echarts.init(this.$el, 'macarons');

                this.chart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: { // 调整图标边距
                        top: 50,
                        left: '32px',
                        right: '80px',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [{
                        name: this.data.label_title,
                        nameTextStyle: {
                            padding: [0, 0, -28, -10],
                            color: '#333333'
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#333'
                            }
                        },
                        type: 'category',
                        data: this.data.labels,
                        axisTick: {
                            alignWithLabel: true
                        },
                        splitLine: { show: false }, // 去除网格线
                        splitArea: { show: false } // 保留网格区域
                    }],
                    yAxis: [{
                        name: this.data.value_title,
                        nameTextStyle: {
                            padding: [0, 0, 20, -40],
                            color: '#333333'
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#333'
                            }
                        },
                        type: 'value',
                        axisTick: {
                            show: false
                        },
                        splitLine: { // 网格线
                            show: true,
                            lineStyle: {
                                color: ['#BFBFBF'],
                                width: 1,
                                type: 'dotted'
                            }
                        },
                        splitArea: { show: false }, // 网格区域
                        axisLine: {
                            show: false // 隐藏左边坐标轴线条
                        }
                    }],
                    series: [{
                        name: this.data.value_title,
                        type: 'bar',
                        stack: 'vistors',
                        barWidth: this.data.labels.length < 16 ? '32px' : '20px',
                        itemStyle: {
                            normal: {
                                color: '#4090FF'
                            }
                        },
                        data: this.data.values,
                        animationDuration
                    }]
                });
            }
        }
    };
</script>
