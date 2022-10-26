

<template>
  <div class="account-config-container">
    <!-- 筛选 -->
    <el-form :inline="true">
       <el-form-item label="景点名">
         <el-input v-model="filterForm.name" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="filterForm.status">
          <el-option label="不开放" :value="Number(0)" />
          <el-option label="开放" :value="Number(1)" />
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
          <img v-if="row.main_image" :src="row.main_image.url" class="img50" />
        </template>
      </el-table-column>
      <el-table-column label="景点名" prop="name" min-width="160" align="center" />
      <el-table-column label="描述" prop="description" min-width="180" align="center" />
      <el-table-column label="地址" prop="address" min-width="160" align="center" />
      <el-table-column label="状态" min-width="80" align="center">
        <template slot-scope="{row}">
          <div v-if="row.status === 1">开放</div>
          <div v-else-if="row.status === 0">不开放</div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="create_time" min-width="160" align="center" />
      <el-table-column align="center" label="操作" width="180" fixed="right">
        <template slot-scope="{row}">
          <el-button v-if="row.status == 0" @click="updateStatus(row.attractions_id, 1)" type="text">开放</el-button>
          <el-button v-else-if="row.status == 1" @click="updateStatus(row.attractions_id, 0)" type="text">不开放</el-button>
          <el-button @click="toEdit(row.attractions_id)" type="text">编辑</el-button>
          <el-button @click="updateStatus(row.attractions_id, -1)" type="text">删除</el-button>
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
      this.Api.getAttractionList(data).then(res => {
        if (res.data.ret === 0) {
          const resData = res.data.data || {};
          this.tableList = resData.data || [];
          this.total_count = resData.total_size || 0;
        } else {
          this.$message.error(`获取账号失败，${res.data.msg}`);
        }
      }).finally(() => {
        this.getLoading = false;
      });
    },

    // 修改状态
    updateStatus(attractions_id, status) {
      let text = '';
      if (status == 1) {
        text = '开放';
      } else if (status == 0) {
        text = '不开放';
      } else if (status == -1) {
        text = '删除';
      }
      this.$confirm(`是否${text}景点`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const params = {
          attractions_id,
          status
        }
        this.Api.changeAttractionStatus(params).then(res => {
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
    toEdit(attractions_id = 0) {
      this.$router.push({
        path: 'attractionEdit',
        query: {
          attractions_id
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
