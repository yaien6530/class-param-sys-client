<template>
    <div class="shopInfo-container edit-common-container">
        <el-form ref="form" :model="form" label-width="250px">
            <el-form-item style="margin: 40px 0;" label="店铺名称">
                <el-input
                    v-model="form.shop_name"
                    style="width: 300px;"
                    placeholder="请输入店铺名称"
                />
                <span class="tip">请输入店铺名称,例如腾讯科技有限公司</span>
            </el-form-item>
            <el-form-item style="margin: 40px 0;" label="店铺介绍">
                <el-input
                    v-model="form.remark"
                    style="width: 300px;"
                    placeholder="请输入店铺描述"
                    type="textarea"
                />
            </el-form-item>
            <el-form-item style="margin: 40px 0;" label="店铺地址">
                <el-input
                    v-model="form.address"
                    style="width: 300px;"
                    placeholder="请输入店铺地址"
                />
                <el-button
                    @click="chooseShopAddress"
                    type="text"
                    size="small"
                    style="color:#4793E8;"
                    >选择门店地址</el-button
                >
            </el-form-item>
            <el-form-item style="margin: 40px 0;" label="店铺经纬度">
                <el-input
                    v-model="form.longitude"
                    style="width:150px;"
                    disabled
                />
                <el-input
                    v-model="form.latitude"
                    style="width:150px;"
                    disabled
                />
            </el-form-item>
            <el-form-item style="margin: 40px 0;" label="店铺联系人">
                <el-input
                    v-model="form.contract_user"
                    style="width: 300px;"
                    placeholder="请输入店铺联人"
                />
            </el-form-item>
            <el-form-item style="margin: 40px 0;" label="联系方式">
                <el-input
                    v-model="form.mobile"
                    style="width: 300px;"
                    placeholder="请输入店铺联系方式"
                />
                <span class="tip">请输入店铺联系方式,例如1435434778687</span>
            </el-form-item>
            <el-form-item style="margin: 40px 0;" label="固定电话">
                <el-input
                    v-model="form.telephone"
                    style="width: 300px;"
                    placeholder="请输入店铺固定电话"
                />
                <span class="tip">请输入店铺固定电话,例如0777-77777777</span>
            </el-form-item>

            <el-form-item style="margin: 40px 0;" label="营业时间">
                <el-time-picker
                    placeholder="起始时间"
                    v-model="form.time_begin"
                    value-format="HH:mm:ss"
                    format="HH:mm"
                />
                <span>-</span>
                <el-time-picker
                    placeholder="结束时间"
                    v-model="form.time_end"
                    value-format="HH:mm:ss"
                    format="HH:mm"
                />
            </el-form-item>
            <el-form-item
                style="margin: 40px 0;"
                label="店铺商品默认售后期限(天)"
            >
                <div>
                    <el-input-number
                        :min="1"
                        :precision="0"
                        :step="1"
                        v-model="form.after_sale_period"
                    ></el-input-number>
                    <span class="tip">店铺商品默认售后期限(天)</span>
                </div>
            </el-form-item>
            <el-form-item
                style="margin: 40px 0;"
                label="店铺自动确认收货时间(天)"
            >
                <div>
                    <el-input-number
                        :min="1"
                        :precision="0"
                        :step="1"
                        v-model="form.order_auto_confirm_date"
                    ></el-input-number>
                    <span class="tip">请输入店铺自动确认收货时间(天)</span>
                </div>
            </el-form-item>
            <el-form-item
                style="margin: 40px 0;"
                label="店铺订单超时关闭时间(分钟)"
            >
                <div>
                    <el-input-number
                        :min="1"
                        :precision="0"
                        :step="1"
                        v-model="form.order_expire_time"
                    ></el-input-number>
                    <span class="tip">请输入店铺订单超时关闭时间(分钟)</span>
                </div>
            </el-form-item>
            <!-- <el-form-item v-show="permissions['M-DISTRIBUTION']" style="margin: 40px 0;" label="佣金自动发放时间(天)">
        <div>
          <el-input-number :min="1" :precision="0" :step="1" v-model="form.commission_auto_confirm_date" />
          <span class="tip">请输入店铺佣金自动发放时间(天)</span>
        </div>
      </el-form-item> -->
            <el-form-item style="margin: 40px 0;" label="店铺积分比例">
                <div>
                    <el-input-number
                        :min="1"
                        :precision="0"
                        :step="1"
                        v-model="form.integral"
                    ></el-input-number>
                    <span class="tip">请输入积分值</span>
                </div>
                <div style="margin: 20px 0;">
                    <el-input-number
                        :min="1"
                        :precision="0"
                        :step="1"
                        v-model="form.integral_money"
                    ></el-input-number>
                    <span class="tip">请输入积分值可兑换的金额</span>
                </div>
                <div>
                    <span class="tip"
                        >设置店铺积分与金额的比例,例如100积分等于1元</span
                    >
                </div>
            </el-form-item>
            <el-form-item label="开启店铺访问首页登录">
                <el-radio-group v-model="form.login_type">
                    <el-radio :label="Number(0)">是</el-radio>
                    <el-radio :label="Number(1)">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="开票功能">
                <el-radio-group v-model="form.invoice_flag">
                    <el-radio :label="Number(1)">是</el-radio>
                    <el-radio :label="Number(0)">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="支付功能">
                <el-radio-group v-model="form.pay_type">
                    <el-radio :label="Number(1)">微信支付</el-radio>
                    <el-radio :label="Number(2)">余额支付</el-radio>
                    <el-radio :label="Number(3)">微信余额混合支付</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item style="margin: 40px 0;" label="店铺logo">
                <div class="choose-picture-180">
                    <img
                        v-show="form.shop_logo"
                        :src="form.shop_logo"
                        class="img"
                    />
                    <p v-show="!form.shop_logo">
                        <i class="el-icon-plus icon" />
                    </p>
                    <selectSingleImage
                        slots
                        @successCBK="
                            val => handleAvatarSuccess(val, 'shop_logo')
                        "
                    >
                        <template scope="{ openDetail }">
                            <div
                                class="select-image-component"
                                @click="openDetail()"
                            />
                        </template>
                    </selectSingleImage>
                </div>
                <div>
                    <span class="tip">设置店铺logo，建议尺寸1 : 1</span>
                </div>
            </el-form-item>
            <el-form-item style="margin: 40px 0;" label="店铺大图">
                <div class="choose-picture-180">
                    <img
                        v-show="form.shop_image"
                        :src="form.shop_image"
                        class="img"
                    />
                    <p v-show="!form.shop_image">
                        <i class="el-icon-plus icon" />
                    </p>
                    <selectSingleImage
                        slots
                        @successCBK="
                            val => handleAvatarSuccess(val, 'shop_image')
                        "
                    >
                        <template scope="{ openDetail }">
                            <div
                                class="select-image-component"
                                @click="openDetail()"
                            />
                        </template>
                    </selectSingleImage>
                </div>
                <div>
                    <span class="tip">设置店铺大图，建议尺寸750 x 260</span>
                </div>
            </el-form-item>
            <el-form-item style="margin: 40px 0;">
                <el-button
                    type="primary"
                    @click="onSubmit"
                    :disabled="user_level != 1"
                    >保存</el-button
                >
                <!-- <el-button @click="handleCancle">取消</el-button> -->
            </el-form-item>
        </el-form>
        <!-- 店铺配送方式 -->
        <el-form ref="form" :model="express_form" label-width="250px">
            <el-form-item style="margin: 40px 0;" label="店铺配送方式">
                <el-checkbox-group v-model="expressCheckList">
                    <el-checkbox
                        v-for="(item, index) in expressCheckboxList"
                        :label="item.express_type"
                        :key="index"
                        :checked="item.status"
                        >{{ item.value }}</el-checkbox
                    >
                </el-checkbox-group>
            </el-form-item>
            <el-form-item style="margin: 40px 0;">
                <el-button
                    type="primary"
                    @click="editShopExpressType"
                    :disabled="!form.shop_code || user_level != 1"
                    >保存</el-button
                >
            </el-form-item>
        </el-form>
        <!-- 选择地图弹窗 -->
        <el-dialog
            title="选择门店地址"
            :visible.sync="dialogVisible"
            width="650px"
            :before-close="handleClose"
        >
            <div class="dialog-address-box">
                <span>输入地址：</span>
                <el-input v-model="form.address" class="w300"></el-input>
                <span class="search-btn" @click="getLocation">搜索</span>
            </div>
            <div id="atlas" />
            <div class="dialog-address-tip">点击地图上的小蓝点选择地点</div>
        </el-dialog>

        <div class="bottom-btn">
            <el-button @click="goBack" size="small">返回</el-button>
        </div>
    </div>
</template>

<script>
const permissions = JSON.parse(localStorage.getItem("permissions"));
import { TMap } from "@/utils/tmap";
import selectSingleImage from "@/components/common/selectSingleImage";

function isNumber(value) {
    if (value === undefined || value === null || value === "") {
        return false;
    }

    if (typeof value === "string") {
        //正整数
        var reNumber = /^\d+$/;
        //负整数
        var reNeNumber = /^-\d+$/;
        //正实数
        var reRealNumber1 = /^[1-9]\d*[.]\d+$/; //非零开头
        var reRealNumber2 = /^0[.]\d+$/; //零开头
        //负实数
        var reNeRealNumber1 = /^-[1-9]\d*[.]\d+$/; //非零开头
        var reNeRealNumber2 = /^-0[.]\d+$/; //零开头

        if (
            reNumber.test(value) ||
            reNeNumber.test(value) ||
            reRealNumber1.test(value) ||
            reRealNumber2.test(value) ||
            reNeRealNumber1.test(value) ||
            reNeRealNumber2.test(value)
        ) {
            return true;
        } else {
            return false;
        }
    } else if (typeof value === "number") {
        return true;
    } else {
        return false;
    }
}

export default {
    components: { selectSingleImage },
    data() {
        return {
            pageType: 1, // 页面类型 1新增 2更新
            user_level: 2, // 账号类型 1超管 2普通
            permissions, //权限
            form: {
                shop_name: "", //店铺名称
                remark: "", // 店铺描述
                address: "", // 店铺地址
                latitude: "", // 纬度
                longitude: "", // 经度
                contract_user: "", // 联系人
                mobile: "", // 联系方式
                telephone: "", // 固定电话

                time_begin: "", // 营业开始时间
                time_end: "", // 营业结束时间

                after_sale_period: "", // 店铺商品默认售后期限(天)
                order_auto_confirm_date: "", //请输入店铺自动确认收货时间(天)
                order_expire_time: "", //店铺订单超时关闭时间(分钟)
                // commission_auto_confirm_date: '', //店铺佣金自动发放时间

                integral: 0, // 积分
                integral_money: 0, // 积分兑换的金额
                login_type: 1, // 开启店铺访问首页登录功能 0开启 1关闭 默认关闭
                invoice_flag: 1, // 是否开发票 1是 0否
                pay_type: 1, // 支付类型 1微信支付 2余额支付 3微信+余额

                shop_logo: "", // 店铺logo
                shop_image: "", // 店铺大图

                address_city: "",
                address_province: "",
                address_county: "",

                app_id: "", // 小程序AppId
                app_secret: "", // 小程序appSecret
                service_type: 1, // 客户类型:1平台型服务商, 2定制化开发服务商  写死1
                shop_code: "", // 店铺编码
                shop_id: 0,
                shop_level: 2 // 店铺的级别:1-主店 2-分店，主店未公司超管创建的是主店，用户自己创建的一律传2
            },

            divide_form: {
                // 分成配置表单
                level_one: "", // 一级分销商分成
                level_two: "", // 二级分销商分成
                limit_child_number: "" // 下级人数限制
            },

            checkboxList: [
                // 1 分享成为分销商 2下单成为分销商 3申请成为分销商 4邀请码成为分销商
                { type: 1, value: "分享成为分销商", checked: false },
                { type: 2, value: "下单成为分销商", checked: false },
                { type: 3, value: "申请成为分销商", checked: false },
                { type: 4, value: "邀请码成为分销商", checked: false }
            ],
            checkList: [], //多选选中
            shop_info: null, // 店铺信息
            dialogVisible: false, //选择门店地址地图弹窗
            adderssObj: "",

            express_form: {}, //店铺配送方式表单
            expressCheckList: [], //配送快递多选选中
            expressCheckboxList: [
                {
                    express_type: 1,
                    value: "快递发货",
                    shop_code: "",
                    status: false
                },
                {
                    express_type: 2,
                    value: "同城派送",
                    shop_code: "",
                    status: false
                },
                {
                    express_type: 3,
                    value: "上门自提",
                    shop_code: "",
                    status: false
                }
            ] //1 快递发货 2 同城派送 3 上门自提
        };
    },
    created() {
        const { type = 1, shop_code = 0 } = this.$route.query;
        this.user_level = JSON.parse(localStorage.getItem("shop_data")).level;
        this.pageType = type;
        this.form.shop_code = shop_code;
        if (type == 2) {
            this.getShopConfig();
            this.getShopExpressType(); // 获取店铺的配送方式
        } else {
            this.form.longitude = 108.369892;
            this.form.latitude = 22.81621;
        }
    },
    methods: {
        // 获取店铺信息配置 - api
        getShopConfig() {
            this.Api.getShopConfig({
                shop_code: this.form.shop_code
            })
                .then(res => {
                    if (res.data.ret === 0) {
                        this.form = res.data.data;
                        this.form.invoice_flag = res.data.data.invoice_flag;
                        this.form.pay_type = res.data.data.pay_type;
                        this.form.shop_logo = res.data.data.shop_logo;
                        this.form.longitude =
                            res.data.data.longitude || 108.369892;
                        this.form.latitude = res.data.data.latitude || 22.81621;
                        if (!this.form.integral) {
                            this.form.integral = 0;
                        }
                        if (!this.form.integral_money) {
                            this.form.integral_money = 0;
                        }
                    } else {
                        this.$message.error(
                            `获取店铺信息失败，${res.data.msg}，错误码${
                                res.data.ret
                            }`
                        );
                    }
                })
                .catch(err => {
                    this.$message.error(`网络错误`);
                });
        },
        // 店铺信息保存 - api
        onSubmit() {
            if (!isNumber(this.form.mobile)) {
                return this.$message.error("请输入数字");
            }
            if (!this.form.time_begin || !this.form.time_end) {
                return this.$message.error("请选择营业时间");
            }
            const timeBegins = this.form.time_begin.split(":");
            const timeEnds = this.form.time_end.split(":");
            if (timeBegins[0] > timeEnds[0]) {
                return this.$message.error("营业开始时间不能大于结束时间");
            } else if (
                timeBegins[0] == timeEnds[0] &&
                timeBegins[1] >= timeEnds[1]
            ) {
                return this.$message.error("营业开始时间不能大于结束时间");
            }
            const data = {
                app_id: localStorage.getItem("app_id"),
                address: this.form.address, //店铺地址
                integral: this.form.integral, //积分
                integral_money: this.form.integral_money, //积分兑换的金额
                invoice_flag: this.form.invoice_flag, //是否开发票
                contract_user: this.form.contract_user, // 联系人
                mobile: this.form.mobile, //联系电话
                pay_type: this.form.pay_type, //支付类型
                shop_code: this.form.shop_code, //shop_code
                shop_id: this.form.shop_id, //店铺id
                shop_logo: this.form.shop_logo || null, //店铺logo
                shop_image: this.form.shop_image || null, //店铺大图
                shop_name: this.form.shop_name, //店铺名称
                telephone: this.form.telephone, //固定电话
                after_sale_period: this.form.after_sale_period, //店铺商品默认售后期限(天)
                order_auto_confirm_date: this.form.order_auto_confirm_date, //请输入店铺自动确认收货时间(天)
                order_expire_time: this.form.order_expire_time, //店铺订单超时关闭时间(分钟)
                // commission_auto_confirm_date: this.form.commission_auto_confirm_date, //店铺佣金自动发放时间(天)
                latitude: this.form.latitude, //纬度
                longitude: this.form.longitude, //经度
                service_type: 1,
                shop_level: 2,
                remark: this.form.remark,
                time_begin: this.form.time_begin, // 开始时间
                time_end: this.form.time_end, // 结束时间
                login_type: this.form.login_type // 开启店铺访问首页登录功能
            };
            if (this.pageType == 2) {
                // 更新
                this.Api.updateShop(data)
                    .then(res => {
                        if (res.data.ret === 0) {
                            this.$message({
                                message: "保存成功!",
                                type: "success"
                            });
                            this.getShopConfig();
                        } else {
                            this.$message.error(
                                `保存信息失败,${res.data.msg},错误码${
                                    res.data.ret
                                }`
                            );
                        }
                    })
                    .catch(err => {
                        this.$message.error(`网络错误`);
                    });
            } else {
                // 新增
                this.Api.createShop(data)
                    .then(res => {
                        if (res.data.ret === 0) {
                            this.$message({
                                message: "保存成功!",
                                type: "success"
                            });
                            setTimeout(() => {
                                this.$router.replace(
                                    {
                                        path: "editShop",
                                        query: {
                                            type: 2,
                                            shop_code: res.data.data
                                        }
                                    },
                                    () => {
                                        this.reload();
                                    }
                                );
                            }, 1000);
                            this.pageType = 2;
                            this.form.shop_code = res.data.data;
                            this.getShopConfig();
                        } else {
                            this.$message.error(
                                `保存信息失败,${res.data.msg},错误码${
                                    res.data.ret
                                }`
                            );
                        }
                    })
                    .catch(err => {
                        this.$message.error(`网络错误`);
                    });
            }
        },

        // 分成设置保存 - api
        divideOnSubmit() {
            const re = /^[0-9]+.?[0-9]*/; // 判断字符串是否为数字//判断正整数/[1−9]+[0−9]∗]∗/
            console.log(
                "this.divide_form.level_one",
                this.divide_form.level_one
            );
            if (!isNumber(this.divide_form.level_one)) {
                return this.$message.error("请输入数字");
            }
            console.log(
                "this.divide_form.level_two",
                this.divide_form.level_two
            );
            if (!isNumber(this.divide_form.level_two)) {
                return this.$message.error("请输入数字");
            }
            // if (!isNumber(this.divide_form.limit_child_number)) {
            //   return this.$message.error("请输入数字");
            // }
            if (
                this.divide_form.level_two * 100 +
                    this.divide_form.level_one * 100 !=
                100
            ) {
                return this.$message.error("比例之和需要等于1");
            }
            const data = {
                app_id: localStorage.getItem("app_id"),
                shop_code: this.form.shop_code,
                divide_id: this.divide_form.divide_id || 0, // 分成设置id
                level_one: this.divide_form.level_one, // 一级分销分成比例
                level_two: this.divide_form.level_two, // 二级分销分成比例
                limit_child_number: this.divide_form.limit_child_number // 下级人数
            };
            // console.log("data", data);
            this.Api.updateDivideList(data)
                .then(res => {
                    // console.log('看看更新信息', res.data);
                    if (res.data.ret === 0) {
                        this.$message({
                            message: "保存成功!",
                            type: "success"
                        });
                    } else {
                        this.$message.error(
                            `保存信息失败,${res.data.msg},错误码${res.data.ret}`
                        );
                    }
                })
                .catch(err => {
                    this.$message.error(`网络错误`);
                });
        },

        // 获取店铺的配送方式 - api
        getShopExpressType() {
            const params = {
                shop_code: this.form.shop_code
            };
            this.Api.getShopExpressType(params)
                .then(res => {
                    if (res.data.ret === 0) {
                        if (res.data.data && res.data.data.length > 0) {
                            let expressCheckList = [];
                            res.data.data.forEach(item => {
                                if (item.status) {
                                    expressCheckList.push(item.express_type);
                                }
                            });
                            this.expressCheckList = expressCheckList;
                        } else {
                            this.expressCheckList = [];
                        }
                    } else {
                        this.$message.error(
                            `获取店铺配送方式失败,错误码${res.data.ret}`
                        );
                    }
                })
                .catch(err => {
                    this.$message.error(`网络错误`);
                });
        },
        // 设置店铺配送方式 - api
        editShopExpressType() {
            if (this.expressCheckList.length === 0) {
                this.$message.error("请至少选择一种配送方式！");
                return;
            }
            let data = this.expressCheckboxList;
            data.forEach(item => {
                item.status = false;
                item.shop_code = this.form.shop_code;
                this.expressCheckList.forEach(options => {
                    if (item.express_type === options) {
                        item.status = true;
                    }
                });
            });
            console.log("设置店铺配送方式", data);
            const params = {
                shop_code: this.form.shop_code
            };
            this.Api.editShopExpressType(data, params)
                .then(res => {
                    if (res.data.ret === 0) {
                        this.$message({
                            message: "保存成功!",
                            type: "success"
                        });
                        this.getShopExpressType();
                    } else {
                        this.$message.error(
                            `保存信息失败,${res.data.msg},错误码${res.data.ret}`
                        );
                    }
                })
                .catch(err => {
                    this.$message.error(`网络错误`);
                });
        },

        // 店铺设置取消
        handleCancle() {
            this.getShopConfig();
        },
        // 选择店铺logo/image
        handleAvatarSuccess(obj, prop) {
            this.form[prop] = obj.url;
            this.$forceUpdate();
        },
        //多选框改变事件
        checkboxChange(val) {
            console.log("多选框改变事件", val);
        },

        //选择门店地址
        chooseShopAddress() {
            this.dialogVisible = true;
            this.mapTX();
        },
        //关闭选择门店地址弹窗
        handleClose() {
            this.dialogVisible = false;
        },
        // 腾讯地图初始化
        mapTX() {
            const that = this;
            TMap().then(qq => {
                var map = new qq.maps.Map(document.getElementById("atlas"), {
                    // 这里经纬度代理表进入地图显示的中心区域
                    center: new qq.maps.LatLng(
                        that.form.latitude,
                        that.form.longitude
                    ),
                    zoom: 13
                });
                // 地址和经纬度之间进行转换服务
                var geocoder = new qq.maps.Geocoder();
                var marker = null;
                // 地址和经纬度之间进行转换服务
                geocoder = new qq.maps.Geocoder();
                // 设置服务请求成功的回调函数
                geocoder.setComplete(function(result) {
                    map.setCenter(result.detail.location);
                    marker = new qq.maps.Marker({
                        map: map,
                        position: result.detail.location
                    });
                    // console.log(result.detail.address, result.detail.location);
                    console.log("点result", result);
                    let str_street = result.detail.addressComponents
                        .streetNumber
                        ? result.detail.addressComponents.streetNumber
                        : result.detail.addressComponents.street;
                    that.form.address = `${
                        result.detail.addressComponents.province
                    }${result.detail.addressComponents.city}${
                        result.detail.addressComponents.district
                    }${str_street}`;
                    console.log("点result", that.form.address);
                    that.form.address_city =
                        result.detail.addressComponents.city;
                    that.form.address_province =
                        result.detail.addressComponents.province;
                    that.form.address_county =
                        result.detail.addressComponents.district;
                    that.form.latitude = result.detail.location.lat;
                    that.form.longitude = result.detail.location.lng;
                    const addressComponents = result.detail.addressComponents;
                    const mapProvince = addressComponents.province;
                    const mapCity = addressComponents.city;
                    const mapDistrict = addressComponents.district;
                    that.adderssObj = `${mapProvince}/${mapCity}/${mapDistrict}`;
                    // if (!that.mapAddress) {
                    //   that.mapAddress = true;
                    // }
                    that.$message({
                        message: `位置:${result.detail.address}
                            :经度:${result.detail.location.lat}
                            :纬度:${result.detail.location.lng}`,
                        type: "success"
                    });
                });
                // 若服务请求失败，则运行以下函数
                geocoder.setError(function() {
                    this.$message.error("出错了，请输入正确的经纬度！！！");
                });
                // 绑定单击事件添加参数
                qq.maps.event.addListener(map, "click", function(event) {
                    var latLng = new qq.maps.LatLng(
                        event.latLng.getLat(),
                        event.latLng.getLng()
                    );
                    // 对指定经纬度进行解析
                    geocoder.getAddress(latLng);
                });
            });
        },
        // 获取经纬度
        getLocation() {
            const that = this;
            const address =
                this.form.address_province +
                this.form.address_city +
                this.form.address_county +
                this.form.address;
            console.log("获取", this.form, address);
            var center = new qq.maps.LatLng(
                that.form.latitude,
                that.form.longitude
            );
            var map = new qq.maps.Map(document.getElementById("atlas"), {
                center: center,
                zoom: 13
            });
            var geocoder = new qq.maps.Geocoder();
            // 对指定地址进行解析
            geocoder.getLocation(address);
            // 设置服务请求成功的回调函数
            geocoder.setComplete(function(result) {
                map.setCenter(result.detail.location);
                var marker = new qq.maps.Marker({
                    map: map,
                    position: result.detail.location
                });
                // console.log(result.detail.address, result.detail.location);
                that.form.latitude = result.detail.location.lat;
                that.form.longitude = result.detail.location.lng;
                console.log("点result", result);
                let str_street = result.detail.addressComponents.streetNumber
                    ? result.detail.addressComponents.streetNumber
                    : result.detail.addressComponents.street;
                that.form.address = `${
                    result.detail.addressComponents.province
                }${result.detail.addressComponents.city}${
                    result.detail.addressComponents.district
                }${str_street}`;
                console.log("点result", that.form.address);
                // 点击Marker会弹出反查结果
                const addressComponents = result.detail.addressComponents;
                const mapProvince = addressComponents.province;
                const mapCity = addressComponents.city;
                const mapDistrict = addressComponents.district;
                that.adderssObj = `${mapProvince}/${mapCity}/${mapDistrict}`;
                if (!that.mapAddress) {
                    that.mapAddress = true;
                }
                // console.log('result', result);
                qq.maps.event.addListener(marker, "click", function() {
                    that.$message({
                        message: `位置:${result.detail.address}
                            :经度:${result.detail.location.lat}
                            :纬度:${result.detail.location.lng}`,
                        type: "success"
                    });
                });
                // 绑定单击事件添加参数
                qq.maps.event.addListener(map, "click", function(event) {
                    var latLng = new qq.maps.LatLng(
                        event.latLng.getLat(),
                        event.latLng.getLng()
                    );
                    // 对指定经纬度进行解析
                    geocoder.getAddress(latLng);
                });
            });
            // 若服务请求失败，则运行以下函数
            geocoder.setError(function() {
                alert("出错了，请输入正确的地址！！！");
            });
        },
        // 返回
        goBack() {
            this.$router.push({
                path: "shopList"
            });
        }
    }
};
</script>
<style lang="scss">
.shopInfo-container {
    padding: 100px 100px;

    .container {
        width: 50%;
        margin: 0 auto;
    }

    .tip {
        font-size: 14px;
        color: #c0c4cc;
    }
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
.dialog-address-box {
    padding: 20px 0;
    border-top: 1px solid #e5e5e5;
}
.dialog-address-tip {
    color: #a6a6a6;
    font-size: 13px;
    padding: 20px 0;
}
/deep/.el-dialog__body {
    padding: 0 20px 0 20px;
}
.search-btn {
    color: #fff;
    background: #2a82e4;
    font-size: 14px;
    border-radius: 5px;
    padding: 5px 20px;
    margin-left: 10px;
}
#atlas {
    min-width: 600px;
    min-height: 500px;
    width: 50%;
}
</style>
