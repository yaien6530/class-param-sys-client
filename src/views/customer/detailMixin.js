export default {
    data() {
        // sales 销售额
        // spend 消费数据
        // pay 支付数据
        // buy 购买频次
        // like 消费偏好
        return {
            user_id: 0,
            default_times: [(new Date()).getTime() - 2592000000, (new Date()).getTime()],
            data_type1: [],
            buy_active_index: '3',
            spend_search_form: {
                times: []
            },
            card_data: {
                user_name: '',
                create_time: '2020-04-17', // 加入时间
                sex: '',
                birthday: '', // 生日
                region: '', // 所在地区
                phone: '', // 联系方式
                address: '', // 收货地址（多个地址怎么解决，这我就不知道了）
                member_level: '', // 会员等级
                integral: 0, // 拥有积分
                last_get_integral: 0, // 最近获得积分
                last_get_integral_by: '', // 最近积分获取渠道
                member_equity: '', // 会员权益
                buy_total_times: 0, // 消费次数
                buy_total_price: 0, // 累计消费
                avg_price: 0, // 单词平均消费
                last_buy_date: '', // 最近消费时间
                last_buy_product: '',
                recharge_times: 0, // 储值次数
                recharge_history_total: 0, // 累计储值
                balance: 0, // 剩余余额
                last_recharge_date: '', // 最近储值
                bonus_history_total: 0 // 累计获赠金额
            },
            like_echars: [],
            top5_table: [],
            spend_echars: {
                labels: [],
                values: [],
                label_title: '次数',
                unit: '次' // 件
            },
            pay_table: [],
            buy_times_echars: {
                labels: [],
                values: [],
                label_title: '日期', // 时间，星期，日期，月份
                value_title: '次数'
            },
            buy_times_table: []
        };
    }
};
