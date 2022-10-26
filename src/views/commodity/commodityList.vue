

<template>
  <div class="account-config-container">
    <!-- 筛选 -->
    <el-form :inline="true">
       <el-form-item label="商品名">
         <el-input v-model="filterForm.name" />
      </el-form-item>
      <el-form-item label="商家电话">
         <el-input v-model="filterForm.phone" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="filterForm.status">
          <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="filterData" type="primary">搜索</el-button>
        <el-button @click="toEdit()" type="primary">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table v-loading="getLoading" :data="tableList" :header-cell-style="val => Fun.getRowClass(val.rowIndex)">
      <el-table-column label="主图" align="center" width="80">
        <template slot-scope="{row}">
          <img v-if="row.head_img_url" :src="row.head_img_url" class="img50" />
        </template>
      </el-table-column>
      <el-table-column label="商品名" prop="commodity_name" min-width="160" align="center" />
      <el-table-column label="价格" prop="money" min-width="120" align="center" />
      <el-table-column label="商家电话" prop="phone" min-width="180" align="center" />
      <el-table-column label="创建时间" prop="create_time" min-width="170" align="center" />
      <el-table-column label="状态" min-width="80" align="center">
        <template slot-scope="{row}">
          <div v-for="item in statusList" :key="item.value" v-if="row.status === item.value">{{item.label}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="right" fixed="right">
        <template slot-scope="{row}">
          <el-button v-if="row.status == 0" @click="updateStatus(row.commodity_id, 1)" type="text">上架</el-button>
          <el-button v-else-if="row.status == 1" @click="updateStatus(row.commodity_id, 0)" type="text">下架</el-button>
          <el-button @click="toEdit(row.commodity_id)" type="text">编辑</el-button>
          <el-button @click="updateStatus(row.commodity_id, -1)" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total_count > 0"
      :total="total_count"
      :page.sync="now_page"
      :limit.sync="page_size"
      @pagination="handleChangePage"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  data() {
    return {
      filterForm: {
        name: '',
        phone: '',
        status: null,
      },
      getLoading: false,

      statusList: [
        {value: 1, label: '上架'},
        {value: 0, label: '下架'},
      ],

      tableList: [],

      now_page: 1, // 当前页
      page_size: 10, // 每页条数
      total_count: 0, // 总条数
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      const data = {
        ...this.filterForm,
        page: this.now_page,
        page_size: this.page_size,
      }
      this.getLoading = true;
      this.Api.getCommodityList(data).then(res => {
        if (res.data.ret === 0) {
          const resData = res.data.data || {};
          this.tableList = resData.data || [];
          this.total_count = resData.total_size || 0;
        } else {
          this.$message.error(`获取数据失败，${res.data.msg}`);
        }
      }).finally(() => {
        this.getLoading = false;
      });
    },

    // 修改状态
    updateStatus(commodity_id, status) {
      let text = '';
      if (status == 1) {
        text = '上架';
      } else if (status == 0) {
        text = '下架';
      } else if (status == -1) {
        text = '删除';
      }
      this.$confirm(`是否${text}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const params = {
          commodity_id,
          status
        }
        this.Api.changeCommodityStatus(params).then(res => {
          if (res.data.ret === 0) {
            this.$message.success('操作成功');
            this.getList();
          } else {
            this.$message.error(`操作失败，${res.data.msg}`);
          }
        })
      }).catch(() => {})
    },

    // 跳转编辑
    toEdit(commodity_id = 0) {
      this.$router.push({
        path: 'commodityEdit',
        query: {
          commodity_id
        }
      })
    },

    // 筛选数据
    filterData() {
      this.now_page = 1;
      this.getList();
    },

    // 分页
    handleChangePage(e) {
      this.now_page = e.page;
      this.page_size = e.limit;
      this.getList();
    },


  },
};
</script>

<style lang="scss">

</style>
