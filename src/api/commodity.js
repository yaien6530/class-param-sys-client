
import ajax from '@/assets/ajax';

export default {

  // 获取商品信息列表
  getCommodityList(params) {
    return ajax({
      url: '/admin/commodity/get_list',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },
  // 获取商品信息详情
  getCommodityDetail(params) {
    return ajax({
      url: '/admin/commodity/get_detail',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },
  // 添加/修改商品信息
  createOrChangeCommodity(data) {
    return ajax({
      url: '/admin/commodity/create_or_change',
      method: 'post',
      data
    }).then(res => res).catch(err => err);
  },
  // 修改商品状态
  changeCommodityStatus(params) {
    return ajax({
      url: '/admin/commodity/change_status',
      method: 'post',
      params
    }).then(res => res).catch(err => err);
  },


};
