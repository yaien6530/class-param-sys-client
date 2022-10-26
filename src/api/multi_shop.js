// 多门店相关接口
import ajax from '@/assets/ajax';

export default {
  
  // 获取角色详情
  getRoleDetail(params) {
    return ajax({
      url: '/admin/role/get_role_detail',
      method: 'post',
      params
    }).then(res => res).catch(err => err);
  },
  // 新增角色
  createRole(data) {
    return ajax({
      url: '/admin/role/add_role',
      method: 'post',
      data
    }).then(res => res).catch(err => err);
  },
  // 编辑角色
  updateRole(data) {
    return ajax({
      url: '/admin/role/update_role_detail',
      method: 'post',
      data
    }).then(res => res).catch(err => err);
  },
  // 删除角色
  deleteRole(params) {
    return ajax({
      url: '/admin/role/delete_role',
      method: 'post',
      params
    }).then(res => res).catch(err => err);
  },


  // 账号绑角色
  setRoleMenu(data) {
    return ajax({
      url: '/admin/role/authorize_admin',
      method: 'post',
      data
    }).then(res => res).catch(err => err);
  },
  // 账号删权限
  deleteAdminRole(params) {
    return ajax({
      url: '/admin/role/delete_authorize_admin',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },

  // 查询管理员账号权限
  getAdminRoles(params) {
    return ajax({
      url: '/admin/role/get_admin_roles',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },

  // 获取管理员权限菜单列表
  getAdminRolesMenu(params) {
    return ajax({
      url: '/admin/role/get_admin_roles_menu',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },

};
