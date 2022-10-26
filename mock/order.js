
export default [
    {
        url: '/order/getOrderList',
        type: 'get',
        response: _ => {
            return {
                code: 20000,
                data: {
                    pvData: [
                        { key: 'PC', pv: 1024 },
                        { key: 'mobile', pv: 1024 },
                        { key: 'ios', pv: 1024 },
                        { key: 'android', pv: 1024 }
                    ]
                }
            };
        }
    }
];

