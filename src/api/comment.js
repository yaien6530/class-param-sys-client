
import ajax from '@/assets/ajax';

export default {
    // 获取评论列表
    getCommentList(params) {
      return ajax({
          url: '/admin/sku-api/comments',
          method: 'GET',
          params
      }).then(res => res).catch(err => err);
    },
    // 删除商品评论
    delComment(params) {
      return ajax({
          url: '/admin/sku-api/comment',
          method: 'delete',
          params
      }).then(res => res).catch(err => err);
    },

    
    // 获取评价标签列表
    getCommentTagList(params) {
      return ajax({
          url: '/admin/sku-api/labels/comment',
          method: 'get',
          params
      }).then(res => res).catch(err => err);
    },
    // 新增评价标签
    addCommentTagList(data) {
      return ajax({
          url: '/admin/sku-api/label',
          method: 'post',
          data
      }).then(res => res).catch(err => err);
    },
    // 编辑评价标签
    editCommentTagList(data) {
      return ajax({
          url: '/admin/sku-api/label',
          method: 'put',
          data
      }).then(res => res).catch(err => err);
    },
    // 删除评价标签
    delCommentTagList(params) {
      return ajax({
          url: '/admin/sku-api/label',
          method: 'delete',
          params
      }).then(res => res).catch(err => err);
    },

    
};
