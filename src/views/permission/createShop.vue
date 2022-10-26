<template>
    <div class="shop-config-container">
        <div class="head" />
        <div class="shop-form">
            <el-form
                ref="shopForm"
                :model="shop_form"
                :rules="rules"
                :inline="true"
                label-width="140px"
            >
                <el-form-item label="店铺名称" prop="shop_name">
                    <el-input
                        v-model="shop_form.shop_name"
                        placeholder="输入店铺名称"
                    />
                </el-form-item>
                <!-- <el-form-item label="店铺描述" prop="shop_desc">
          <el-input v-model="shop_form.shop_desc" type="textarea" placeholder="输入店铺描述" maxlength="30" show-word-limit />
        </el-form-item> -->
                <el-form-item label="店铺手机号" prop="mobile">
                    <el-input
                        v-model="shop_form.mobile"
                        :max="11"
                        placeholder="输入店铺手机号"
                    />
                </el-form-item>
                <el-form-item label="店铺座机">
                    <el-input
                        v-model="shop_form.telephone"
                        placeholder="输入店铺座机"
                    />
                </el-form-item>
                <el-form-item label="坐标地址" prop="address">
                    <div>
                        <span>选择城市</span>
                        <el-cascader
                            v-model="active_region"
                            :options="city_data"
                            :props="{
                                label: 'name',
                                value: 'name',
                                children: 'children'
                            }"
                            @change="handleChangeCity"
                        />
                        <span style="padding-left: 20px;">搜索</span>
                        <el-select
                            v-model="shop_form.address"
                            popper-class="shop-search-address"
                            filterable
                            remote
                            reserve-keyword
                            placeholder="输入关键词搜索"
                            :loading="input_loading"
                            :disabled="!(active_region && active_region.length)"
                            :remote-method="searchAddress"
                        >
                            <el-option
                                v-for="(item, index) in address_arr"
                                :key="index"
                                :label="item.title"
                                :value="item.address"
                            >
                                <div
                                    class="search-address-li"
                                    @click="handleSelectAddress(item)"
                                >
                                    <div style="line-height: 20px">
                                        {{ item.title }}
                                    </div>
                                    <div
                                        style="line-height: 20px; color: #8492a6; font-size: 13px"
                                    >
                                        {{ item.address }}
                                    </div>
                                </div>
                            </el-option>
                        </el-select>
                    </div>
                    <div class style="margin-bottom: 10px;">
                        <span>店铺地址</span>
                        <el-input
                            v-model="shop_form.address"
                            :disabled="!shop_form.address"
                            type="textarea"
                            placeholder="请通过搜索填写店铺地址"
                            maxlength="50"
                        />
                        <span style="padding-left: 20px;"
                            >经度：{{ shop_form.longitude }}，纬度：{{
                                shop_form.latitude
                            }}</span
                        >
                    </div>
                    <div id="map-container" />
                </el-form-item>
                <el-form-item
                    label="店铺logo"
                    style="width:100%;"
                    prop="shop_logo"
                >
                    <div class="photo-content">
                        <selectImages slots @successCBK="imageSuccessCBKs_logo">
                            <template scope="{ openDetail }">
                                <div
                                    v-if="shop_form.shop_logo"
                                    class="photo-list"
                                    @click="openDetail()"
                                >
                                    <img :src="shop_form.shop_logo" alt />
                                </div>
                                <div
                                    v-else
                                    class="photo-list photo-add-list"
                                    @click="openDetail()"
                                >
                                    +
                                </div>
                            </template>
                        </selectImages>
                    </div>
                </el-form-item>
                <el-form-item label="店铺环境图片展示" style="width:100%;">
                    <div class="photo-content">
                        <div
                            v-for="(item,
                            index) in shop_form.shop_environment_images"
                            :key="index"
                            class="photo-list"
                        >
                            <img :src="item.image_url" alt />
                            <div class="photo-delete-content">
                                <i
                                    class="el-icon-delete"
                                    @click="handleRemovePhoto(index)"
                                />
                            </div>
                        </div>
                        <selectImages slots @successCBK="imageSuccessCBKs">
                            <template scope="{ openDetail }">
                                <div
                                    class="photo-list photo-add-list"
                                    @click="openDetail()"
                                >
                                    +
                                </div>
                            </template>
                        </selectImages>
                    </div>
                </el-form-item>
                <el-form-item label="店铺资质图片" style="width:100%;">
                    <div class="photo-content">
                        <div
                            v-for="(item,
                            index) in shop_form.shop_qualification_images"
                            :key="index"
                            class="photo-list"
                        >
                            <img :src="item.image_url" alt />
                            <div class="photo-delete-content">
                                <i
                                    class="el-icon-delete"
                                    @click="handleRemovePhoto2(index)"
                                />
                            </div>
                        </div>
                        <selectImages slots @successCBK="imageSuccessCBKs2">
                            <template scope="{ openDetail }">
                                <div
                                    class="photo-list photo-add-list"
                                    @click="openDetail()"
                                >
                                    +
                                </div>
                            </template>
                        </selectImages>
                    </div>
                </el-form-item>
                <el-form-item label="支持开具发票">
                    <el-radio-group v-model="shop_form.invoice_flag">
                        <el-radio :label="true">开启</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="支付方式">
                    <el-radio-group v-model="shop_form.pay_type">
                        <el-radio :label="1">微信支付</el-radio>
                        <el-radio :label="2" disabled>余额支付</el-radio>
                        <el-radio :label="3" disabled>微信+余额</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="店铺状态">
                    <el-radio-group v-model="shop_form.open_flag">
                        <el-radio :label="true">开店营业</el-radio>
                        <el-radio :label="false">关店休息</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item
                    label="店铺营业时间："
                    prop="shop_times"
                    style="width: 100%;"
                >
                    每天
                    <div v-show="shop_times_type === 1">
                        <el-table
                            :data="day_time_table_list"
                            style="width: 600px"
                            :header-cell-style="{
                                background: '#F7F8FA',
                                color: '#4F4F4F',
                                fontSize: '13px',
                                fontWeight: 'normal'
                            }"
                        >
                            <el-table-column
                                prop
                                label="开始时间"
                                align="center"
                                width="200px"
                            >
                                <template slot-scope="scope">
                                    <el-time-picker
                                        v-model="scope.row.start_time"
                                        class="date-box"
                                        format="HH:mm"
                                        value-format="HH:mm"
                                        style="width: 150px;"
                                        :picker-options="{
                                            selectableRange: `00:00:00 -${
                                                scope.row.end_time
                                                    ? scope.row.end_time + ':00'
                                                    : '23:59:00'
                                            }`
                                        }"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop
                                label="结束时间"
                                align="center"
                                width="200px"
                            >
                                <template slot-scope="scope">
                                    <el-time-picker
                                        v-model="scope.row.end_time"
                                        format="HH:mm"
                                        value-format="HH:mm"
                                        style="width: 150px;"
                                        :picker-options="{
                                            selectableRange: `${
                                                scope.row.start_time
                                                    ? scope.row.start_time +
                                                      ':00'
                                                    : '00:00:00'
                                            }-23:59:00`
                                        }"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop
                                label="操作"
                                align="center"
                                width="200px"
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="
                                            handleDeleteDayTime(
                                                scope.row,
                                                scope.$index
                                            )
                                        "
                                        >删除</el-button
                                    >
                                </template>
                            </el-table-column>
                        </el-table>
                        <div>
                            <div class="color9 desc-text">
                                设定每天同城配送的营业时间，可通过添加时间段设定一天内多个营业时间段。
                            </div>
                            <el-button
                                type="primary"
                                size="small"
                                @click="handleAddDayTime"
                                >添加时间段</el-button
                            >
                        </div>
                    </div>
                    <!-- 每周 -->
                    <!-- 每周 -->
                    <cityBusinessTableEdit
                        v-show="shop_times_type === 2"
                        ref="cityBusinessTableEdit"
                        :business_date_list="business_date_list"
                    />
                </el-form-item>

                <el-form-item label="人均消费">
                    <el-input
                        v-model="shop_form.avg_cost"
                        placeholder="输入人均消费"
                        type="number"
                    />
                </el-form-item>
                <el-form-item label="金额能兑换的积分">
                    <el-input
                        v-model="shop_form.integral"
                        type="number"
                        @blur="getInt('integral')"
                    />
                </el-form-item>
                <el-form-item label="积分金额">
                    <el-input
                        v-model="shop_form.integral_money"
                        type="number"
                    />
                </el-form-item>
                <el-form-item label="积分兑换比例">
                    <div class="integral-box">
                        每
                        <el-input
                            v-model="shop_form.integral_money"
                            type="number"
                            size="mini"
                            style="width: 80px;"
                        />元可兑换
                        <el-input
                            v-model="shop_form.integral"
                            type="number"
                            size="mini"
                            style="width: 80px;"
                        />点积分
                    </div>
                    <!--                    <el-input v-model="shop_form.integral_money" type="number" />-->
                </el-form-item>
                <!--                <el-form-item label="自动确认收货时长(天)">-->
                <!--                    <el-input v-model="shop_form.order_auto_confirm_date" type="number" @blur="getInt('order_auto_confirm_date')" />-->
                <!--                </el-form-item>-->
                <!--                <el-form-item label="外卖统一打包费用">-->
                <!--                    <el-input v-model="shop_form.package_price" type="number" />-->
                <!--                </el-form-item>-->
                <!--                <el-form-item label="生产力(预计送达)">-->
                <!--                    <el-radio-group v-model="shop_form.shop_capacity.status">-->
                <!--                        <el-radio :label="true">启用</el-radio>-->
                <!--                        <el-radio :label="false">禁用</el-radio>-->
                <!--                    </el-radio-group>-->
                <!--                    <div class="capacity-form">-->
                <!--                        <div class="capacity-item">-->
                <!--                            <p>平均配送时常(分钟)：</p>-->
                <!--                            <el-input-->
                <!--                                v-model="shop_form.shop_capacity.avg_deliver_times"-->
                <!--                                size="mini"-->
                <!--                                type="number"-->
                <!--                                @blur="getInt('shop_capacity', 'avg_deliver_times')"-->
                <!--                            />-->
                <!--                        </div>-->
                <!--                        <div class="capacity-item">-->
                <!--                            <p>单份生产所需时间(分钟)：</p>-->
                <!--                            <el-input-->
                <!--                                v-model="shop_form.shop_capacity.unit_times"-->
                <!--                                size="mini"-->
                <!--                                type="number"-->
                <!--                                @blur="getInt('shop_capacity', 'unit_times')"-->
                <!--                            />-->
                <!--                        </div>-->
                <!--                        <div class="capacity-item">-->
                <!--                            <p>最多能同时生产份数(份)：</p>-->
                <!--                            <el-input-->
                <!--                                v-model="shop_form.shop_capacity.max_unit_pro_count"-->
                <!--                                size="mini"-->
                <!--                                type="number"-->
                <!--                                @blur="getInt('shop_capacity', 'max_unit_pro_count')"-->
                <!--                            />-->
                <!--                        </div>-->
                <!--                    </div>-->
                <!--                </el-form-item>-->
                <el-form-item label="支付超时时间(分钟)">
                    <el-input
                        v-model="shop_form.order_expire_time"
                        type="number"
                        @blur="getInt('order_expire_time')"
                    />
                </el-form-item>
                <!--                <el-form-item label="是否可外送">-->
                <!--                    <el-radio-group v-model="shop_form.take_out_flag">-->
                <!--                        <el-radio :label="true">可外送</el-radio>-->
                <!--                        <el-radio :label="false">不可外送</el-radio>-->
                <!--                    </el-radio-group>-->
                <!--                </el-form-item>-->
            </el-form>
            <div class="bottom">
                <el-button type="primary" @click="onSubmit('shopForm')"
                    >保存</el-button
                >
            </div>
        </div>
    </div>
</template>

<script>
import { cityData } from "@/assets/js/cityData";
import selectImages from "@/components/common/SelectImages";
export default {
    name: "ShopConfig",
    components: { selectImages },
    data() {
        return {
            tmap_key: "JSEBZ-SXZYP-XP5DB-LQ35F-34SJH-RMFXC",
            map: null,
            marker: null,
            my_location: {
                latitude: 39.984104, // 纬度
                longitude: 116.307503, // 经度
                geted: false
            },
            city_data: [],
            active_region: [],
            address_arr: [],
            input_loading: false,
            shop_form: {
                shop_id: null,
                address: "",
                shop_logo: "", // 店铺logo
                shop_name: "", // 店铺名称
                // shop_code: '', // 店铺编码
                shop_desc: "", // 店铺描述
                shop_environment_images: [], // 店铺环境图片展示
                shop_qualification_images: [], // 店铺资质图片
                mobile: "", // 店铺手机号
                telephone: "", // 店铺座机
                avg_cost: 20, // 人均消费
                integral: 0, // 金额能兑换的积分
                integral_money: 0, // 积分金额
                invoice_flag: false, // 是否开具发票
                latitude: 39.984104, // 纬度
                longitude: 116.307503, // 经度
                order_auto_confirm_date: 0, // 自动确认收货时长:天
                order_expire_time: 20, // 订单超时时间:分钟
                package_price: 0, // 外卖统一打包费用
                pay_type: 1, // 支付方式:1-微信支付 2-余额支付 3-微信+余额
                // shop_capacity: {
                //     avg_deliver_times: 20, // 平均配送大于时长
                //     max_unit_pro_count: 1, // 最大能同时生产多少份
                //     shop_capacity_id: null,
                //     shop_code: null,
                //     status: false, // 是否开启运力
                //     unit_times: 0 // 每多少分钟生产1份
                // }, // 经度
                shop_level: 2, // 店铺级别:1-总店，通常公司超管开通的店铺为总店 2-分店
                shop_type: 1, // 店铺类型:1-自营分店 2-加盟店 预留字段，用于平台入驻模式的商家
                shop_times: [], // 店铺营业时间
                open_flag: true // 店铺状态:true-营业中 false-休息中
                // take_out_flag: 1 // 1可外送，0不可外送
            },
            shop_times_type: 1, // 店铺营业时间：1每天 2每周
            rules: {
                shop_name: [
                    {
                        required: true,
                        message: "请输入店铺名称",
                        trigger: "blur"
                    },
                    {
                        min: 2,
                        max: 20,
                        message: "长度在 2 到 20 个字符",
                        trigger: "blur"
                    }
                ],
                shop_desc: [
                    {
                        required: true,
                        message: "请输入店铺描述",
                        trigger: "blur"
                    },
                    { max: 50, message: "最多 50 个字符", trigger: "blur" }
                ],
                mobile: [
                    {
                        required: true,
                        message: "请输入店铺手机号",
                        trigger: "blur"
                    },
                    {
                        min: 11,
                        max: 11,
                        message: "请输入正确的手机号",
                        trigger: "blur"
                    }
                ],
                address: [
                    {
                        required: true,
                        message: "请完善店铺地址",
                        trigger: "blur"
                    }
                ],
                shop_logo: [
                    {
                        required: true,
                        message: "请选择店铺logo",
                        trigger: "blur"
                    }
                ],
                shop_times: [
                    {
                        type: "array",
                        required: true,
                        message: "请选择营业时间",
                        trigger: "blur"
                    }
                ]
            },
            day_time_table_list: [], // 接待时间每天数组
            business_date_list: [], // 传给营业时间每周子组件的数据

            shop_name: "string", // 店铺名
            mobile: "string", // 店铺联系方式手机号
            telephone: "string", // 固话
            address: "string", // 店铺地址
            shop_logo: "string", // 店铺logo

            invoice_flag: 0, // 是否开具发票
            pay_type: 0, // 开启支付方式:1-微信支付 2-余额支付 3-微信+余额

            after_sale_period: 0, // 售后期限单位天
            app_id: "string", // 小程序AppId
            app_secret: "string", // 小程序appSecret
            commission_auto_confirm_date: 0, // 押金自动下发时间: 单位天
            integral: 0, // 积分
            integral_money: 0, // 积分兑换的金额
            order_auto_confirm_date: 0, // 自动确认收货时间: 单位天
            order_expire_time: 0, // 订单超时时间:单位分钟
            service_type: 0, // 客户类型:1平台型服务商,2定制化开发服务商
            shop_code: "string", // 店铺编码
            shop_id: 0,
            shop_level: 0 // 店铺的级别:1-主店 2-分店，主店未公司超管创建的是主店，用户自己创建的一律传2
        };
    },
    mounted() {
        // this.setShopTimeList();
        this.mapInit();
        this.getLocation();
        this.getCityData();
    },
    methods: {
        getCityData() {
            const city_data = JSON.parse(JSON.stringify(cityData.areaList));
            city_data.map((item0, index0) => {
                if (item0.province_list) {
                    item0.children = item0.province_list;
                    item0.province_list = null;
                    if (item0.children && item0.children.length) {
                        item0.children.map(item1 => {
                            if (item1.city_list) {
                                item1.children = item1.city_list;
                                item1.city_list = null;
                                // if (item1.children && item1.children.length) {
                                //     item1.children.map((item2) => {
                                //         if (item2.country_list) {
                                //             item2.children = item2.country_list;
                                //             item2.country_list = null;
                                //         }
                                //     });
                                // }
                            }
                        });
                    }
                }
            });
            this.city_data = city_data;
        },
        mapInit() {
            this.map = new qq.maps.Map("map-container", {
                rotation: 20, // 设置地图旋转角度
                pitch: 30, // 设置俯仰角度（0~45）
                zoom: 12, // 设置地图缩放级别
                center: new qq.maps.LatLng(
                    this.my_location.latitude,
                    this.my_location.longitude
                ) // 设置地图中心点坐标
            });
        },
        getLocation() {
            let time = 0;
            const _getLocation = () => {
                time++;
                const Geolocation = new qq.maps.Geolocation(
                    this.tmap_key,
                    "myapp"
                );
                const showPosition = res => {
                    if (this.my_location.geted) return;
                    // console.log('当前定位：', res);
                    this.my_location = {
                        latitude: res.lat, // 纬度
                        longitude: res.lng, // 经度
                        geted: true
                    };
                    this.map.setCenter(new qq.maps.LatLng(res.lat, res.lng));
                    this.createPoint();
                };
                const showErr = res => {
                    if (time <= 2) {
                        _getLocation();
                    }
                };
                Geolocation.getLocation(showPosition, showErr);
                Geolocation.getIpLocation(showPosition, showErr);
            };
            _getLocation();
        },

        getLocaltionLatLng(query) {
            const data = {
                keyword: query || "",
                boundary: `region(${
                    this.active_region[this.active_region.length - 1]
                },0)`,
                key: this.tmap_key
            };
            this.Api.getLocaltionLatLng(encodeURI(this.Fun.json2params(data)))
                .then(res => {
                    // console.log('搜索地址', res.data.data);
                    this.address_arr = res.data.data || [];
                    this.input_loading = false;
                })
                .catch(err => {
                    this.address_arr = [];
                    console.log("搜索地址失败", err);
                });
        },

        onSubmit(formName) {
            const data = this.shop_form;
            data.shop_times = this.getSubmitByLaoDian();
            this.shop_form.shop_times = JSON.parse(
                JSON.stringify(data.shop_times || [])
            );
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.Api.createShop(data)
                        .then(res => {
                            if (res.data.ret === 0) {
                                this.$message({
                                    type: "success",
                                    message: "创建成功！"
                                });
                                this.$router.push("/shop/shopList");
                            } else if (res.data.ret === 4) {
                                this.$message.error(
                                    res.data.msg || "创建失败！"
                                );
                            } else {
                                this.$message.error("创建失败！");
                            }
                        })
                        .catch(err => {
                            this.$message.error("创建失败！");
                        });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        getInt(val, v2) {
            if (val === "shop_capacity") {
                // this.shop_form.shop_capacity[v2] = parseInt(this.shop_form.shop_capacity[v2]);
            } else {
                this.shop_form[val] = parseInt(this.shop_form[val]);
            }
        },
        handleRemovePhoto(index) {
            this.shop_form.shop_environment_images.splice(index, 1);
        },
        imageSuccessCBKs(arr) {
            if (arr && arr.length) {
                arr.map((item, index) => {
                    this.shop_form.shop_environment_images.push({
                        image_id: item.image_id,
                        image_url: item.url
                    });
                });
            }
        },
        handleRemovePhoto2(index) {
            this.shop_form.shop_qualification_images.splice(index, 1);
        },
        imageSuccessCBKs2(arr) {
            if (arr && arr.length) {
                arr.map((item, index) => {
                    this.shop_form.shop_qualification_images.push({
                        image_id: item.image_id,
                        image_url: item.url
                    });
                });
            }
        },
        imageSuccessCBKs_logo(arr) {
            if (arr && arr.length) {
                arr.map((item, index) => {
                    this.shop_form.shop_logo = item.url;
                });
            }
        },
        handleChangeCity(val) {
            console.log("选择城市：", val);
            console.log("选择城市：", this.active_region);
        },
        searchAddress(query) {
            console.log("搜索地址：", query);
            if (
                query !== "" &&
                this.active_region &&
                this.active_region.length
            ) {
                this.input_loading = true;
                this.getLocaltionLatLng(query);
            } else {
                this.options = [];
            }
        },
        handleSelectAddress(item) {
            console.log("选择详细地址：", item.location);
            this.shop_form.latitude = item.location.lat;
            this.shop_form.longitude = item.location.lng;
            this.map.setCenter(
                new qq.maps.LatLng(
                    this.shop_form.latitude,
                    this.shop_form.longitude
                )
            );
            this.createPoint();
        },
        createPoint() {
            console.log("点坐标：", this.map.getCenter());
            if (this.marker) this.marker.setMap(null);
            this.marker = new qq.maps.Marker({
                position: this.map.getCenter(),
                map: this.map
            });
        },

        // 删除接待时间每天行数据mmm
        handleDeleteDayTime(row, index) {
            console.log("删除接待时间每天行数据", row, index);
            this.day_time_table_list.splice(index, 1);
        },
        // 接待时间添加时间段
        handleAddDayTime() {
            this.day_time_table_list.push({
                start_time: "",
                end_time: ""
            });
        },
        getSubmitByLaoDian() {
            let date_list = [];
            const dll = JSON.parse(JSON.stringify(this.day_time_table_list));
            if (!dll || !dll.length || !dll[0].start_time || !dll[0].end_time)
                return [];
            if (this.shop_times_type === 1) {
                const arr = this.day_time_table_list.map(item => {
                    return {
                        start_time:
                            item.start_time.split(":").length === 3
                                ? item.start_time
                                : item.start_time + ":00",
                        end_time:
                            item.end_time.split(":").length === 3
                                ? item.end_time
                                : item.end_time + ":00"
                    };
                });
                console.log("arr", arr);
                date_list = [
                    {
                        date: "每天",
                        city_deliver_time_rela_id:
                            this.day_time_table_list[0]
                                .city_deliver_time_rela_id || 0,
                        business_type: 1,
                        city_deliver_id: this.city_deliver_id,
                        city_deliver_time_list: arr
                    }
                ];
            } else if (this.shop_times_type === 2) {
                // 每周
                // 获取子组件数据
                console.log(
                    "this.$refs.cityBusinessTableEdit",
                    this.$refs.cityBusinessTableEdit.weekTableData
                );
                // 封装提交的数据
                const weekTableData = this.$refs.cityBusinessTableEdit
                    .weekTableData;
                weekTableData.forEach(item => {
                    item.new_arr.forEach(options => {
                        const arr = item.time_list.map(v => {
                            return {
                                start_time:
                                    v.start_time.split(":").length === 3
                                        ? v.start_time
                                        : v.start_time + ":00",
                                end_time:
                                    v.end_time.split(":").length === 3
                                        ? v.end_time
                                        : v.end_time + ":00"
                            };
                        });
                        date_list.push({
                            date: options.value,
                            business_type: 2,
                            city_deliver_id: this.city_deliver_id,
                            city_deliver_time_rela_id:
                                item.city_deliver_time_rela_id || 0,
                            city_deliver_time_list: arr
                        });
                    });
                });
            }
            return date_list;
        }
    }
};
</script>

<style lang="scss">
.shop-config-container {
    .head {
        /*margin-bottom: 10px;*/
    }

    .shop-form {
        .el-form-item--medium {
            min-width: 40%;
        }

        .el-input,
        .el-textarea {
            width: 320px;
        }
        #map-container {
            width: 600px;
            height: 400px;
        }
        .integral-box {
            input::-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
                -webkit-appearance: none;
            }
            input[type="number"] {
                -moz-appearance: textfield;
            }
        }

        .capacity-form {
            width: 100%;

            .capacity-item {
                display: flex;
                align-content: center;
                align-items: center;

                p {
                    width: 160px;
                    font-size: 13px;
                }

                .el-input {
                    width: 160px;
                }
            }
        }

        .photo-content {
            overflow: hidden;

            .photo-list {
                overflow: hidden;
                box-sizing: border-box;
                width: 148px;
                height: 148px;
                border: 1px dashed #c0ccda;
                border-radius: 6px;
                line-height: 146px;
                vertical-align: top;
                background-color: #fbfdff;
                margin-right: 8px;
                margin-bottom: 8px;
                float: left;
                position: relative;

                img {
                    width: 100%;
                    height: 100%;
                }

                .photo-delete-content {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: none;
                    line-height: 146px;
                    text-align: center;

                    i {
                        font-size: 30px;
                        color: #fff;
                        cursor: pointer;
                    }
                }
            }

            .photo-list:hover .photo-delete-content {
                display: block;
            }

            .photo-add-list {
                margin-right: 0;
                font-size: 60px;
                line-height: 146px;
                text-align: center;
                color: #8c939d;
                cursor: pointer;
            }
            .select-image-container {
                float: left;
            }
        }
        .shop-time-box {
            .shop-timearea-item {
                padding: 4px 0;
            }
        }
    }
}
.shop-search-address {
    .el-select-dropdown__item {
        height: auto;
        padding: 0;
        .search-address-li {
            width: 100%;
            height: auto;
            padding: 10px 20px;
        }
    }
}
</style>
