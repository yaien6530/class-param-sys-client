// 用户相关接口
import ajax from '@/assets/ajax';

export default {
  // 获取数据列表
  getCarouselList(params) {
    return ajax({
      url: '/admin/carousel/get_list',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },
  // 添加/修改数据
  createOrUpdateCarousel(data) {
    return ajax({
      url: '/admin/carousel/create_or_update',
      method: 'post',
      data
    }).then(res => res).catch(err => err);
  },

  // 获取海报图
  getPoster(params) {
    return ajax({
      url: '/admin/poster/get_poster',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },
  // 添加/修改首页海报图
  createOrChangePoster(params) {
    return ajax({
      url: '/admin/poster/create_or_change',
      method: 'post',
      params
    }).then(res => res).catch(err => err);
  },

  // 获取公告列表
  getBulletinList(params) {
    return ajax({
      url: '/admin/bulletin/get_List',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },
  // 新增公告
  createBulletin(data) {
    return ajax({
      url: '/admin/bulletin/create',
      method: 'post',
      data
    }).then(res => res).catch(err => err);
  },

  
};
