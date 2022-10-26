/**
 * @module wx-page-url
 * @author: xing
 * @description: xing是一位handsome boy
 * @since: 创建时间  2020-04-28 14:15:52
 */

// 根据权限屏蔽掉没有权限的小程序路由
const permissions = JSON.parse(localStorage.getItem("permissions"));
const weChatLinkData = [
  {
    page_name: "不跳转页面", //页面名称
    params: "", //路径参数
    url: "" //路径
  },
  {
    page_name: "首页", //页面名称
    params: "", //路径参数
    url: "/pages/indexModule/index/index" //路径
  },
  {
    page_name: "商品分类", //页面名称
    params: "", //路径参数
    url: "/pages/category/category/category" //路径
  },
  {
    page_name: "购物车",
    params: "", //路径参数
    url: "/pages/cart/cart"
  },
  {
    page_name: "个人中心",
    params: "", //路径参数
    url: "/pages/personalModule/personal/personal"
  },
  {
    page_name: "商品详情",
    params: "", //路径参数
    url: "/pages/category/goodsDetail/goodsDetail"
  },
  // {
  //   page_name: "商品列表",
  //   params: "", //路径参数
  //   url: "/pages/category/searchGoods/searchGoods"
  // },
];

export default weChatLinkData;
