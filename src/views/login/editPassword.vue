<template>
    <div class="edit-password-container">
        <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            autocomplete="off"
            label-position="left"
        >
            <div class="title-container">
                <h3 class="title">修改密码</h3>
            </div>

            <el-form-item prop="mobile">
                <span class="svg-container">
                    <svg-icon icon-class="user" />
                </span>
                <el-input
                    ref="mobile"
                    v-model="loginForm.mobile"
                    placeholder="登录账号"
                    name="mobile"
                    type="text"
                    tabindex="1"
                    autocomplete="off"
                />
            </el-form-item>

            <el-form-item prop="password">
                <span class="svg-container">
                    <svg-icon icon-class="password" />
                </span>
                <el-input
                    ref="password"
                    v-model="loginForm.password"
                    :type="passwordType"
                    placeholder="原来的密码"
                    autocomplete="off"
                    @blur="capsTooltip = false"
                />
                <!--<span class="show-pwd" @click.stop="showPwd">
                                    <svg-icon
                                        :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                                    />
                 </span>-->
            </el-form-item>
            <el-form-item prop="new_password">
                <span class="svg-container">
                    <svg-icon icon-class="password" />
                </span>
                <el-input
                    ref="new_password"
                    v-model="loginForm.new_password"
                    :type="new_passwordType"
                    placeholder="输入新的密码"
                    autocomplete="off"
                    @blur="new_capsTooltip = false"
                />
                <span class="show-pwd" @click.stop="newShowPwd">
                    <svg-icon
                        :icon-class="
                            new_passwordType === 'password' ? 'eye' : 'eye-open'
                        "
                    />
                </span>
            </el-form-item>
            <el-form-item prop="renew_password">
                <span class="svg-container">
                    <svg-icon icon-class="password" />
                </span>
                <el-input
                    ref="renew_password"
                    v-model="loginForm.renew_password"
                    :type="renew_passwordType"
                    placeholder="重复输入密码"
                    autocomplete="off"
                    @blur="renew_capsTooltip = false"
                />
                <span class="show-pwd" @click.stop="renewShowPwd">
                    <svg-icon
                        :icon-class="
                            renew_passwordType === 'password'
                                ? 'eye'
                                : 'eye-open'
                        "
                    />
                </span>
            </el-form-item>

            <el-button
                :disabled="sub_disable"
                :loading="loading"
                type="primary"
                plain
                style="width:80px;margin-bottom:30px;margin-top: 20px;"
                @click="handleBack"
                >返回
            </el-button>

            <el-button
                :disabled="sub_disable"
                :loading="loading"
                type="primary"
                style="width:350px;margin-bottom:30px;margin-top: 20px;margin-left: 15px;"
                @click="editPassword"
                >确认修改
            </el-button>

            <div style="position:relative" />
        </el-form>

        <el-dialog title="Or connect with" :visible.sync="showDialog">
            <br />
            <br />
            <br />
            <social-sign />
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "EditPassword",
    data() {
        // 手机号验证
        const validateUsername = (rule, value, callback) => {
            const phoneReg = /^1[3|4|5|6|7|8][0-9]{9}$/;
            if (!value) {
                return callback(new Error("用户名不能为空"));
            }
            setTimeout(() => {
                if (!Number.isInteger(+value)) {
                    callback(new Error("请输入数字"));
                } else {
                    if (phoneReg.test(value)) {
                        callback();
                    } else {
                        callback(new Error("不是正确的手机号格式"));
                    }
                }
            }, 100);
        };
        const validatePassword = (rule, value, callback) => {
            // console.log('旧密码校验：', value, rule);
            if (value.length < 6) {
                callback(new Error("密码格式不正确"));
            } else {
                callback();
            }
        };
        const newValidatePassword = (rule, value, callback) => {
            // console.log('新密码校验：', value, rule);
            if (value.length < 6) {
                callback(new Error("设置密码不能少于6位"));
            } else {
                callback();
            }
        };
        const renewValidatePassword = (rule, value, callback) => {
            console.log(
                "确认密码校验：",
                value,
                this._data.loginForm.renew_password,
                this
            );
            if (value !== this._data.loginForm.renew_password) {
                callback(new Error("两次输入密码不一致"));
            } else {
                callback();
            }
        };
        return {
            sub_disable: false,
            loginForm: {
                mobile: "",
                password: "",
                new_password: "",
                renew_password: ""
            },
            loginRules: {
                mobile: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请输入登录账号"
                    }
                ],
                password: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "请输入登录密码"
                    }
                ],
                new_password: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: newValidatePassword
                    }
                ],
                renew_password: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: renewValidatePassword
                    }
                ]
            },
            passwordType: "password",
            new_passwordType: "password",
            renew_passwordType: "password",
            capsTooltip: false,
            new_capsTooltip: false,
            renew_capsTooltip: false,
            loading: false,
            showDialog: false,
            redirect: undefined,
            otherQuery: {}
        };
    },
    methods: {
        checkCapslock({ shiftKey, key } = {}) {
            if (key && key.length === 1) {
                if (
                    (shiftKey && key >= "a" && key <= "z") ||
                    (!shiftKey && key >= "A" && key <= "Z")
                ) {
                    this.capsTooltip = true;
                } else {
                    this.capsTooltip = false;
                }
            }
            if (key === "CapsLock" && this.capsTooltip === true) {
                this.capsTooltip = false;
            }
        },
        showPwd() {
            if (this.passwordType === "password") {
                this.passwordType = "xxx";
            } else {
                this.passwordType = "password";
            }
            this.$nextTick(() => {
                this.$refs.password.focus();
            });
        },
        newShowPwd() {
            if (this.new_passwordType === "password") {
                this.new_passwordType = "xxx";
            } else {
                this.new_passwordType = "password";
            }
            this.$nextTick(() => {
                this.$refs.new_password.focus();
            });
        },
        renewShowPwd() {
            if (this.renew_passwordType === "password") {
                this.renew_passwordType = "xxx";
            } else {
                this.renew_passwordType = "password";
            }
            this.$nextTick(() => {
                this.$refs.renew_password.focus();
            });
        },
        // 修改密码
        editPassword() {
            if (!localStorage.getItem("token")) {
                localStorage.setItem("token", "editpassword");
                console.log(localStorage.getItem("token"));
            }
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    if (this.new_password === this.renew_password) {
                        this.loading = true;
                        const data = {
                            mobile: this.loginForm.mobile,
                            password: this.loginForm.password,
                            new_password: this.loginForm.new_password
                        };
                        this.Api.editPassword(data)
                            .then(res => {
                                if (res.data && res.data.ret === 0) {
                                    console.log("修改成功？", res.data);
                                    this.loading = false;
                                    this.sub_disable = true;
                                    this.$message({
                                        type: "success",
                                        message: "修改成功！"
                                    });
                                    setTimeout(() => {
                                        this.$router.push("/login");
                                    }, 1000);
                                } else if (res.data && res.data.ret === 4) {
                                    this.$message.error(
                                        res.data.msg || "修改密码失败!"
                                    );
                                    this.loading = false;
                                } else {
                                    this.$message.error("修改密码失败！");
                                    this.loading = false;
                                }
                            })
                            .catch(err => {
                                this.$message.error("网络错误");
                                this.loading = false;
                            });
                    } else {
                        this.$message.error("两次输入密码不一致");
                    }
                } else {
                    // this.$message.error("账号名或密码格式不正确");
                }
            });
        },
        // 获取店铺路由菜单
        getModuleMenu(shop_code) {
            this.Api.getModuleMenu({ shop_code })
                .then(res => {
                    console.log("看看请求的权限列表", res);
                    if (res.data.ret === 0) {
                        const menu_list = JSON.stringify(res.data.data);
                        localStorage.setItem("menu_list", menu_list);
                        this.$router.push({
                            path: this.redirect || "/",
                            query: this.otherQuery
                        });
                    } else if (res.data.ret === 2) {
                        this.$router.push("/401");
                    }
                    this.loading = false;
                })
                .catch(err => {
                    console.log(err);
                    this.loading = false;
                });
        },
        getOtherQuery(query) {
            return Object.keys(query).reduce((acc, cur) => {
                if (cur !== "redirect") {
                    acc[cur] = query[cur];
                }
                return acc;
            }, {});
        },
        handleBack() {
            this.$router.push("/login");
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
    .edit-password-container .el-input input {
        color: $cursor;
    }
}

/* reset element-ui css */
.edit-password-container {
    .el-button--primary.is-plain {
        color: #4090ff;
        background: #ecf4ff !important;
    }
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

.edit-password-container {
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
