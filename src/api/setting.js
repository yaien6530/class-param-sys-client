/*
 * @Description:
 * @Version: 2.0
 * @Author: Xing
 * @Date: 2020-03-11 09:02:47
 * @LastEditors: Xing
 * @LastEditTime: 2020-08-01 20:25:51
 */

// 通用设置相关接口
import ajax from "@/assets/ajax";

export default {
  // 获取设置信息
  getSettingInfo(data) {
    return ajax({
      url: "/app/auth-code",
      method: "post",
      data
    })
      .then(res => res)
      .catch(err => err);
  },
  // 创建配置信息
  setConfigByKey(data) {
    return ajax({
      url: "/admin/config",
      method: "post",
      data
    })
      .then(res => res)
      .catch(err => err);
  },
  // 更新配置信息
  putConfigByKey(data) {
    return ajax({
      url: "/admin/config",
      method: "put",
      data
    })
      .then(res => res)
      .catch(err => err);
  },
  // 根据key获取配置信息
  getConfigInfoByKey(data) {
    return ajax({
      url: "/admin/config/key",
      method: "get",
      params: data
    })
      .then(res => res)
      .catch(err => err);
  },
  // 根据appId获取配置信息
  getConfigInfoByAppId(data) {
    return ajax({
      url: "/admin/config/key/app",
      method: "get",
      params: data
    })
      .then(res => res)
      .catch(err => err);
  },
  // 创建配置信息通过appId
  setConfigByAppId(data) {
    return ajax({
      url: "/admin/config/app",
      method: "post",
      data
    })
      .then(res => res)
      .catch(err => err);
  }
};
