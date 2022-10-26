// 数据分析相关接口
import ajax from '@/assets/ajax';

export default {
  // 获取当前年度、月度、日小程序点击与登录总数
  getAnalysisAll(params) {
    return ajax({
      url: '/admin/analysis/get_all',
      params
    }).then(res => res).catch(err => err);
  },

  // 获取本年各月订单的分布信息
  getUserAnalysis(params) {
    return ajax({
      url: '/admin/analysis/get_user_analysis',
      params
    }).then(res => res).catch(err => err);
  },


  // 获取景点当前年度、月度、日用户点击数与访问数
  getAttractionsAnalysisAll(params) {
    return ajax({
      url: '/admin/analysis/get_attractions_all',
      params
    }).then(res => res).catch(err => err);
  },

  // 获取景点点击数与用户访问数分布
  getAttractionsAnalysis(params) {
    return ajax({
      url: '/admin/analysis/get_attractions_analysis',
      params
    }).then(res => res).catch(err => err);
  },
};
