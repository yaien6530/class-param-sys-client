// 全局方法统一写在此处，另需在main.js引入方法名
import Api from "@/api/index";

export default {
    aaa(value_a) {
        console.log("全局方法aaa");
    },

    bbb(value_b) {
        console.log("全局方法bbb");
    },

    // 把对象转换为params参数
    json2params(json, slice = "&") {
        return Object.keys(json)
            .reduce((acc, item) => {
                return String(acc) + item + "=" + json[item] + slice;
            }, "")
            .slice(0, -1);
    },

    // 时间戳转字符串
    getDateString(stamp) {
        const dateMat = new Date(stamp);
        const y = dateMat.getFullYear();
        const m = dateMat.getMonth() + 1;
        const d = dateMat.getDate();
        const hh = dateMat.getHours();
        const mm = dateMat.getMinutes();
        const ss = dateMat.getSeconds();
        const getTime = function(e) {
            if (e < 10) {
                return "0" + e;
            } else {
                return e;
            }
        };
        const timeFormat =
            y +
            "-" +
            m +
            "-" +
            d +
            " " +
            getTime(hh) +
            ":" +
            getTime(mm) +
            ":" +
            getTime(ss);
        return timeFormat;
    },

    // 设置表头样式
    getRowClass(rowIndex) {
        if (rowIndex == 0) {
            return "background:#F7F8FA; color:#4F4F4F; font-weight:normal;";
        }
    },

    // 表单校验
    ruleForm(refs) {
        let flag = true;
        refs.forEach(item => {
            item.validate(valid => {
                if (!valid) {
                    flag = false;
                }
            });
        });
        return flag;
    },

    // 请求获取店铺功能
    getModulesShop() {
        const permissions = {
            "M-SPIKE": false, // 秒杀
            "M-GROUP-BUY": false, // 团购
            "M-INTEGRAL-MALL": false, // 积分商城
            "M-DISTRIBUTION": false, // 分销
            "M-INTEGRAL-TASK": false, // 积分任务
            "M-SIGN-IN": false, // 签到
            "M-RECHARGE": false, // 储值
            "M-REDEMPTION": false, // 换购
            "M-MEMBER": false, // 会员
            "M-COUPON-CENTER": false, // 领券
            "M-LOTTERY": false // 抽奖
        };
        Api.getModulesShop()
            .then(res => {
                if (res.data.ret == 0 && res.data.data) {
                    res.data.data.map((item, index) => {
                        if (permissions[item.module_code] !== undefined) {
                            permissions[item.module_code] = true;
                            // console.log("拥有权限：", item.module_code);
                        }
                    });
                    // console.log("权限列表：", permissions);
                    localStorage.setItem(
                        "permissions",
                        JSON.stringify(permissions)
                    );
                }
            })
            .catch(err => {
                localStorage.setItem(
                    "permissions",
                    JSON.stringify(permissions)
                );
            });
    },

    /**
     * 表单数字校验,可以是小数
     * @param {*} value 值
     * @param {*} title 标题
     * @param {*} msg 具体内容
     */
    validNumberPass(value, title, msg) {
        //包含小数的数字
        let reg = /^[+]?(0|([1-9]\d*))(\.\d+)?$/g;
        if (value === "") {
            return {
                flag: false,
                error_msg: `${title}请输入${msg}`
            };
        } else if (!reg.test(value)) {
            return {
                flag: false,
                error_msg: `${title}${msg}请输入数字`
            };
        } else {
            return {
                flag: true,
                error_msg: ""
            };
        }
    }
};
