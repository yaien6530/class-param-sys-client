// 登录验证相关接口
import ajax from "@/assets/ajax";

export default {
    // 获取手机验证码
    getPhoneCode(params) {
        return ajax({
            url: "/app/auth-code",
            params
        })
            .then(res => res)
            .catch(err => err);
    },
    // 获取登录验证码
    getPageCode(params) {
        return ajax({
            url: "/app/captcha",
            params
        })
            .then(res => res)
            .catch(err => err);
    },
    // 用户登录
    login(data) {
        return ajax({
            url: "/admin/login",
            method: "post",
            data
        })
            .then(res => res)
            .catch(err => err);
    },
    // 退出登录
    logout(params) {
        return ajax({
            url: "/admin/sign-out",
            method: "get",
            params
        })
            .then(res => res)
            .catch(err => err);
    },
    // 获取店铺shop_code
    userLoginShop(params) {
        return ajax({
            url: "/login/shop_code",
            params
        })
            .then(res => res)
            .catch(err => err);
    },
    testRequest(params) {
        return ajax({
            url:
                "/api/yuewan/getAppointInfList?orgId=20000&appointId=&shopId=0&scripType=100&isFull=0&status=0&rank=0",
            params
        })
            .then(res => res)
            .catch(err => err);
    },
    // 退出登录
    editPassword(data) {
        return ajax({
            url: "/admin/pwd",
            method: "put",
            data
        })
            .then(res => res)
            .catch(err => err);
    }
};
