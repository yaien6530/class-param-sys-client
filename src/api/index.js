// 登录验证相关接口
import login from "./login";
// 通用设置相关接口
import setting from "./setting";
// 角色相关接口
import roles from "./roles";
// 用户相关接口
import users from "./users";
// 公共接口
import common from "./common";
// 统计相关接口
import statistics from "./statistics";
// 评论相关接口
import comment from "./comment";
// 消息订阅相关接口
import subscribe from "./subscribe";
// 换购订单相关接口
import customer from "./customer";
// 登录弹窗相关接口
import loginPopup from "./loginPopup";
// 数据分析相关接口
import dataAnalysis from "./dataAnalysis";

// 首页简介接口
import home from "./home";
// 账号接口
import admin from "./admin";
// 景点接口
import attraction from "./attraction";
// 路线接口
import routeLine from "./routeLine";
// 推荐接口
import recommend from "./recommend";
// 美食接口
import food from "./food";
// 住宿接口
import housing from "./housing";
// 商品接口
import commodity from "./commodity";
// 厨师接口
import chef from "./chef";


export default {
    ...login,
    ...setting,
    ...roles,
    ...users,
    ...common,
    ...statistics,
    ...comment,
    ...subscribe,
    ...customer,
    ...loginPopup,
    

    ...home,
    ...admin,
    ...attraction,
    ...routeLine,
    ...recommend,
    ...dataAnalysis,
    ...food,
    ...housing,
    ...commodity,
    ...chef
};
