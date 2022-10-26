<template>
    <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
    import echarts from 'echarts';
    require('echarts/theme/macarons'); // echarts theme
    import mixins from './mixins';
    const animationDuration = 1500;
    export default {
        name: 'CircleChart',
        mixins: [mixins],
        props: {
            className: {
                type: String,
                default: 'circle-chart'
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
                type: Array,
                default: function() {
                    return [];
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
                this.setEchartsPie(this.className, this.data);
            }
        },
        created() {
        },
        mounted() {
            this.$nextTick(() => {
                // const data = [{ value: 300, name: '家用电器', percent: '10%' },
                //               { value: 340, name: '食用酒水', percent: '10%' },
                //               { value: 288, name: '个人健康', percent: '10%' },
                //               { value: 298, name: '服饰箱包', percent: '10%' },
                //               { value: 258, name: '母婴产品', percent: '10%' },
                //               { value: 100, name: '其他', percent: '10%' }];
                this.setEchartsPie(this.className, this.data);
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
            setEchartsPie(id, data) {
                const $el = document.getElementsByClassName(id)[0];
                const myChart = echarts.init($el, '', {
                    width: 558,
                    height: 300
                });
                const dataName = [];
                let total = 0;
                data.forEach((res) => {
                    dataName.push(res.name);
                    total += parseFloat(res.value) * 10000;
                });
                total = parseFloat((total / 10000).toFixed(2));
                const option = {
                    title: {
                        zlevel: 0,
                        text: [
                            '{name|总金额}',
                            '{value|' + total + '}'
                        ].join('\n'),
                        rich: {
                            value: {
                                color: '#303133',
                                fontSize: 20,
                                lineHeight: 40
                            },
                            name: {
                                color: '#909399',
                                lineHeight: 20
                            }
                        },
                        top: 'center',
                        left: '155',
                        textAlign: 'center',
                        textStyle: {
                            rich: {
                                value: {
                                    color: '#303133',
                                    fontSize: 20,
                                    lineHeight: 40
                                },
                                name: {
                                    color: '#909399',
                                    lineHeight: 20
                                }
                            }
                        }
                    },
                    tooltip: { // 悬停指示
                        trigger: 'item',
                        formatter: '{b}: {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'right',
                        data: dataName,
                        itemGap: 30,
                        top: 'middle',
                        left: '310px',
                        align: 'left',
                        icon: 'circle',
                        textStyle: {
                            fontSize: 12,
                            width: 193,
                            rich: {
                                a: {
                                    align: 'left',
                                    color: '#505050',
                                    padding: [0, 0, 0, 0]
                                },
                                b: {
                                    align: 'left',
                                    color: '#DCDCDC',
                                    padding: [0, 6, 0, 6]
                                },
                                c: {
                                    align: 'left',
                                    color: '#505050'
                                },
                                d: {
                                    align: 'right',
                                    color: '#888888'
                                }
                            }
                        },
                        tooltip: {
                            show: true
                        },
                        formatter: function(name) {
                            let _index = 0;
                            data.forEach((item, i) => {
                                if (item.name === name) {
                                    _index = i;
                                }
                            });
                            const arr = [
                                '{a|' + name + '}',
                                '{b|' + '|' + '}',
                                '{c|' + data[_index].percent + '%' + '}',
                                '{d|' + data[_index].value.toFixed(2) + '}'
                            ];
                            return arr.join('');
                        }
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: ['60%', '84%'],
                            center: [160, '50%'],
                            stillShowZeroSum: false,
                            avoidLabelOverlap: false,
                            zlevel: 1,
                            label: {
                                normal: {
                                    padding: [30, 30, 30, 30],
                                    borderRadius: 75,
                                    backgroundColor: '#fff',
                                    show: false,
                                    position: 'center',
                                    formatter: [
                                        '{name|{b}}',
                                        '{value|{c}}'
                                    ].join('\n'),
                                    rich: {
                                        name: {
                                            color: '#909399',
                                            lineHeight: 20
                                        },
                                        value: {
                                            color: '#303133',
                                            fontSize: 20,
                                            lineHeight: 40
                                        }
                                    }
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '16',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            data: data,
                            animationDuration
                        }
                    ],
                    color: ['#3C90F7', '#55BFC0', '#5EBE67', '#F4CD49', '#E05667', '#7C4BD8']
                };
                myChart.setOption(option);
            }
        }
    };
</script>

<style scoped>

</style>
