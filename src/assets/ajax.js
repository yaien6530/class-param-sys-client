import axios from "axios";
// import { createRouter } from '@/router/index'
import createRouter from "@/router/index";
import { baseUrl } from "@/assets/config";

const router = createRouter;

const { CancelToken } = axios;

const ajax = axios.create({
    baseURL: baseUrl,
    timeout: 120000
});

// http request 请求拦截器
ajax.interceptors.request.use(
    config => {
        if (config.host) {
            config.baseURL = config.host;
        }
        // 发送请求之前执行内容
        var pathname = location.pathname;
        if (localStorage.getItem("token")) {
            //localStorage.getItem("token")
            if (pathname != "/login") {
                if (localStorage.getItem("shop_data")) {
                    config.headers.common["shop_code"] = JSON.parse(
                        localStorage.getItem("shop_data")
                    ).shop_code;
                    config.headers.common["app_id"] = localStorage.getItem(
                        "app_id"
                    );
                } else {
                    //测试用,后期删掉
                    // config.headers.common['shop_code'] = 'shop_code'
                }
                config.headers.common["token"] = localStorage.getItem("token");
            } else {
            }
        } else {
            if (pathname != "/" || config.url != "/admin/pwd") {
                localStorage.removeItem("token");
                router.push({
                    path: "/login"
                    //登录成功后跳入浏览的当前页面
                    // query: {redirect: router.currentRoute.fullPath}
                });
            }
        }
        return config;
    },
    error => {
        // 请求错误执行内容
        console.log("请求拦截器错误：", error);
        return Promise.reject(error);
    }
);

// http response 响应拦截器
ajax.interceptors.response.use(
    response => {
        //如果登录token失效或未登录，清除token和userid信息；
        if (response.status == 200 && response.data.ret == 1) {
            console.log("未登录", response.data);
            if (localStorage.getItem("token")) {
                localStorage.removeItem("token");
                localStorage.removeItem("CoreframeToken");
            }
            router.push({
                path: "/login"
                //登录成功后跳入浏览的当前页面
                // query: {redirect: router.currentRoute.fullPath}
            });
        } else if (response.status != 200) {
            // 返回接口返回的错误信息
            return Promise.reject(response);
        }
        return response;
    },
    error => {
        console.log("请求响应error", error);
        if (error.response) {
            switch (error.response.status) {
                // 返回401，清除token信息并跳转到登录页面
                case 401:
                    if (localStorage.getItem("token")) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("CoreframeToken");
                    }
            }
            // 返回接口返回的错误信息
            return Promise.reject(error);
        }
    }
);

var count = 0;
export default function(config) {
    // 计数器
    count++;
    // 取消令牌
    var cancel;
    const cancelToken = new CancelToken(fun => {
        cancel = fun;
        if (config.getCancel) {
            config.getCancel(count, cancel);
        }
    });
    // 返回封装后的 ajax 对象
    return ajax({
        validateStatus: status => status >= 200 && status < 600,
        id: count,
        cancelToken,
        cancel,
        ...config
    });
}
