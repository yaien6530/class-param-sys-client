
import ajax from '@/assets/ajax';

export default {
  // 获取民宿列表
  getHousingtList(params) {
    return ajax({
      url: '/admin/housing/get_list',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },
  // 获取民宿详情
  getHousingtDetail(params) {
    return ajax({
      url: '/admin/housing/get_detail',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },
  // 添加/修改民宿
  createOrChangeHousingt(data) {
    return ajax({
      url: '/admin/housing/create_or_change',
      method: 'post',
      data
    }).then(res => res).catch(err => err);
  },
  // 修改美食商家状态
  changeHousingtStatus(params) {
    return ajax({
      url: '/admin/housing/change_status',
      method: 'post',
      params
    }).then(res => res).catch(err => err);
  },


  // 商家评论信息列表
  getHousingCommentList(params) {
    return ajax({
      url: '/admin/housing/get_comment_list',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },
  // 删除评论
  deleteHousingComment(params) {
    return ajax({
      url: '/admin/housing/delete_comment',
      method: 'post',
      params
    }).then(res => res).catch(err => err);
  },
  
};
