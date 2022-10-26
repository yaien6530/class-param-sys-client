
import ajax from '@/assets/ajax';

export default {
  // 获取厨师信息列表
  geChefList(params) {
    return ajax({
      url: '/admin/chef/get_list',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },
  // 获取厨师信息详情
  geChefDetail(params) {
    return ajax({
      url: '/admin/chef/get_detail',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },
  // 添加/修改厨师信息
  createOrChangChef(data) {
    return ajax({
      url: '/admin/chef/create_or_change',
      method: 'post',
      data
    }).then(res => res).catch(err => err);
  },
  // 修改厨师状态
  changChefStatus(params) {
    return ajax({
      url: '/admin/chef/change_status',
      method: 'post',
      params
    }).then(res => res).catch(err => err);
  },
};
