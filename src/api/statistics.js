import request from '@/assets/ajax';
import { config } from '@vue/test-utils';

export default {
    // 获取分销提成列表
    getCommissionList(data, params) {
        return request({
            url: '/admin/commission_user_filter',
            method: 'post',
            data,
            params
        }).then(res => res).catch(err => {
            console.error(err);
        });
    },
    // 获取总销售额、访问量、用户人数、支付订单统计
    getTotalAnalysis() {
        return request({
            url: '/admin/total_analysis',
            method: 'get'
        }).then(res => res).catch(err => {
            console.error(err);
        });
    },
    // 获取销售额趋势
    getSaleAnalyze(params) {
        return request({
            url: '/admin/current_sale',
            method: 'get',
            params
        }).then(res => res).catch(err => {
            console.error(err);
        });
    },
    // 获取商品销售分析
    getProductAnalyze(params) {
        return request({
            url: '/admin/product_current_sale',
            method: 'get',
            params
        }).then(res => res).catch(err => {
            console.error(err);
        });
    },
    // 获取热售商品
    getTopProduct() {
        return request({
            url: '/admin/current_month_top_product',
            method: 'get'
        }).then(res => res).catch(err => {
            console.error(err);
        });
    },
    // 获取热售商品
    getCategoryStatistics() {
        return request({
            url: '/admin/statistics/category',
            method: 'get'
        }).then(res => res).catch(err => {
            console.error(err);
        });
    },
    // 获取某月销售额
    getMonthSale(params) {
        return request({
            url: '/admin/month_sale',
            method: 'get',
            params
        }).then(res => res).catch(err => {
            console.error(err);
        });
    },  
};