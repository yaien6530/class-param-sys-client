<template>
    <div class="login-container">
        <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            autocomplete="on"
            label-position="left"
        >
            <div class="title-container">
                <h3 class="title">yaien的个人技术站点</h3>
            </div>

            <el-form-item prop="account">
                <span class="svg-container">
                    <svg-icon icon-class="user"/>
                </span>
                <el-input
                    ref="account"
                    v-model="loginForm.account"
                    placeholder="登录账号"
                    name="account"
                    type="text"
                    tabindex="1"
                    autocomplete="on"
                />
            </el-form-item>

            <el-tooltip
                v-model="capsTooltip"
                content="Caps lock is On"
                placement="right"
                manual
            >
                <el-form-item prop="password">
                    <span class="svg-container">
                        <svg-icon icon-class="password"/>
                    </span>
                    <el-input
                        :key="passwordType"
                        ref="password"
                        v-model="loginForm.password"
                        :type="passwordType"
                        placeholder="密码"
                        name="password"
                        tabindex="2"
                        autocomplete="on"
                        @keyup.native="checkCapslock"
                        @blur="capsTooltip = false"
                        @keyup.enter.native="handleLogin"
                    />
                    <span class="show-pwd" @click="showPwd">
                        <svg-icon
                            :icon-class="
                                passwordType === 'password' ? 'eye' : 'eye-open'
                            "
                        />
                    </span>
                </el-form-item>
            </el-tooltip>

            <el-button
                :loading="loading"
                type="primary"
                style="width:100%;margin-bottom:30px;"
                @click.native.prevent="handleLogin"
            >登录
            </el-button>

            <div style="position:relative"/>
            <!-- <div class="edit-password-box">
                <el-button
                    type="text"
                    style="float: right"
                    @click="handleEditPassword"
                    >修改密码</el-button
                >
            </div> -->

        </el-form>

        <p style="background:none;height: 5%;position: fixed;bottom: 0px;width: 100%;text-align: center;">
            <img style="width: 20px; height: 20px;vertical-align: middle;" src="ICP.svg">
            <a
                class="banquan"
                style="color:#8F8F8F;"
                href="https://beian.miit.gov.cn/"
                target="_blank"
            >桂ICP备19011791号-1</a></p>
    </div>
</template>

<script>
import {validUsername} from '@/utils/validate';
import router, {constantRoutes} from '@/router';
import Layout from '@/layout';
import Router from 'vue-router';

export default {
    name: 'Login',
    data() {
        // 手机号验证
        const validateUsername = (rule, value, callback) => {
            const phoneReg = /^1[3|4|5|6|7|8][0-9]{9}$/;
            if (!value) {
                return callback(new Error('用户名不能为空'));
            }
            setTimeout(() => {
                if (!Number.isInteger(+value)) {
                    callback(new Error('请输入数字'));
                } else {
                    if (phoneReg.test(value)) {
                        callback();
                    } else {
                        callback(new Error('不是正确的手机号格式'));
                    }
                }
            }, 100);
        };
        const validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('密码不能少于6位'));
            } else {
                callback();
            }
        };
        return {
            loginForm: {
                account: '',
                password: ''
            },
            loginRules: {
                account: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请输入登录账号'
                    }
                ],
                password: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请输入登录密码'
                    }
                ]
            },
            passwordType: 'password',
            capsTooltip: false,
            loading: false,
            showDialog: false,
            redirect: undefined,
            otherQuery: {}
        };
    },
    watch: {
        $route: {
            handler: function (route) {
                const query = route.query;
                if (query) {
                    this.redirect = query.redirect;
                    this.otherQuery = this.getOtherQuery(query);
                }
            },
            immediate: true
        }
    },
    created() {
        // window.addEventListener('storage', this.afterQRScan)
    },
    mounted() {
        if (this.loginForm.account === '') {
            this.$refs.account.focus();
        } else if (this.loginForm.password === '') {
            this.$refs.password.focus();
        }
    },
    destroyed() {
        // window.removeEventListener('storage', this.afterQRScan)
    },
    methods: {
        checkCapslock({shiftKey, key} = {}) {
            if (key && key.length === 1) {
                if (
                    (shiftKey && key >= 'a' && key <= 'z') ||
                    (!shiftKey && key >= 'A' && key <= 'Z')
                ) {
                    this.capsTooltip = true;
                } else {
                    this.capsTooltip = false;
                }
            }
            if (key === 'CapsLock' && this.capsTooltip === true) {
                this.capsTooltip = false;
            }
        },
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = '';
            } else {
                this.passwordType = 'password';
            }
            this.$nextTick(() => {
                this.$refs.password.focus();
            });
        },
        // 登录
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.Api.login(this.loginForm)
                        .then(res => {
                            if (res.data.ret === 0) {
                                localStorage.setItem('token', res.data.data.token);
                                localStorage.setItem('level', res.data.data.level);
                                localStorage.setItem('app_id', res.data.data.app_id);
                                localStorage.setItem('shop_code', res.data.data.shop_code);
                                localStorage.setItem('shop_data', JSON.stringify(res.data.data));
                                const otherQuery = {
                                    isInit: true,
                                    ...this.otherQuery
                                };

                                this.getShopRoleMenu();
                            } else {
                                this.$message.error(res.data.msg || '登录失败');
                            }
                        })
                        .catch(err => {
                            this.$message.error('网络错误');
                        })
                        .finally(() => {
                            this.loading = false;
                        });
                } else {
                    // this.$message.error("账号名不合法或密码长度不对");
                    this.loading = false;
                }
            });
        },
        getShopRoleMenu() {
            this.Api.getAdminRolesMenu().then(res => {
                this.loading = false;
                console.log(res);
                if (res.data.ret === 0) {
                    localStorage.setItem('menu_list', JSON.stringify(res.data.data));
                    const level = localStorage.getItem('level') || 2;
                    if (level === 3) {
                        this.$router.push('/food/foodMerchantList');
                    } else {
                        this.$router.push('/home/home');
                    }
                }
            }).catch(err => {
                // this.loading = false;
                console.log(err);
            });
        },

        getOtherQuery(query) {
            return Object.keys(query).reduce((acc, cur) => {
                if (cur !== 'redirect') {
                    acc[cur] = query[cur];
                }
                return acc;
            }, {});
        },
        // 点击修改密码
        handleEditPassword() {
            this.$router.push('/editPassword');
        }
    }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
        color: $cursor;
    }
}

.bg-purple {
    background: #d3dce6;
}

.bg-purple-light {
    background: #e5e9f2;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

/* reset element-ui css */
.login-container {
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;

        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $light_gray;
            height: 47px;
            caret-color: $cursor;

            &:-webkit-autofill {
                box-shadow: 0 0 0px 1000px $bg inset !important;
                -webkit-text-fill-color: $cursor !important;
            }
        }
    }

    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 160px 35px 0;
        margin: 0 auto;
        overflow: hidden;
    }

    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }

    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }

    .title-container {
        position: relative;

        .title {
            font-size: 26px;
            color: $light_gray;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
    }

    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }

    .thirdparty-button {
        position: absolute;
        right: 0;
        bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
        .thirdparty-button {
            display: none;
        }
    }
}
</style>
