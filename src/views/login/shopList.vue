<!--登录后的门店选择页面-->
<template>
    <div class="login-shop">
        <h3 class="colorful">门店列表</h3>
        <div class="shop-box">
            <div v-for="(item,index) in shop_list" :key="index">
                <img class="img" :src="`${baseImgUrl}${item.file_id}`" alt="">
                <div class="tetx">
                    <div style="display: flex;align-items: center;flex-wrap: wrap;">
                        <span>门店名：{{ item.shop_name }}</span>
                        <span>门店地址：{{ item.address_detail }}</span>
                    </div>
                    <div>
                        <el-button type="primary" plain @click="handleClick(index)">选择</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ShopList',
        data() {
            return {
                shop_list: [],
                baseImg: ''
            };
        },
        created() {
            this.getShop();
            this.baseImg = '';
        },
        methods: {
            getShop() {
                this.shop_list = JSON.parse(localStorage.getItem('shop_list'));
            },
            handleClick(row) {
                const shop_data = JSON.stringify(this.shop_list[row]);
                localStorage.setItem('shop_data', shop_data);
                localStorage.setItem('app_id', this.shop_list[row].app_id);
                const data = {
                    shop_code: this.shop_list[row].shop_code,
                    user_id: localStorage.getItem('shop_info')
                };
                this.Api.userLoginShop(data).then(res => {
                    console.log('看看请求的权限列表', res);
                    if (res.data.ret === 0) {
                        const menu_list = JSON.stringify(res.data.data);
                        localStorage.setItem('menu_list', menu_list);
                        this.$router.push({ path: this.redirect || '/', query: this.otherQuery });
                        this.loading = false;
                    } else if (res.data.ret === 2) {
                        this.$router.push('/401');
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .login-shop {
        padding: 50px 50px;

        .colorful {
            width: 250px;
            font-size: 30px;
            text-align: center;
            margin: 0 auto;
            padding: 20px 0;
            background-image: -webkit-gradient(linear, left top, right top, color-stop(0, #e0fff6),
                    color-stop(0.15, #45abff),
                    color-stop(0.3, #41ffff),
                    color-stop(0.45, #5cfff0),
                    color-stop(0.6, #8cff9f),
                    color-stop(0.75, #beff95),
                    color-stop(0.9, #ffe676),
                    color-stop(1, #ff959c));
            color: transparent;
            -webkit-background-clip: text;
            -moz-background-clip: text;
            -ms-background-clip: text
        }

        .shop-box {
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            .img {
                width: 100px;
                height: 100px;
            }
        }

        .shop-box > div {
            border: 1px solid #eee;
            padding: 10px 10px;
            width: 30%;
            height: 150px;
            display: flex;
            align-items: center;
            margin: 10px 10px;
        }

        .tetx {
            margin-left: 10px;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            justify-content: center;

            span {
                margin-bottom: 10px;
                width: 100%;
            }
        }
    }
</style>
