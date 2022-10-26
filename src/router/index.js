import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/editPassword',
        name: 'EditPassword',
        component: () => import('@/views/login/editPassword'),
        hidden: true
    },
    {
        path: '/dataAnalysis',
        component: Layout,
        redirect: '/dataAnalysis/wechatAnalysis',
        alwaysShow: true,
        meta: {
            title: '数据分析',
            icon: 'dataAnalysis'
        },
        children: [
            {
                path: 'wechatAnalysis',
                component: () => import('@/views/dataAnalysis/wechatAnalysis'),
                name: 'OverallAnalysis',
                meta: {
                    title: '小程序分析'
                }
            },
            {
                path: 'attractionsAnalysis',
                component: () => import('@/views/dataAnalysis/attractionsAnalysis'),
                name: 'OverallAnalysis',
                meta: {
                    title: '景点分析'
                }
            }
        ]
    },
    {
        path: '/home',
        component: Layout,
        redirect: '/home/home',
        meta: {
            title: '首页',
            icon: 'customer'
        },
        children: [
            {
                path: 'home',
                component: () => import('@/views/home/home'),
                name: 'Home',
                meta: {
                    title: '轮播图配置'
                }
            },
            {
                path: 'poster',
                component: () => import('@/views/home/poster'),
                name: 'Poster',
                meta: {
                    title: '海报图配置'
                }
            },
            {
                path: 'noticeSet',
                component: () => import('@/views/home/noticeSet'),
                name: 'NoticeSet',
                meta: {
                    title: '公告配置'
                }
            }
        ]
    },
    {
        path: '/food',
        component: Layout,
        redirect: '/food/foodMerchantList',
        alwaysShow: true,
        meta: {
            title: '餐饮预定',
            icon: 'customer'
        },
        children: [
            {
                path: 'foodMerchantList',
                component: () => import('@/views/food/foodMerchantList'),
                name: 'FoodMerchantList',
                meta: {
                    title: '美食商家列表'
                }
            },
            {
                path: 'foodMerchantEdit',
                component: () => import('@/views/food/foodMerchantEdit'),
                name: 'FoodMerchantEdit',
                meta: {
                    title: '美食商家编辑'
                },
                hidden: true
            },
            {
                path: 'foodCommentList',
                component: () => import('@/views/food/foodCommentList'),
                name: 'FoodCommentList',
                meta: {
                    title: '商家评论列表'
                }
            },
            {
                path: 'foodTweetsList',
                component: () => import('@/views/food/foodTweetsList'),
                name: 'FoodTweetsList',
                meta: {
                    title: '美食推文列表'
                }
            },
            {
                path: 'foodTweetsEdit',
                component: () => import('@/views/food/foodTweetsEdit'),
                name: 'FoodTweetsEdit',
                meta: {
                    title: '美食推文编辑'
                },
                hidden: true
            },
            {
                path: 'chefList',
                component: () => import('@/views/food/chefList'),
                name: 'ChefList',
                meta: {
                    title: '厨师列表'
                }
            },
            {
                path: 'chefEdit',
                component: () => import('@/views/food/chefEdit'),
                name: 'ChefEdit',
                meta: {
                    title: '厨师编辑'
                },
                hidden: true
            }
        ]
    },
    {
        path: '/housing',
        component: Layout,
        redirect: '/housing/housingList',
        alwaysShow: true,
        meta: {
            title: '民宿预定',
            icon: 'customer'
        },
        children: [
            {
                path: 'housingList',
                component: () => import('@/views/housing/housingList'),
                name: 'HousingList',
                meta: {
                    title: '民宿列表'
                }
            },
            {
                path: 'housingEdit',
                component: () => import('@/views/housing/housingEdit'),
                name: 'HousingEdit',
                meta: {
                    title: '民宿编辑'
                },
                hidden: true
            },
            {
                path: 'housingCommentList',
                component: () => import('@/views/housing/housingCommentList'),
                name: 'HousingCommentList',
                meta: {
                    title: '民宿评论列表'
                }
            }
        ]
    },
    {
        path: '/commodity',
        component: Layout,
        redirect: '/commodity/commodityList',
        alwaysShow: true,
        meta: {
            title: '桂七特产',
            icon: 'customer'
        },
        children: [
            {
                path: 'commodityList',
                component: () => import('@/views/commodity/commodityList'),
                name: 'CommodityList',
                meta: {
                    title: '商品列表'
                }
            },
            {
                path: 'commodityEdit',
                component: () => import('@/views/commodity/commodityEdit'),
                name: 'CommodityEdit',
                meta: {
                    title: '商品编辑'
                },
                hidden: true
            }
        ]
    },
    {
        path: '/attraction',
        component: Layout,
        redirect: '/attraction/attractionList',
        alwaysShow: true,
        meta: {
            title: '景点管理',
            icon: 'customer'
        },
        children: [
            {
                path: 'mapSet',
                component: () => import('@/views/attraction/mapSet'),
                name: 'MapSet',
                meta: {
                    title: '地图配置'
                }
            },
            {
                path: 'coordinateSet',
                component: () => import('@/views/attraction/coordinateSet'),
                name: 'CoordinateSet',
                meta: {
                    title: '坐标配置'
                }
            },
            {
                path: 'attractionList',
                component: () => import('@/views/attraction/attractionList'),
                name: 'AttractionList',
                meta: {
                    title: '景点列表'
                }
            },
            {
                path: 'attractionEdit',
                component: () => import('@/views/attraction/attractionEdit'),
                name: 'AttractionEdit',
                meta: {
                    title: '景点编辑'
                },
                hidden: true
            },
            {
                path: 'sortList',
                component: () => import('@/views/attraction/sortList'),
                name: 'SortList',
                meta: {
                    title: '景点分类'
                }
            }

        ]
    },
    {
        path: '/routeLine',
        component: Layout,
        redirect: '/routeLine/routeList',
        // alwaysShow: true,
        meta: {
            title: '路线管理',
            icon: 'customer'
        },
        children: [
            {
                path: 'routeList',
                component: () => import('@/views/routeLine/routeList'),
                name: 'RouteList',
                meta: {
                    title: '路线管理'
                }
            },
            {
                path: 'routeEdit',
                component: () => import('@/views/routeLine/routeEdit'),
                name: 'RouteEdit',
                meta: {
                    title: '路线编辑'
                },
                hidden: true
            }
        ]
    },
    {
        path: '/recommend',
        component: Layout,
        redirect: '/recommend/recommendList',
        // alwaysShow: true,
        meta: {
            title: '达人推荐',
            icon: 'customer'
        },
        children: [
            {
                path: 'recommendList',
                component: () => import('@/views/recommend/recommendList'),
                name: 'RecommendList',
                meta: {
                    title: '达人推荐'
                }
            },
            {
                path: 'recommendEdit',
                component: () => import('@/views/recommend/recommendEdit'),
                name: 'RecommendEdit',
                meta: {
                    title: '编辑达人推荐'
                },
                hidden: true
            }
        ]
    },
    {
        path: '/permission',
        component: Layout,
        redirect: '/permission/accountList',
        alwaysShow: true,
        meta: {
            title: '账号管理',
            icon: 'customer'
        },
        children: [
            {
                path: 'accountList',
                component: () => import('@/views/permission/accountList'),
                name: 'accountList',
                meta: {
                    title: '账号列表'
                }
            },
            {
                path: 'roleList',
                component: () => import('@/views/permission/roleList'),
                name: 'RoleList',
                meta: {
                    title: '角色列表'
                }
            }
        ]
    },
    {
        path: '/user',
        component: Layout,
        redirect: '/user/userList',
        meta: {
            title: '用户管理',
            icon: 'customer'
        },
        children: [
            {
                path: 'userList',
                component: () => import('@/views/user/userList'),
                name: 'UserList',
                meta: {
                    title: '用户列表'
                }
            }
        ]
    }
];

export const asyncRoutes = [
    {
        path: '*',
        redirect: '/404',
        hidden: true
    }
];

const createRouter = () =>
    new Router({
        // mode: 'history', // require service support
        scrollBehavior: () => ({
            y: 0
        }),
        routes: constantRoutes
    });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher; // reset router
}

export default router;
