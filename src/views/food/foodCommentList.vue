

<template>
  <div class="account-config-container">
    <!-- 筛选 -->
    <el-form :inline="true">
       <el-form-item label="商家名">
         <el-input v-model="filterForm.merchant_name" />
      </el-form-item>
      <el-form-item>
        <el-button @click="filterData" type="primary">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table v-loading="getLoading" :data="tableList" :header-cell-style="val => Fun.getRowClass(val.rowIndex)">
      <el-table-column label="评论头像" align="center" width="80">
        <template slot-scope="{row}">
          <img v-if="row.avatar" :src="row.avatar" class="img50" />
        </template>
      </el-table-column>
      <el-table-column label="评论者" prop="nick_name" min-width="120" align="center" />
      <el-table-column label="评论内容" prop="comment" min-width="160" align="center" />
      <el-table-column label="商家名称" prop="merchant_name" min-width="160" align="center" />
      <el-table-column label="联系电话" prop="phone" min-width="120" align="center" />
      <el-table-column label="评论时间" prop="create_time" min-width="170" align="center" />
      <el-table-column align="center" label="操作" width="80" fixed="right">
        <template slot-scope="{row}">
          <el-button @click="updateStatus(row.gourmet_merchant_comment_id)" type="text">删除</el-button>
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
        merchant_name: '',
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
      this.Api.getGourmetMerchantCommentList(data).then(res => {
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
    updateStatus(gourmet_merchant_comment_id) {
      this.$confirm(`是否删除评论`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const params = {
          gourmet_merchant_comment_id,
        }
        this.Api.deleteGourmetMerchantComment(params).then(res => {
          if (res.data.ret === 0) {
            this.$message.success('操作成功');
            this.getList();
          } else {
            this.$message.error(`操作失败，${res.data.msg}`);
          }
        })
      }).catch(() => {})
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
