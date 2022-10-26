// 售后相关接口
import ajax from "@/assets/ajax";

export default {
  // 获取售后订单列表
  getAfterOrderList(data, params) {
    return ajax({
      url: `/admin/after-sale-api/order_list/after_sale`,
      method: "post",
      data,
      params
    })
      .then(res => res)
      .catch(err => err);
  },
  // 获取售后订单列表v2
  getAfterOrderListV2(data) {
    return ajax({
      url: `/admin/after-sale-api/order_list/after_sale/v2`,
      method: "post",
      data
    })
      .then(res => res)
      .catch(err => err);
  },
  // 获取售后订单详情
  getAfterOrderDetail(params) {
    return ajax({
      url: "/admin/after-sale-api/order/after_sale\n",
      params
    })
      .then(res => res)
      .catch(err => err);
  },
  // 售后审核,拒绝通过
  afterOrderRefused(data) {
    return ajax({
      url: `/admin/after-sale-api/after_sale/refused?remark=${
        data.remark
      }&order_after_sale_code=${data.order_after_sale_code}`,
      method: "put"
    })
      .then(res => res)
      .catch(err => err);
  },
  // 售后审核,审核通过
  afterOrderPass(data) {
    return ajax({
      url: `/admin/after-sale-api/after_sale/pass?remark=${
        data.remark
      }&order_after_sale_code=${data.order_after_sale_code}`,
      method: "put"
    })
      .then(res => res)
      .catch(err => err);
  },
  // 商家收到退回商品
  getAfterSaleReceive(params) {
    return ajax({
      url: "/admin/after-sale-api/after_sale/admin_receive",
      params
    })
      .then(res => res)
      .catch(err => err);
  },
  // 售后后台退款
  afterSaleRefund(data) {
    return ajax({
      url: `/admin/after-sale-api/after_sale/refund?order_after_sale_code=${
        data.order_after_sale_code
      }`,
      method: "put"
    })
      .then(res => res)
      .catch(err => err);
  },
  // 售后重新发货
  orderAfterShipment(data) {
    return ajax({
      url: "/admin/after-sale-api/after_order/reship",
      method: "post",
      data
    })
      .then(res => res)
      .catch(err => err);
  },
  // 售后补发商品
  orderAfterReissue(data) {
    return ajax({
      url: "/admin/after-sale-api/after_order/reissue",
      method: "post",
      data
    })
      .then(res => res)
      .catch(err => err);
  },
  // 获取售后原因列表
  getAfterSaleReason(params) {
    return ajax({
      url: "/admin/after-sale-api/reasons",
      params
    })
      .then(res => res)
      .catch(err => err);
  },
  // 修改售后原因
  updataAfterSaleReason(data) {
    return ajax({
      url: "/admin/after-sale-api/reason",
      method: "put",
      data
    })
      .then(res => res)
      .catch(err => err);
  },
  // 创建售后原因
  createAfterSaleReason(data) {
    return ajax({
      url: "/admin/after-sale-api/reason",
      method: "post",
      data
    })
      .then(res => res)
      .catch(err => err);
  },
  // 删除售后原因
  delAfterSaleReason(params) {
    return ajax({
      url: "/admin/after-sale-api/reason",
      method: "delete",
      params
    })
      .then(res => res)
      .catch(err => err);
  },
  // 修改订单物流信息
  changeOrderDeliver(data) {
    return ajax({
      url: "/admin/order-api/order/delivery",
      method: "put",
      data
    })
      .then(res => res)
      .catch(err => err);
  },
  // 导出售后订单列表
  exportAfterSaleOrders(data) {
    return ajax({
      url: "/admin/after-sale-api/export_after_sale_orders",
      method: "post",
      responseType: "blob",
      data
    })
      .then(res => res)
      .catch(err => err);
  },
  // 修改售后订单收货信息
  changeAfterUserAddress(data) {
    return ajax({
      url: "/admin/after-sale-api/after_sale_order/user_address",
      method: "put",
      data
    })
      .then(res => res)
      .catch(err => err);
  }
};
