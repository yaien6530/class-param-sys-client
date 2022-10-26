<template>
    <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
    import echarts from 'echarts';
    require('echarts/theme/macarons'); // echarts theme
    import mixins from './mixins';
    //
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
                        label_title: '数量',
                        unit: ''
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
                        top: 10,
                        left: '32px',
                        right: '50px',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'value',
                        axisLabel: {
                            textStyle: {
                                color: '#333'
                            },
                            formatter: '{value}'
                        },
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
                            show: false // 隐藏底部坐标轴线条
                        }
                    }],
                    yAxis: [{
                        type: 'category',
                        data: this.data.labels,
                        axisLabel: {
                            textStyle: {
                                color: '#333'
                            }
                        },
                        axisTick: {
                            alignWithLabel: true
                        }
                    }],
                    series: [{
                        name: this.data.label_title,
                        type: 'bar',
                        stack: 'vistors',
                        barWidth: '32px',
                        itemStyle: {
                            normal: {
                                color: '#4090FF',
                                label: {
                                    show: true,
                                    position: 'right',
                                    textStyle: {
                                        color: '#666'
                                    },
                                    formatter: (name) => {
                                        return name.value + this.data.unit;
                                    }
                                }
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
