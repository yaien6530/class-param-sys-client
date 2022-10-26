

<template>
  <div class="account-config-container">
    <!-- 筛选 -->
    <el-form :inline="true">
       <el-form-item label="标题">
        <el-input v-model="filterForm.title" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="filterForm.status">
          <el-option label="下架" value="0" />
          <el-option label="上架" value="1" />
        </el-select>
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
          <img v-if="row.cover" :src="row.cover" class="img50" />
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" min-width="160" align="center" />
      <el-table-column label="介绍" prop="remark" min-width="200" align="center" />
      <el-table-column label="排序" prop="order_by" min-width="80" align="center" />
      <el-table-column label="操作" width="80" align="center">
        <template slot-scope="{row}">
          <div v-if="row.status == 0">下架</div>
          <div v-else-if="row.status == 1">上架</div>
          <div v-else-if="row.status == -1">删除</div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="create_time" min-width="170" align="center" />
      <el-table-column align="center" label="操作" width="150" fixed="right">
        <template slot-scope="{row}">
          <el-button v-if="row.status == 0" @click="updateStatus(row.recommend_id, 1)" type="text">上架</el-button>
          <el-button v-else-if="row.status == 1" @click="updateStatus(row.recommend_id, 0)" type="text">下架</el-button>
          <el-button @click="toEdit(row.recommend_id)" type="text">编辑</el-button>
          <el-button @click="updateStatus(row.recommend_id, -1)" type="text">删除</el-button>
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
        title: '',
        status: null
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
      this.Api.queryRecommend(data).then(res => {
        if (res.data.ret === 0) {
          const resData = res.data.data || {};
          this.tableList = resData.data || [];
          this.total_count = resData.total_size || 0;
        } else {
          this.$message.error(`获取用户失败，${res.data.msg}`);
        }
      }).finally(() => {
        this.getLoading = false;
      });
    },

    // 修改状态
    updateStatus(recommend_id, status) {
      let text = '';
      if (status == 1) {
        text = '上架';
      } else if (status == 0) {
        text = '下架';
      } else if (status == -1) {
        text = '删除';
      }
      this.$confirm(`是否${text}推荐`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const params = {
          recommend_id,
          status
        }
        this.Api.updateRecommendState(params).then(res => {
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
    toEdit(recommend_id = 0) {
      this.$router.push({
        path: 'recommendEdit',
        query: {recommend_id}
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
