<template>
    <div class="dashboard-container">
        <component :is="currentRole" />
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import adminDashboard from './admin';
    import editorDashboard from './editor';
    import layout from '@/layout';

    const Layout = layout;

    export default {
        name: 'Dashboard',
        components: { adminDashboard, editorDashboard },
        data() {
            return {
                currentRole: 'adminDashboard'
            };
        },
        computed: {
            ...mapGetters([
                'roles'
            ])
        },
        created() {
            if (!this.roles.includes('admin')) {
                // this.currentRole = 'editorDashboard';
            }
            this.init();
        },
        methods: {
            init() {
                var a = '() => import(\'@/views/order/orderRefund\')';
                var b = eval(a);
                var c = 'Layout';
                var d = eval(c);
                console.log('看下1', typeof b);
                console.log('看下2', typeof d);
                this.getRoutes();
            },
            getRoutes() {
                // 请求数据，获取路由表
                // const res = await getRoutes()
                // this.serviceRoutes = res.data
                //  路由表
                // this.permission = this.generateRoutes(res.data)
                const roleList = [];
                roleList.forEach(item => {
                    if (item.children.length > 1) {
                        item.title = item.meta.title;
                        item.children.forEach(option => {
                            option.title = option.meta.title;
                        });
                    } else {
                        item.title = item.children[0].meta.title;
                        item.children = [];
                    }
                });
                console.log('初始化路由表', roleList);
                localStorage.setItem('routerList', JSON.stringify(roleList));
                // router.beforeEach(async(to, from, next) => {
                //     router.addRoutes(accessRoutes)
                // })
                this.serviceRoutes = roleList;
                this.permission = roleList;
            }
        }
    };
</script>
