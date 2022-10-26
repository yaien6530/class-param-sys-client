/*
 * @Description:
 * @Version: 2.0
 * @Author: Xing
 * @Date: 2020-08-12 14:51:27
 * @LastEditors: Xing
 * @LastEditTime: 2021-02-02 19:44:40
 */
import Vue from 'vue';

import Cookies from 'js-cookie';

import 'normalize.css/normalize.css'; // a modern alternative to CSS resets

import Element from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import './styles/element-variables.scss';

import '@/styles/index.scss'; // global css

import App from './App';
import store from './store';
import router from './router';
import Echarts from 'echarts';

import './icons'; // icon
import './permission'; // permission control
import './utils/error-log'; // error log

import * as filters from './filters'; // global filters

import Moment from 'moment';

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock';
if (process.env.NODE_ENV === 'production') {
    mockXHR();
}

// 引入api接口列表
import Api from '@/api/index';
// 引入封装的全局方法
import Fun from '@/assets/global-methods';
// 引入图片公共路径
import {
    commonAppId,
    baseImgUrl,
    baseUrl,
    baseUploadUrl,
    baseUploadShopUrl,
    couponUrl,
    appIdList,
    baseUpload,
    baseAudioUrl
} from '@/assets/config';

Vue.prototype.Api = Api;
Vue.prototype.Fun = Fun; // 方法bbb
Vue.prototype.commonAppId = commonAppId(); // app_id(上传图片用到)
Vue.prototype.baseImgUrl = baseImgUrl; // 图片链接地址前缀
Vue.prototype.baseUploadUrl = baseUploadUrl; // 图片上传接口前缀
Vue.prototype.baseUploadShopUrl = baseUploadShopUrl; // 图片上传接口前缀(根据店铺上传)
Vue.prototype.baseUrl = baseUrl; // api请求地址前缀
Vue.prototype.couponUrl = couponUrl; // api请求地址前缀
Vue.prototype.baseUpload = baseUpload; // api请求地址前缀
Vue.prototype.baseAudioUrl = baseAudioUrl; // api请求地址前缀

Vue.prototype.$echarts = Echarts;
Vue.prototype.moment = Moment;
Vue.prototype.appIdList = appIdList;

Vue.use(Element, {
    size: Cookies.get('size') || 'medium' // set element-ui default size
});

// 引入图片预览组件
import ImgPreview from '@/components/imgPreview';

Vue.use(ImgPreview);

// register global utility filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;
Vue.config.devtools = true;

import { VueJsonp } from 'vue-jsonp';
Vue.use(VueJsonp); // 解决跨域

// Leaflet全局配置
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
Vue.use(L);

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
