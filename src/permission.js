import router from './router';

// console.log("router：", constantRoutes);
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';

NProgress.configure({
    showSpinner: false
}); // NProgress Configuration

const whiteList = ['/login', '/auth-redirect', '/401', '/404', '/editPassword']; // no redirect whitelist

router.beforeEach(async(to, from, next) => {
    // console.log("路由拦截", to, from, next);
    // start progress bar
    NProgress.start();

    // set page title
    document.title = getPageTitle(to.meta.title);

    // determine whether the user has logged in
    const hasToken = getToken();

    if (hasToken) {
        if (to.path === '/login') {
            // if is logged in, redirect to the home page
            next({
                path: '/'
            });
            NProgress.done();
            // console.log("走1111");
        } else {
            let hasRoles = false;
            // let hasRoles = true;

            const menu_list = JSON.parse(localStorage.getItem('menu_list')) || [];
            // console.log("走2menu_list", menu_list);
            // for (let i = 0; i < menu_list.length; i++) {
            //     if (menu_list[i].list) {
            //         for (let j = 0; j < menu_list[i].list.length; j++) {
            //             const element = menu_list[i].list[j];
            //             if (
            //                 "/" +
            //                     menu_list[i].menu_url +
            //                     "/" +
            //                     element.menu_url ==
            //                 to.path
            //             ) {
            //                 hasRoles = true;
            //                 break;
            //             }
            //         }
            //     }
            // }

            menu_list.forEach((item) => {
                if (item.list) {
                    item.list.forEach((option) => {
                        if ('/' + item.menu_url + '/' + option.menu_url === to.path) {
                            hasRoles = true;
                        }
                    });
                }
            });

            // if (to.path === '/loginSelectShop' || menu_list.length === 0) {
            //     hasRoles = trxrue;
            // }
            if (hasRoles) {
                next();
            } else {
                Message.error('您没有该权限');
                // try {
                //     const accessRoutes = constantRoutes;
                //     console.log("走4444");
                //     router.addRoutes(accessRoutes);
                //     next({ ...to, replace: true });
                // } catch (error) {
                //     console.log("走5555");
                //     console.log("无hasRoles & 执行catch");
                //     localStorage.removeItem("token");
                //     localStorage.removeItem("shop_info");
                //     localStorage.removeItem("shop_list");
                //     localStorage.removeItem("routerList");
                //     // remove token and go to login page to re-login
                //     // await store.dispatch('user/resetToken');
                //     Message.error(error || "Has Error");
                //     next(`/login?redirect=${to.path}`);
                //     NProgress.done();
                // }
                localStorage.removeItem('token');
                localStorage.removeItem('CoreframeToken');
                localStorage.removeItem('shop_info');
                localStorage.removeItem('shop_list');
                localStorage.removeItem('menu_list');
                localStorage.removeItem('app_id');
                // next(`/login?redirect=${to.path}`);
                next(`/login`);
                NProgress.done();
            }
        }
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next();
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            // next(`/login?redirect=${to.path}`);
            next(`/login`);
            NProgress.done();
        }
    }
});

router.afterEach(() => {
    // finish progress bar
    NProgress.done();
});
