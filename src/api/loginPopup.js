// 商品管理相关接口
import ajax from '@/assets/ajax';

export default {
    // 获取登录礼包弹窗配置
    getLoginGift(params) {
      return ajax({
          url: '/admin/login-gift-api/login_gift',
          method: 'get',
          params
      }).then(res => res).catch(err => err);
    },
    // 修改登录礼包弹窗配置
    setLoginGift(data) {
        return ajax({
            url: '/admin/login-gift-api/login_gift',
            method: 'post',
            data
        }).then(res => res).catch(err => err);
    },
};
