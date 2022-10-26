<template>
  <div class="shop-list-container">
    <top-title :title="'店铺列表'" :content="'创建新的店铺或编辑删除已创建的店铺信息'" :line="false" />

    <!-- 工具栏 -->
    <div class="tool-box">
      <el-tabs type="card" @tab-click="changeTab">
        <el-tab-pane v-for="item in tabList" :key="item.key" :label="item.label" />
      </el-tabs>
      <div class="search-box">
        <el-input v-model="search_name" placeholder="输入联系人名/门店名称" size="mini" @keyup.enter.native="searchName">
          <i slot="prefix" class="el-input__icon el-icon-search" @click="searchName" />
        </el-input>
      </div>
    </div>

    <!-- 路由栏 -->
    <div class="router-common">
      <el-button v-if="user_level == 1 && user_version == 2" type="primary" @click="toEdit(1)">新建店铺</el-button>
    </div>

    <!-- table -->
    <el-table v-loading="loading" :data="shop_list" :header-cell-style="getRowClass">
      <el-table-column label="门店名称" prop="shop_name" width="180" />
      <el-table-column label="门店编码" prop="shop_code" width="110" />
      <el-table-column label="联系人名" prop="contract_user" min-width="120" />
      <el-table-column label="手机" prop="mobile" min-width="120" />
      <el-table-column label="地址" prop="address" min-width="200" />
      <el-table-column label="销售总额(元)" prop="sale_amount" min-width="150" />
      <el-table-column label="设为默认门店" min-width="110" align="center">
        <template slot-scope="{row}">
          <div class="default-box">
            <div v-show="row.status == 1" class="status active">使用中</div>
            <div v-show="row.status == 0" class="status">未开启</div>
            <div v-show="user_level == 1 && row.status == 1" @click="updateStatus(row.shop_code, 0)" class="btn">停用</div>
            <div v-show="user_level == 1 && row.status == 0" @click="updateStatus(row.shop_code, 1)" class="btn">启用</div>
            <div v-show="user_level != 1 && row.status == 1" class="btn disabled">停用</div>
            <div v-show="user_level != 1 && row.status == 0" class="btn disabled">启用</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120" fixed="right">
        <template slot-scope="{row}">
          <el-button type="text" @click="toEdit(2, row.shop_code)">编辑</el-button>
          <el-button type="text" @click="delData(row.shop_code)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- <div class="pagination-common">
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="now_page"
        :limit.sync="page_size"
        @pagination="getPage"
      />
    </div> -->
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import TopTitle from "@/components/TopTitle";

export default {
  name: "ShopList",
  components: { Pagination, TopTitle },
  data() {
    return {
      user_level: 2,
      user_version: 1, // 小程序版本 1单门店 2多门店
      tabList: [
        { label: "店铺列表", key: null },
      ],
      tabActive: 0,
      tabStatus: null,

      search_name: "", // 活动名

      shop_list: [],

      now_page: 1, // 当前页
      page_size: 10, // 每页条数
      total: 0, // 订单条数
      loading: false,

    };
  },
  created() {
    this.user_level = JSON.parse(localStorage.getItem('shop_data')).level;
    this.user_version = JSON.parse(localStorage.getItem('shop_data')).version;
    this.getData();
  },
  methods: {
    // 获取数据
    getData() {
      this.loading = true;
      const params = {
        name: this.search_name
      }
      this.Api.getShopList(params).then((res) => {
        if (res.data.ret === 0) {
          const shop_list = res.data.data || [];
          this.shop_list = shop_list.filter(item => {
            const status = item.status;
            return (status && status != -1) || status == 0;
          });
        } else {
          this.$message.error(`获取店铺列表失败，${res.data.msg}`);
        }
      }).catch((err) => {
        this.$message.error("网络错误");
      }).finally(() => {
        this.loading = false;
      });;
    },

    // 停用/启用
    updateStatus(shop_code, status) {
      const params = {
        shop_code,
        status
      };
      this.Api.updateShopStatus(params).then((res) => {
        if (res.data.ret == 0) {
          this.$message.success(`操作成功`);
          this.getData();
        } else {
          this.$message.error(`操作失败，${res.data.msg}`);
        }
      }).catch(err => {
        this.$message.error('网络错误');
      });
    },
    
    // 删除
    delData(shop_code) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const params = {
          shop_code,
          status: -1
        };
        this.Api.updateShopStatus(params).then((res) => {
          if (res.data.ret == 0) {
            this.$message.success(`删除成功`);
            this.getData();
          } else {
            this.$message.error(`删除失败，${res.data.msg}`);
          }
        });
      }).catch(() => {
        this.$message.error('网络错误');
      });
    },
    // 结束
    endData(id) {
      this.$confirm("是否结束?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const params = {
            token: localStorage.getItem("token"),
            shopping_group_id: id,
          };
          this.Api.endShoppingGroup(params).then((res) => {
            if (res.data.ret == 0) {
              this.$message.success(`结束成功`);
              this.getData();
            } else {
              this.$message.error(`结束失败`);
            }
          });
        })
        .catch(() => {});
    },
    // 跳转编辑页
    toEdit(type = 1, shop_code = '') {
      this.$router.push({
        path: "editShop",
        query: { type, shop_code }
      });
    },
    // 切换tab
    changeTab(tab, event) {
      const index = tab.index;
      this.tabActive = index;
      this.tabStatus = this.tabList[index].key;
      this.now_page = 1;
      this.getData();
    },
    // 搜索活动名
    searchName() {
      this.now_page = 1;
      this.getData();
    },
    //  分页
    getPage(val) {
      this.now_page = val.page;
      this.page_size = val.limit;
      this.getData();
    },
    // 设置表头样式
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return this.Fun.getRowClass(rowIndex);
    },
  },
};
</script>

<style lang="scss">
.shop-list-container {
  position: relative;

  .el-tabs--border-card > .el-tabs__content {
    padding: 8px;
  }

  .tool-box {
    position: relative;

    .search-box {
      position: absolute;
      right: 30px;
      top: 2px;
      width: 200px;
    }
    .el-tabs--card {
      .el-tabs__header {
        .el-tabs__item {
          background-color: #f7f8fa;
          border-bottom-color: #dfe4ed;
          &.is-active {
            border-bottom-color: #dfe4ed;
            background-color: #fff;
          }
        }
      }
    }
  }

  .default-box {
    display: flex;
    justify-content: center;
    align-items: center;
    .status {
      height: 20px;
      line-height: 20px;
      padding: 0 5px;
      border-radius: 3px;
      background: #999;
      color: #fff;
      font-size: 12px;
      &.active {
        background: #4090ff;
      }
    }
    .btn {
      position: relative;
      height: 20px;
      line-height: 20px;
      margin-left: 8px;
      padding-left: 8px;
      color: #4090ff;
      cursor: pointer;
      &.disabled {
        cursor: no-drop;
      }
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 2px;
        height: 16px;
        width: 1px;
        background: #eee;
      }
    }
  }
}
</style>
