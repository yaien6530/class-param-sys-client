export default {
    data() {
        // sales 销售额
        // spend 消费数据
        // pay 支付数据
        // buy 购买频次
        // like 消费偏好
        return {
            default_times: [(new Date()).getTime() - 2592000000, (new Date()).getTime()],
            data_type1: [],
            data_type2: [],
            data_type3: [],
            sales_active_index: '1',
            spend_search_form: {
                times: [],
                type: 1 // 1客户消费，2商品购买件数
            },
            buy_search_form: {
                times: [],
                type: 1 // 1客户消费，2商品购买件数
            },
            card_data: {
                price_today: 100,
                price_wow: 18.8,
                price_dod: -1.8,
                price_yesterday: 102,
                customer_today: 100,
                customer_wow: 18.8,
                customer_dod: -1.8,
                customer_yesterday: 102,
                pay_times_today: 100,
                pay_times_wow: 18.8,
                pay_times_dod: -1.8,
                pay_times_yesterday: 102,
                unit_price_today: 120,
                unit_price_yesterday: 100,
                differ_value: 0,
                differ_up: true,
                unit_price_progress: 0
            },
            sale_echars: {
                labels: [],
                values: [],
                label_title: '日期', // 时间，星期，日期，月份
                value_title: '销售额'
            },
            spend_echars: {
                labels: [],
                values: [],
                label_title: '消费人数',
                unit: '人' // 件
            },
            pay_table: [],
            buy_times_echars: {
                labels: [],
                values: [],
                label_title: '消费人数',
                unit: '人' // 件
            },
            buy_times_table: []
        };
    }
};
