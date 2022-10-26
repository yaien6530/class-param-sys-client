<template>
    <div :class="{ 'has-logo': showLogo }">
        <logo v-if="showLogo" :collapse="isCollapse" />
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu
                :default-active="activeMenu"
                :collapse="isCollapse"
                background-color="#2C2F42"
                :text-color="variables.menuText"
                :unique-opened="false"
                :active-text-color="variables.menuActiveText"
                :collapse-transition="false"
                mode="vertical"
            >
                <sidebar-item
                    v-for="route in constantRoutes"
                    :key="route.path"
                    :item="route"
                    :base-path="route.path"
                />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";
import router, { constantRoutes } from "@/router";
import Layout from "@/layout";

export default {
    components: { SidebarItem, Logo },
    data() {
        return {
            constantRoutes: []
        };
    },
    created() {
        this.init();
    },
    mounted() {
        // // 不管路由
        // this.constantRoutes = constantRoutes;
        // return;

        // 新的 start
        // this.constantRoutes = constantRoutes;
        const menu_list = JSON.parse(localStorage.getItem("menu_list"));
        menu_list.map(item => {
            if (item.used_flag && item.list && item.list.length) {
                Object.assign(item, {
                    component: Layout
                });
                item.redirect = `/${item.menu_url}/${item.list[0].menu_url}`;
                item.children = item.list;
                item.children.map(vo => {
                    item.component = () =>
                        import(`@/views/${item.menu_url}/${vo.menu_url}`);
                    vo.path = vo.menu_url;
                    vo.name = vo.menu_url;
                    vo.meta = {
                        title: vo.menu_name,
                        icon: vo.icon
                    };
                });
            } else if (item.used_flag) {
                item.component = () =>
                    import("@/views" + `${"/" + item.menu_url}`);
            } else {
                item = {};
            }
            item.path = "/" + item.menu_url;
            item.alwaysShow = true;
            item.meta = {
                title: item.menu_name,
                icon: "excel"
            };
        });
        this.constantRoutes = menu_list;
        this.constantRoutes = menu_list.map(item => {
            item.hidden = item.hidden || !item.used_flag;
            item.list = item.list.map(subitem => {
                subitem.hidden = subitem.hidden || !subitem.used_flag;
                return subitem;
            });
            return item;
        });
        // this.addRouteData();
        return;

        // 旧的 start
        const data = JSON.parse(localStorage.getItem("menu_list"));
        console.log("看看请求的路由", data);
        data.forEach(item => {
            Object.assign(item, {
                component: Layout
            });
            if (item.children) {
                item.path = item.menu_route;
                item.redirect = "/" + item.children[0].menu_route;
                if (item.hidden) {
                    item.hidden = true;
                } else {
                    item.hidden = false;
                }
                item.meta = {
                    icon: item.icon || "excel",
                    title: item.menu_name
                };

                if (item.children) {
                    item.children.forEach(option => {
                        option.component = () =>
                            import("@/views" + `${"/" + option.menu_route}`);
                        option.path = option.menu_route.split("/")[1];
                        option.name =
                            option.menu_route
                                .split("/")[1]
                                .slice(0, 1)
                                .toUpperCase() +
                            option.menu_route.split("/")[1].slice(1);
                        option.meta = {
                            title: option.menu_name
                        };
                        if (option.hidden) {
                            option.hidden = true;
                        } else {
                            option.hidden = false;
                        }
                        delete option.children;
                    });
                }
            }
        });

        this.constantRoutes = data;
        return;

        // this.constantRoutes = constantRoutes;

        // this.$router.addRoutes(data); //动态添加路由

        // router.addRoutes(data);
    },
    methods: {
        init() {},
    },
    computed: {
        ...mapGetters(["permission_routes", "sidebar"]),
        activeMenu() {
            const route = this.$route;
            const { meta, path } = route;
            // if set path, the sidebar will highlight the path you set
            if (meta.activeMenu) {
                return meta.activeMenu;
            }
            return path;
        },
        showLogo() {
            return this.$store.state.settings.sidebarLogo;
        },
        variables() {
            return variables;
        },
        isCollapse() {
            return !this.sidebar.opened;
        }
    }
};
</script>
