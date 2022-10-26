export function commonAppId() {
    return localStorage.getItem("app_id");
}

// 有直播功能的appid
export const appIdList = [];

export const baseUrl = "https://m.yglandroid.com";
export const baseUploadUrl = "https://m.yglandroid.com/upload_image";
export const baseUploadShopUrl = "https://m.yglandroid.com/image-qiniu-api/upload/admin";
export const baseImgUrl = "https://m.yglandroid.com/get_image/";
export const baseUpload = "https://m.yglandroid.com/video-qiniu-api/upload/admin"; // 后台上传视频
export const baseAudioUrl = "https://m.yglandroid.com/audio-qiniu-api/upload/admin"; // 后台上传视频
