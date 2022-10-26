// 客户管理相关接口
import ajax from '@/assets/ajax';

export default {
    // 数据概览-获取当日实时数据
    getOverviewRealTimeData(params) {
        return ajax({
            url: '/admin/sales/v1/get_shop_sale_analy_today',
            params
        }).then(res => res).catch(err => err);
    },

    // 获取竖向图表数据（日周月年）
    getVerticalEcharsData(data) {
        return ajax({
            url: '/admin/sales/v1/get_shop_sale_analy_total',
            method: 'post',
            data
        }).then(res => res).catch(err => err);
    },

    // 获取横向图表数据（时间范围，数据指标）type: 1消费数据，2件数（用不到），3购买频次
    getHorizontalEcharsData(data) {
        return ajax({
            url: '/admin/sales/v1/get_shop_sale_analy_beyond',
            method: 'post',
            data
        }).then(res => res).catch(err => err);
    },

    // 获取客户基础数据
    getCustomerBaseData(params) {
        return ajax({
            url: '/admin/sales/v1/get_user_sale_analysis',
            params
        }).then(res => res).catch(err => err);
    },

    // 获取客户购买频次表格数据（日周月年）
    getCustomerExcelData(data) {
        return ajax({
            url: '/admin/sales/v1/get_user_sale_times',
            method: 'post',
            data
        }).then(res => res).catch(err => err);
    },

    // 获取客户购买频次表格数据（时间范围）
    getCustomerEcharsData(data) {
        return ajax({
            url: '/admin/sales/v1/get_user_sale_beyond_times',
            method: 'post',
            data
        }).then(res => res).catch(err => err);
    }
};
