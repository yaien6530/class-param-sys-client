// 角色相关接口
import ajax from '@/assets/ajax';

export default {
  // 获取角色列表
  getRoleList(params) {
    return ajax({
      url: '/admin/role/get_role_list',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },
  
  // 新增/修改角色
  addOrChangeRole(data) {
    return ajax({
      url: `/admin/role/add_or_change`,
      method: 'post',
      data,
    }).then(res => res).catch(err => err);
  },

  // 删除角色
  deleteRole(params) {
    return ajax({
      url: `/admin/role/delete`,
      method: 'post',
      params
    }).then(res => res).catch(err => err);
  },

  // 获取角色菜单权限列表
  getRoleDetail(params) {
    return ajax({
      url: `/admin/role/get_role_detail`,
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },

};
