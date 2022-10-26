// 用户相关接口
import ajax from "@/assets/ajax";

export default {
    // 获取用户列表
    getUserList(params) {
        return ajax({
            url: "/admin/user/get_user_list",
            params
        })
            .then(res => res)
            .catch(err => err);
    },
};
