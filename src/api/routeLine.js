// 管理员相关接口
import ajax from '@/assets/ajax';

export default {
  // 获取路线列表
  getRouteList(params) {
    return ajax({
      url: '/admin/route/get_list',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },
  // 获取路线详情
  getRouteDetail(params) {
    return ajax({
      url: '/admin/route/get_detail',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },
  // 删除路线信息
  deleteRoute(params) {
    return ajax({
      url: '/admin/route/delete',
      method: 'post',
      params
    }).then(res => res).catch(err => err);
  },
  // 添加/修改首页手绘景点地图
  createOrChangeRoute(data) {
    return ajax({
      url: '/admin/route/create_or_change',
      method: 'post',
      data
    }).then(res => res).catch(err => err);
  },
};
