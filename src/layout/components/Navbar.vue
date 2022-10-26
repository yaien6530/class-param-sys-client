<template>
    <div class="navbar">
        <hamburger
            id="hamburger-container"
            :is-active="sidebar.opened"
            class="hamburger-container"
            @toggleClick="toggleSideBar"
        />

        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

        <div class="right-menu">
            <div
                v-if="new_order_list && new_order_list.length"
                class="reminder right-menu-item hover-effect"
                @click="handleNewOpenNotice"
            >
                <div class="flex-box">
                    <img
                        style="width: 32px;height: 32px;margin-right: 8px;"
                        :src="avatar"
                        alt=""
                    />
                    <p :class="{ show_notice: new_show_notice }">
                        您有新的订单
                    </p>
                </div>
            </div>

            <template v-if="device !== 'mobile'">
                <search id="header-search" class="right-menu-item" />

                <error-log
                    class="errLog-container right-menu-item hover-effect"
                />

                <screenfull
                    id="screenfull"
                    class="right-menu-item hover-effect"
                />

                <el-tooltip
                    content="Global Size"
                    effect="dark"
                    placement="bottom"
                >
                    <size-select
                        id="size-select"
                        class="right-menu-item hover-effect"
                    />
                </el-tooltip>
            </template>

            <el-dropdown
                class="avatar-container right-menu-item hover-effect"
                trigger="click"
            >
                <div class="avatar-wrapper">
                    <img
                        src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
                        class="user-avatar"
                    />
                    <i class="el-icon-caret-bottom" />
                    <span style="font-size: 14px;padding-left: 4px;"
                        >后台管理</span
                    >
                </div>
                <el-dropdown-menu slot="dropdown">
                    <router-link to="/">
                        <el-dropdown-item>首页</el-dropdown-item>
                    </router-link>
                    <el-dropdown-item divided>
                        <span style="display:block;" @click="logout"
                            >退出登录</span
                        >
                    </el-dropdown-item>
                    <!-- <el-dropdown-item divided>
            <span style="display:block;" @click="goSelectShop">切换门店</span>
          </el-dropdown-item> -->
                </el-dropdown-menu>
            </el-dropdown>
        </div>

        <!-- 新订单弹窗 -->
        <el-dialog
            title="查看新的订单"
            :visible.sync="new_open_flag"
            width="600px"
            top="8vh"
        >
            <el-table :data="new_order_list" style="width: 100%">
                <el-table-column
                    prop="order_code"
                    label="订单号"
                    min-width="180"
                    align="left"
                />
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            type="text"
                            @click="gotoNewOrder(scope.row.order_code)"
                            >去处理</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer" />
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import ErrorLog from "@/components/ErrorLog";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";

export default {
    components: {
        Breadcrumb,
        Hamburger,
        ErrorLog,
        Screenfull,
        SizeSelect,
        Search
    },
    data() {
        return {
            avatar:
                "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
            shop: {
                shop_name: "",
                shop_logo: "",
                shop_code: ""
            },
            new_open_flag: false,
            new_show_notice: false,
            new_order_list: [],
            ready: false,
            new_audio: null, // 音频播放
            aa: null // 轮询定时器
        };
    },
    mounted() {
        this.new_audio = new Audio();
        this.shop = {
            shop_name: localStorage.getItem("shop_name"),
            shop_logo: localStorage.getItem("shop_logo"),
            shop_code: localStorage.getItem("shop_code")
        };
        // this.getNewOrderNotice();
        // this.aa = setInterval(() => {
        //     this.getNewOrderNotice();
        // }, 12000);
        // setTimeout(() => {
        //     this.ready = true;
        // }, 1000);
    },
    computed: {
        ...mapGetters([
            "sidebar",
            // 'avatar',
            "device"
        ])
    },
    destroyed() {
        // clearInterval(this.aa);
    },

    methods: {
        toggleSideBar() {
            this.$store.dispatch("app/toggleSideBar");
        },
        logout() {
            // this.$store.dispatch('user/logout');
            this.$router.push(`/login?redirect=${this.$route.fullPath}`);
            // localStorage.removeItem('token');
            localStorage.clear();
            location.reload();
        },
        goSelectShop() {
            console.log("点击切换门店");
            this.$router.push("/loginSelectShop");
        },
        getNewOrderNotice() {
            this.Api.getNewOrderNotice().then(res => {
                if (res.data.ret === 0 && res.data.data) {
                    this.new_show_notice =
                        res.data.data.broadcast_flag || false;
                    this.new_order_list = res.data.data.pending_orders || [];
                    if (this.new_show_notice) {
                        this.playNewOrderNotice();
                        this.new_audio.src = require("@/assets/newOrder.mp3");
                        this.new_audio
                            .play()
                            .then(res => {})
                            .catch(err => {
                                console.log("来新订单被浏览器阻止");
                            });
                    }
                }
            });
        },
        playNewOrderNotice() {
            this.Api.playNewOrderNotice();
        },
        gotoNewOrder(order_code) {
            this.Api.handleNewOrderNotice({ order_code }).then(res => {
                console.log(res);
                if (res.data.ret === 0) {
                    this.$router.push({
                        path: "/order/orderDetail",
                        query: {
                            active_order: order_code
                        }
                    });
                    this.new_open_flag = false;
                    this.getNewOrderNotice();
                } else {
                    this.$message.error(res.data.msg || "操作失败！");
                }
            });
        },
        handleNewOpenNotice() {
            this.new_open_flag = true;
        }
    }
};
</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;
        margin-right: 30px;

        @keyframes shan {
            from {
                opacity: 1;
            }
            to {
                opacity: 0.2;
            }
        }
        .reminder {
            width: 160px;
            .flex-box {
                display: flex;
                align-content: center;
                align-items: center;
                p {
                    font-size: 14px;
                    color: #d78f00;
                    &.show_notice {
                        animation: shan 1s;
                        animation-direction: alternate;
                        animation-iteration-count: infinite;
                    }
                }
            }
        }

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                position: relative;
                display: flex;
                align-items: center;
                align-content: center;

                .user-avatar {
                    cursor: pointer;
                    width: 30px;
                    height: 30px;
                    border-radius: 4px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
