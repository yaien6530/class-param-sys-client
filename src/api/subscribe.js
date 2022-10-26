/*
 * @Description:
 * @Version: 2.0
 * @Author: Xing
 * @Date: 2020-06-28 16:10:16
 * @LastEditors: Xing
 * @LastEditTime: 2020-06-30 13:47:51
 */

// 消息订阅相关接口
import ajax from "@/assets/ajax";

export default {
  // 配置信息模板参数
  setSubscribeTemplate(data) {
    return ajax({
      url: `/subscribe_template`,
      method: "post",
      data
    })
      .then(res => res)
      .catch(err => err);
  },
  // 更新信息模板参数
  updataSubscribeTemplate(data, params) {
    return ajax({
      url: `/subscribe_template`,
      method: "put",
      data
    })
      .then(res => res)
      .catch(err => err);
  },
  // 删除信息模板参数
  delSubscribeTemplate(params) {
    return ajax({
      url: `/subscribe_template`,
      method: "delete",
      params
    })
      .then(res => res)
      .catch(err => err);
  },
  // 获取信息模板列表
  getSubscribeTemplateList(data, params) {
    return ajax({
      url: `/subscribe_templates`,
      method: "get",
      data
    })
      .then(res => res)
      .catch(err => err);
  },
  // 获取信息模板样例
  getSubscribeTemplatesSample(params) {
    return ajax({
      url: `/subscribe_templates/Sample`,
      method: "get",
      params
    })
      .then(res => res)
      .catch(err => err);
  }
};
