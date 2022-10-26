<!--客户数据概览-->
<template>
    <div class="customer-overview-container">
        <!--当日实时数据-->
        <div class="top-container container">
            <div class="title">当日实时数据</div>
            <div class="main">
                <div class="list">
                    <div class="list-title">本日支付总额 <i /></div>
                    <div class="list-value">${{ card_data.price_today }}</div>
                    <div class="list-change">
                        <p>
                            周同比
                            <i
                                v-if="card_data.price_wow > 0"
                                class="el-icon-top"
                            />
                            <i
                                v-else-if="card_data.price_wow < 0"
                                class="el-icon-bottom red"
                            />
                            <span v-else style="padding-left: 10px;" />
                            {{
                                card_data.price_wow
                                    ? `${
                                          card_data.price_wow > 999
                                              ? "999"
                                              : Math.abs(card_data.price_wow)
                                      }%`
                                    : "--"
                            }}
                        </p>
                        <p>
                            日环比
                            <i
                                v-if="card_data.price_dod > 0"
                                class="el-icon-top"
                            />
                            <i
                                v-else-if="card_data.price_dod < 0"
                                class="el-icon-bottom red"
                            />
                            <span v-else style="padding-left: 10px;" />
                            {{
                                card_data.price_dod
                                    ? `${
                                          card_data.price_dod > 999
                                              ? "999"
                                              : Math.abs(card_data.price_dod)
                                      }%`
                                    : "--"
                            }}
                        </p>
                    </div>
                    <div class="list-yesterday">
                        昨日支付总额 ${{ card_data.price_yesterday }}
                    </div>
                </div>
                <div class="list">
                    <div class="list-title">截至今日总用户量 <i /></div>
                    <div class="list-value">{{ card_data.customer_today }}</div>
                    <div class="list-change">
                        <p>
                            周同比
                            <i
                                v-if="card_data.customer_wow > 0"
                                class="el-icon-top"
                            />
                            <i
                                v-else-if="card_data.customer_wow < 0"
                                class="el-icon-bottom red"
                            />
                            <span v-else style="padding-left: 10px;" />
                            {{
                                card_data.customer_wow
                                    ? `${
                                          card_data.customer_wow > 999
                                              ? "999"
                                              : Math.abs(card_data.customer_wow)
                                      }%`
                                    : "--"
                            }}
                        </p>
                        <p>
                            日环比
                            <i
                                v-if="card_data.customer_dod > 0"
                                class="el-icon-top"
                            />
                            <i
                                v-else-if="card_data.customer_dod < 0"
                                class="el-icon-bottom red"
                            />
                            <span v-else style="padding-left: 10px;" />
                            {{
                                card_data.customer_dod
                                    ? `${
                                          card_data.customer_dod > 999
                                              ? "999"
                                              : Math.abs(card_data.customer_dod)
                                      }%`
                                    : "--"
                            }}
                        </p>
                    </div>
                    <div class="list-yesterday">
                        截至昨日总用户量 {{ card_data.customer_yesterday }}
                    </div>
                </div>
                <div class="list">
                    <div class="list-title">今日支付笔数 <i /></div>
                    <div class="list-value">
                        {{ card_data.pay_times_today }}
                    </div>
                    <div class="list-change">
                        <p>
                            周同比
                            <i
                                v-if="card_data.pay_times_wow > 0"
                                class="el-icon-top"
                            />
                            <i
                                v-else-if="card_data.pay_times_wow < 0"
                                class="el-icon-bottom red"
                            />
                            <span v-else style="padding-left: 10px;" />
                            {{
                                card_data.pay_times_wow
                                    ? `${
                                          card_data.pay_times_wow > 999
                                              ? "999"
                                              : Math.abs(
                                                    card_data.pay_times_wow
                                                )
                                      }%`
                                    : "--"
                            }}
                        </p>
                        <p>
                            日环比
                            <i
                                v-if="card_data.pay_times_dod > 0"
                                class="el-icon-top"
                            />
                            <i
                                v-else-if="card_data.pay_times_dod < 0"
                                class="el-icon-bottom red"
                            />
                            <span v-else style="padding-left: 10px;" />
                            {{
                                card_data.pay_times_dod
                                    ? `${
                                          card_data.pay_times_dod > 999
                                              ? "999"
                                              : Math.abs(
                                                    card_data.pay_times_dod
                                                )
                                      }%`
                                    : "--"
                            }}
                        </p>
                    </div>
                    <div class="list-yesterday">
                        昨日支付笔数 {{ card_data.pay_times_yesterday }}
                    </div>
                </div>
                <div class="list">
                    <div class="list-title">今日客单价 <i /></div>
                    <div class="list-value">
                        ${{ card_data.unit_price_today }}
                    </div>
                    <div class="list-change progress">
                        <p>
                            较昨日
                            <i
                                v-if="card_data.differ_up === true"
                                class="el-icon-top"
                            />
                            <i
                                v-else-if="card_data.differ_up === false"
                                class="el-icon-bottom red"
                            />
                            ${{ card_data.differ_value }}
                        </p>
                        <el-progress
                            :percentage="card_data.unit_price_progress"
                            :format="format"
                            :color="card_data.differ_up ? '#36CB73' : 'red'"
                        />
                    </div>
                    <div class="list-yesterday">
                        昨日客单价 ${{ card_data.unit_price_yesterday }}
                    </div>
                </div>
            </div>
        </div>
        <!--销售数据分析-->
        <div class="sales-container container">
            <div class="title">销售额数据分析</div>
            <div class="main">
                <el-menu
                    :default-active="sales_active_index"
                    class="el-menu-demo"
                    mode="horizontal"
                    @select="handleSelectSales"
                >
                    <el-menu-item index="1">今日</el-menu-item>
                    <el-menu-item index="2">本周</el-menu-item>
                    <el-menu-item index="3">本月</el-menu-item>
                    <el-menu-item index="4">全年</el-menu-item>
                </el-menu>
                <VerticalChart height="350px" :data="sale_echars" />
            </div>
        </div>
        <!--消费数据分析-->
        <div class="spend-container container container-mb0">
            <div class="title">消费数据分析</div>
            <div class="main" style="padding: 0 30px 10px 10px;">
                <div class="time-content">
                    <span>付款时间：</span>
                    <el-date-picker
                        v-model="spend_search_form.times"
                        style="width: 241px"
                        size="small"
                        value-format="timestamp"
                        type="daterange"
                        range-separator="~"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    />
                    <el-button
                        type="primary"
                        size="small"
                        @click="handleSearchSpend"
                        >查 询</el-button
                    >
                </div>
                <div class="time-content btm">
                    <span>数据指标：</span>
                    <el-radio-group
                        v-model="spend_search_form.type"
                        @change="handleSearchSpend"
                    >
                        <el-radio :label="1">客户消费金额</el-radio>
                        <el-radio :label="2">商品购买件数</el-radio>
                    </el-radio-group>
                </div>
                <HorizontalChart :data="spend_echars" />
            </div>
        </div>
        <!--支付数据分布-->
        <div class="pay-container container container-mt0">
            <div class="title">支付数据分布</div>
            <div class="main">
                <el-table
                    class="goods-list-table"
                    :data="pay_table"
                    header-row-class-name="table-header"
                    fit
                    style="width: 100%"
                >
                    <el-table-column
                        min-width="75px"
                        align="center"
                        label="支付金额区间"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.pay_limit }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="75px"
                        align="center"
                        label="客户数"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.customer_num }}人</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="75px"
                        align="center"
                        label="客户数占比"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.customer_percent }}%</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="75px"
                        align="center"
                        label="总支付金额（元）"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.total_price }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="75px"
                        align="center"
                        label="总支付金额占比"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.pay_percent }}%</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="75px"
                        align="center"
                        label="商品支付件数"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.pay_num }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="75px"
                        align="center"
                        label="人均购买件数"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.avg_buy }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!--购买频次分析-->
        <div class="times-container container container-mb0">
            <div class="title">购买频次分析</div>
            <div class="main" style="padding: 0 30px 10px 10px;">
                <div class="time-content">
                    <span>付款时间：</span>
                    <el-date-picker
                        v-model="buy_search_form.times"
                        style="width: 241px"
                        size="small"
                        value-format="timestamp"
                        type="daterange"
                        range-separator="~"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    />
                    <el-button
                        type="primary"
                        size="small"
                        @click="handleSearchBuy"
                        >查 询</el-button
                    >
                </div>
                <!--                <div class="time-content btm">-->
                <!--                    <span>数据指标：</span>-->
                <!--                    <el-radio-group v-model="buy_search_form.type" @change="handleChangeBuyRadio">-->
                <!--                        <el-radio :label="1">客户消费</el-radio>-->
                <!--                        <el-radio :label="2">商品购买件数</el-radio>-->
                <!--                    </el-radio-group>-->
                <!--                </div>-->
                <HorizontalChart :data="buy_times_echars" />
            </div>
        </div>
        <!--购买频次数据分布-->
        <div class="bottom-container container container-mt0">
            <div class="title">购买频次数据分布</div>
            <div class="main">
                <el-table
                    class="goods-list-table"
                    :data="buy_times_table"
                    header-row-class-name="table-header"
                    fit
                    style="width: 100%"
                >
                    <el-table-column
                        min-width="75px"
                        align="center"
                        label="购买频次"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.pay_limit }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="75px"
                        align="center"
                        label="客户数"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.customer_num }}人</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="75px"
                        align="center"
                        label="客户数占比"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.customer_percent }}%</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="75px"
                        align="center"
                        label="总支付金额（元）"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.total_price }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="75px"
                        align="center"
                        label="总支付金额占比"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.pay_percent }}%</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="75px"
                        align="center"
                        label="商品支付件数"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.pay_num }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="75px"
                        align="center"
                        label="人均购买件数"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.avg_buy }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import VerticalChart from "./components/VerticalChart"; // 纵向柱状图标
import HorizontalChart from "./components/HorizontalChart"; // 横向柱状图标
import overviewMixin from "./overviewMixin";
export default {
    name: "CustomerOverview",
    components: { VerticalChart, HorizontalChart },
    mixins: [overviewMixin],
    data() {
        return {
            buy_search_form: {
                times: [],
                type: 1 // 1客户消费，2商品购买件数
            },
            pay_table_list: [
                {
                    extent_price: 100, // 支付金额区间
                    customer_num: 100, // 客户数
                    customer_percent: 100, // 客户数占比
                    total_price: 100, // 总支付金额（元）
                    total_price_percent: 100, // 总支付金额占比
                    product_num: 100, // 商品支付件数
                    person_capita_num: 100 // 人均购买件数
                }
            ]
        };
    },
    created() {
        this.spend_search_form.times = this.default_times;
        this.buy_search_form.times = this.default_times;
        this.getOverviewRealTimeData();
        this.handleSelectSales();
        this.handleSearchSpend();
        this.handleSearchBuy();
    },
    methods: {
        format() {
            return null;
        },
        // 获取当日实时数据
        getOverviewRealTimeData() {
            this.Api.getOverviewRealTimeData({
                // type: 1
                type: 2
            })
                .then(res => {
                    if (res.data.ret === 0) {
                        this.card_data = res.data.data || {};
                        // 修正字段名--------------------------------------------------------------------------------------------------------------------------------------------
                        if (!this.card_data.pay_times_wow)
                            this.card_data.pay_times_wow =
                                this.card_data.pay_wow || 0;
                        if (!this.card_data.pay_times_dod)
                            this.card_data.pay_times_dod =
                                this.card_data.pay_dod || 0;
                        if (!this.card_data.customer_wow)
                            this.card_data.customer_wow =
                                this.card_data.customer_wo_w || 0;

                        if (!this.card_data.unit_price_yesterday) {
                            this.card_data.unit_price_yesterday = 0;
                        }
                        let value = 0;
                        const differ = (
                            (this.card_data.unit_price_today || 0) -
                            (this.card_data.unit_price_yesterday || 0)
                        ).toFixed(2);
                        this.card_data.differ_value = Math.abs(differ);
                        if (differ > 0) {
                            this.card_data.differ_up = true;
                            value =
                                100 -
                                (this.card_data.unit_price_yesterday /
                                    this.card_data.unit_price_today) *
                                    100;
                        } else if (differ < 0) {
                            this.card_data.differ_up = false;
                            value =
                                (Math.abs(differ) /
                                    this.card_data.unit_price_yesterday) *
                                100;
                        } else {
                            this.card_data.differ_up = true;
                            value = 0;
                        }
                        this.card_data.unit_price_progress = value;
                        // console.log('进度条：', value);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 销售额数据分析-点击切换（日 周 月 年）
        handleSelectSales(e) {
            if (e) this.sales_active_index = e + "";
            const data = {
                // type: 1,
                type: 2,
                bill_ym: new Date().getTime(),
                time_type: parseInt(this.sales_active_index) || 1
            };
            this.Api.getVerticalEcharsData(data)
                .then(res => {
                    let label_title = "时间";
                    switch (this.sales_active_index) {
                        case "1":
                            label_title = "时间";
                            break;
                        case "2":
                            label_title = "星期";
                            break;
                        case "3":
                            label_title = "日期";
                            break;
                        case "4":
                            label_title = "月份";
                            break;
                    }
                    this.sale_echars = {
                        labels: [],
                        values: [],
                        label_title: label_title,
                        value_title: "销售额"
                    };
                    if (res.data.ret === 0) {
                        const data = JSON.parse(JSON.stringify(res.data.data));
                        data.map((item, index) => {
                            this.sale_echars.labels.push(item.date);
                            this.sale_echars.values.push(item.sale_amount);
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 消费数据分析-切换数据指标（改成handleSearchSpend事件了，此function为handleSearchSpend内调用）
        handleChangeSpendRadio(e) {
            this.spend_echars = {
                labels: [],
                values: [],
                label_title:
                    this.spend_search_form.type === 1 ? "消费人数" : "消费人数",
                unit: this.spend_search_form.type === 1 ? "人" : "人"
            };
            this.data_type1.map((item, index) => {
                this.spend_echars.labels.push(item.pay_limit || "");
                if (this.spend_search_form.type === 1) {
                    this.spend_echars.values.push(item.customer_num || 0);
                } else {
                    this.spend_echars.values.push(item.customer_num || 0);
                }
            });
            this.$forceUpdate();
        },
        // 购买频次分析-切换数据指标
        handleChangeBuyRadio(e) {
            this.buy_times_echars = {
                labels: [],
                values: [],
                label_title:
                    this.buy_search_form.type === 1 ? "消费人数" : "购买件数",
                unit: this.buy_search_form.type === 1 ? "人" : "件"
            };
            this.data_type3.map((item, index) => {
                this.buy_times_echars.labels.push(item.pay_limit || "");
                if (this.buy_search_form.type === 1) {
                    this.buy_times_echars.values.push(item.customer_num || 0);
                } else {
                    this.buy_times_echars.values.push(item.pay_num || 0);
                }
            });
            this.$forceUpdate();
        },
        // 消费数据分析-点击查询
        handleSearchSpend() {
            const data = {
                start_time: this.spend_search_form.times[0] || null,
                end_time: this.spend_search_form.times[1] + 86399999 || null,
                type: this.spend_search_form.type
            };
            this.Api.getHorizontalEcharsData(data)
                .then(res => {
                    this.data_type1 = JSON.parse(JSON.stringify(res.data.data));
                    this.pay_table = this.data_type1;
                    this.handleChangeSpendRadio();
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 购买频次分析-点击查询
        handleSearchBuy() {
            const data = {
                start_time: this.buy_search_form.times[0] || null,
                end_time: this.buy_search_form.times[1] + 86399999 || null,
                type: 3
            };
            this.Api.getHorizontalEcharsData(data)
                .then(res => {
                    this.data_type3 = JSON.parse(JSON.stringify(res.data.data));
                    this.buy_times_table = this.data_type3;
                    this.handleChangeBuyRadio();
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
};
</script>

<style lang="scss">
.customer-overview-container {
    background-color: #f5f5f5;
    .container {
        width: 100%;
        overflow: hidden;
        background-color: #fff;
        margin-bottom: 15px;
        &.container-mb0 {
            margin-bottom: 0;
        }
        &.container-mt0 {
            .title {
                border-top: 1px solid #eee;
                border-bottom: 0;
                height: 52px;
                line-height: 51px;
            }
            .main {
                padding-top: 0;
            }
        }
        .title {
            width: 100%;
            height: 48px;
            line-height: 47px;
            border-bottom: 1px solid #eee;
            padding-left: 20px;
            font-size: 16px;
            color: #4090ff;
        }
    }
    .main {
    }
    .top-container {
        .main {
            box-sizing: border-box;
            padding: 10px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .list {
                flex: 1;
                height: 158px;
                border: 1px solid #eee;
                padding: 15px 18px 0;
                margin: 0 10px;
                min-width: 230px;
                .list-title {
                    height: 20px;
                    line-height: 20px;
                    font-size: 12px;
                    color: #aaa;
                    i {
                        color: #aaa;
                        font-size: 12px;
                    }
                }
                .list-value {
                    font-size: 28px;
                    height: 50px;
                    line-height: 50px;
                    color: #000;
                }
                .list-change {
                    overflow: hidden;
                    padding-bottom: 20px;
                    line-height: 20px;
                    height: 35px;
                    position: relative;
                    p {
                        width: 50%;
                        float: left;
                        font-size: 12px;
                        color: #666;
                        i {
                            font-size: 12px;
                            font-weight: bold;
                            color: #36cb73;
                            &.red {
                                color: #ff0000;
                            }
                        }
                    }
                    &.progress {
                        padding-bottom: 0;
                        position: relative;
                        bottom: 5px;
                        p {
                            width: 100%;
                        }
                        .el-progress {
                            transform: rotateY(180deg);
                            height: 30px;
                            .el-progress-bar {
                                padding: 0;
                                position: relative;
                                bottom: 5px;
                            }
                        }
                    }
                }
                .list-change::after {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 1px;
                    background-color: #eee;
                }
                .list-yesterday {
                    line-height: 30px;
                    font-size: 12px;
                }
            }
        }
    }
    .sales-container {
        .main {
            padding-bottom: 10px;
            .el-menu-demo {
                width: 258px;
                height: 50px;
                margin: 0 auto;
                border-left: 1px solid #ebebeb;
                border-right: 1px solid #ebebeb;
                li.el-menu-item {
                    width: 64px;
                    height: 49px;
                    line-height: 50px;
                    color: #505050;
                    &.is-active {
                        color: #0b90fe;
                        background-color: #d7e9fd;
                        border-bottom: 2px solid #0b90fe;
                    }
                }
            }
        }
    }
    .spend-container {
        .main {
            .time-content {
                margin: 20px;
                &.btm {
                    margin-bottom: 24px;
                }
                > span {
                    font-size: 12px;
                }
            }
            .type-content {
                margin: 10px;
            }
        }
    }
    .pay-container {
        .main {
            padding: 20px;
        }
    }
    .times-container {
        .time-content {
            margin: 20px;
            &.btm {
                margin-bottom: 24px;
            }
            > span {
                font-size: 12px;
            }
        }
        .type-content {
            margin: 10px;
        }
    }
    .bottom-container {
        .main {
            padding: 20px;
        }
    }
    .table-header {
        background-color: #f7f8fa;
        th {
            background-color: #f7f8fa;
        }
    }
    .goods-list-table {
        .el-table__body tr:hover {
            background-color: #fff;
            > td {
                background-color: #fff;
            }
        }
    }
}
</style>
