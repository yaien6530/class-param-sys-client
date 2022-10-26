// 管理员相关接口
import ajax from '@/assets/ajax';

export default {

  // 获取管理员列表
  getAdminList(params) {
    return ajax({
      url: '/admin/get_admin_list',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },

  // 获取管理员详情
  getAdminDetail(params) {
    return ajax({
      url: '/admin/get_admin',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },

  // 删除管理员
  deleteAdmin(params) {
    return ajax({
      url: '/admin/delete',
      method: 'post',
      params
    }).then(res => res).catch(err => err);
  },

  // 新增或修改管理员信息
  addOrChangeAdmin(data) {
    return ajax({
      url: '/admin/add_or_change',
      method: 'post',
      data
    }).then(res => res).catch(err => err);
  },

  // 获取管理员权限菜单列表
  getAdminRolesMenu(params) {
    return ajax({
      url: '/admin/get_admin_roles_menu',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },

  // 获取管理员绑定的店铺
  getShopDropDownList(params) {
    return ajax({
      url: '/admin/get_shop_drop_down_list',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },

};
