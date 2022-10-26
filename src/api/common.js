// 公共接口接口
import ajax from "@/assets/ajax";

export default {
        // 批量删除/修改图片（含店铺）
        delectImageByShop(data) {
            return ajax({
                url: "/image-qiniu-api/image/batch",
                method: "delete",
                data
            })
                .then(res => res)
                .catch(err => err);
        },
    
        // 通过image_group_id获取图片列表（含店铺）
        getImageListByGroup(params) {
            return ajax({
                url: "/image-qiniu-api/images",
                params
            })
                .then(res => res)
                .catch(err => err);
        },
    
        // 图片批量分组/批量修改分组（含店铺）
        changeImageGroup(data) {
            return ajax({
                url: "/image-qiniu-api/change_image_group",
                method: "put",
                data
            })
                .then(res => res)
                .catch(err => err);
        },
    
        // 获取图片分组列表（含店铺）
        getImageGroupList(params) {
            return ajax({
                url: "/image-qiniu-api/image_groups",
                params
            })
                .then(res => res)
                .catch(err => err);
        },
    
        // 新建图片分组
        createImageGroup(data) {
            return ajax({
                url: "/image-qiniu-api/image_group",
                method: "post",
                data
            })
                .then(res => res)
                .catch(err => err);
        },
    
        // 修改图片分组名称
        updateImageGroup(data) {
            return ajax({
                url: "/image-qiniu-api/image_group",
                method: "put",
                data
            })
                .then(res => res)
                .catch(err => err);
        },
    
        // 获取单个图片分组详情
        getImgGroupDetail(params) {
            return ajax({
                url: "/image-qiniu-api/image_group/image_group_id",
                params
            })
                .then(res => res)
                .catch(err => err);
        },
    
        // 删除图片分组
        delectImgGroup(params) {
            return ajax({
                url: "/image-qiniu-api/image_group",
                method: "delete",
                params
            })
                .then(res => res)
                .catch(err => err);
        },
    
        // 获取拼团商品列表（商品选择弹框）
        getGroupBuyProductList(data) {
            return ajax({
                url: "/admin/shoppinggroup/query_shopping_group_products",
                method: "post",
                data
            })
                .then(res => res)
                .catch(err => err);
        },
    
        // 后台上传视频
        uploadVideoAdmin(data) {
            return ajax({
                url: "/video-qiniu-api/upload/admin",
                method: "post",
                data
            })
                .then(res => res)
                .catch(err => err);
        },
        // 删除视频
        delVideoAdmin(params) {
            return ajax({
                url: "/video-qiniu-api/video",
                method: "delete",
                params
            })
                .then(res => res)
                .catch(err => err);
        },
        // 获取视频列表
        getVideoList(params) {
            return ajax({
                url: "/video-qiniu-api/video/list",
                method: "get",
                params
            })
                .then(res => res)
                .catch(err => err);
        },
        // 后台上传音频
        uploadAudioAdmin(data) {
            return ajax({
                url: "/audio-qiniu-api/upload/admin",
                method: "post",
                data
            })
                .then(res => res)
                .catch(err => err);
        },
        // 删除音频
        delAudioAdmin(params) {
            return ajax({
                url: "/audio-qiniu-api/audio",
                method: "delete",
                params
            })
                .then(res => res)
                .catch(err => err);
        },
        // 获取音频列表
        getAudioList(params) {
            return ajax({
                url: "/audio-qiniu-api/audio/list",
                method: "get",
                params
            })
                .then(res => res)
                .catch(err => err);
        },
        
};
