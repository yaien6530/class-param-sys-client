
import ajax from '@/assets/ajax';

export default {
  // 美食商家信息列表
  getGourmetMerchantList(params) {
    return ajax({
      url: '/admin/gourmet_merchant/get_list',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },
  // 获取美食商家信息详情
  getGourmetMerchantDetail(params) {
    return ajax({
      url: '/admin/gourmet_merchant/get_detail',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },
  // 添加/修改美食商家信息
  createOrChangeGourmetMerchant(data) {
    return ajax({
      url: '/admin/gourmet_merchant/create_or_change',
      method: 'post',
      data
    }).then(res => res).catch(err => err);
  },
  // 修改美食商家状态
  changeGourmetMerchantStatus(params) {
    return ajax({
      url: '/admin/gourmet_merchant/change_status',
      method: 'post',
      params
    }).then(res => res).catch(err => err);
  },


  // 商家评论信息列表
  getGourmetMerchantCommentList(params) {
    return ajax({
      url: '/admin/gourmet_merchant/get_comment_list',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },
  // 删除评论
  deleteGourmetMerchantComment(params) {
    return ajax({
      url: '/admin/gourmet_merchant/delete_comment',
      method: 'post',
      params
    }).then(res => res).catch(err => err);
  },


  // 美食推文信息列表
  getGourmetTweetsList(params) {
    return ajax({
      url: '/admin/gourmet_tweets/get_list',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },
  // 获取美食推文信息详情
  getGourmetTweetsDetail(params) {
    return ajax({
      url: '/admin/gourmet_tweets/get_detail',
      method: 'get',
      params
    }).then(res => res).catch(err => err);
  },
  // 添加/修改美食推文信息
  createOrChangeGourmetTweets(data) {
    return ajax({
      url: '/admin/gourmet_tweets/create_or_change',
      method: 'post',
      data
    }).then(res => res).catch(err => err);
  },
  // 修改美食推文状态
  changeGourmetTweetsStatus(params) {
    return ajax({
      url: '/admin/gourmet_tweets/change_status',
      method: 'post',
      params
    }).then(res => res).catch(err => err);
  },

    
};
