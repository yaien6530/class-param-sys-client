// 管理员相关接口
import ajax from '@/assets/ajax';

export default {
  // 获取首页手绘景点地图
  getMainMap(params) {
    return ajax({
      url: '/admin/attractions/get_main_map',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },

  // 添加/修改首页手绘景点地图
  createOrChangeMapImage(data) {
    return ajax({
      url: '/admin/attractions/create_or_change_map_image',
      method: 'post',
      data
    }).then(res => res).catch(err => err);
  },

  // 主地图图片添加景点坐标
  addCoordinate(data) {
    return ajax({
      url: '/admin/attractions/add_coordinate',
      method: 'post',
      data
    }).then(res => res).catch(err => err);
  },

  
  // 获取手绘景点地图景点列表
  getMainMapAttractionsList(params) {
    return ajax({
      url: '/admin/attractions/get_main_map_attractions_list',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },

  // 获取景点列表
  getAttractionList(params) {
    return ajax({
      url: '/admin/attractions/get_list',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },

  // 获取景点下拉列表
  getAttractionDropDownList(params) {
    return ajax({
      url: '/admin/attractions/get_drop_down_list',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },

  // 获取景点详情
  getAttractionDetail(params) {
    return ajax({
      url: '/admin/attractions/get_detail',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },

  // 修改景点状态
  changeAttractionStatus(params) {
    return ajax({
      url: '/admin/attractions/change_status',
      method: 'post',
      params
    }).then(res => res).catch(err => err);
  },

  // 添加/修改景点信息
  addOrChangeAttraction(data) {
    return ajax({
      url: '/admin/attractions/create_or_change',
      method: 'post',
      data
    }).then(res => res).catch(err => err);
  },


  
  // 获取景点分类列表
  getAttractionSortList(params) {
    return ajax({
      url: '/admin/attractions/get_sort_list',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },

  // 添加/修改分类
  createOrChangeAttractionSort(data) {
    return ajax({
      url: '/admin/attractions/create_or_change_sort',
      method: 'post',
      data
    }).then(res => res).catch(err => err);
  },

  // 删除分类
  deleteAttractionSort(params) {
    return ajax({
      url: '/admin/attractions/delete_sort',
      method: 'post',
      params
    }).then(res => res).catch(err => err);
  },
  
};
