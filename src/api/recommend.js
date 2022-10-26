import ajax from '@/assets/ajax';

export default {
  // 分页查询信息
  queryRecommend(params) {
    return ajax({
      url: '/admin/recommend/query',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },

  // 删除/下架/上架信息，-1-删除 0-下架 1-上架
  updateRecommendState(params) {
    return ajax({
      url: '/admin/recommend/update_state',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },

  // 获取推荐内容
  getRecommend(params) {
    return ajax({
      url: '/admin/recommend/get_detail',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },

  // 添加/修改信息
  createRecommend(data) {
    return ajax({
      url: '/admin/recommend/create',
      method: 'post',
      data
    }).then(res => res).catch(err => err);
  },
};