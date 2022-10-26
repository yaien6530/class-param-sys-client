

<template>
  <div class="account-config-container">
    <!-- 筛选 -->
    <el-form :inline="true">
       <el-form-item label="路线名">
         <el-input v-model="filterForm.name" />
      </el-form-item>
      <el-form-item>
        <el-button @click="filterData" type="primary">搜索</el-button>
        <el-button @click="toEdit()" type="primary">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table v-loading="getLoading" :data="tableList" :header-cell-style="val => Fun.getRowClass(val.rowIndex)">
      <el-table-column label="封面图" align="center" width="80">
        <template slot-scope="{row}">
          <img v-if="row.image_url" :src="row.image_url" class="img50" />
        </template>
      </el-table-column>
      <el-table-column label="路线名" prop="name" min-width="160" align="center" />
      <el-table-column label="简介" prop="description" min-width="180" align="center" />
      <el-table-column label="标签" min-width="80" align="center">
        <template slot-scope="{row}">
          <div v-for="item in row.tag_list" :key="item">{{item}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120" fixed="right">
        <template slot-scope="{row}">
          <el-button @click="toEdit(row.route_id)" type="text">编辑</el-button>
          <el-button @click="delItem(row.route_id)" type="text">删除</el-button>
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
        status: null,
      },
      getLoading: false,

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
      this.Api.getRouteList(data).then(res => {
        if (res.data.ret === 0) {
          const resData = res.data.data || {};
          this.tableList = resData.data || [];
          this.total_count = resData.total_size || 0;
        } else {
          this.$message.error(`获取路线失败，${res.data.msg}`);
        }
      }).finally(() => {
        this.getLoading = false;
      });
    },

    // 删除
    delItem(route_id) {
      this.$confirm(`是否删除路线`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const params = {
          route_id
        }
        this.Api.deleteRoute(params).then(res => {
          if (res.data.ret === 0) {
            this.$message.success('删除成功');
            this.getList();
          } else {
            this.$message.error(`删除失败，${res.data.msg}`);
          }
        })
      }).catch(() => {})
    },

    // 跳转编辑
    toEdit(route_id = 0) {
      this.$router.push({
        path: 'routeEdit',
        query: {
          route_id
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
