
<template>
  <el-dialog title="选择美食推文" :visible.sync="visible" @before-close="handleClose" width="600px" top="3vh">
    <!-- 筛选 -->
    <el-form :inline="true">
       <el-form-item label="标题">
        <el-input v-model="filterForm.title" />
      </el-form-item>
      <el-form-item>
        <el-button @click="filterData" type="primary">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table v-loading="getLoading" :data="tableList" :header-cell-style="val => Fun.getRowClass(val.rowIndex)">
      <el-table-column label="主图" align="center" width="80">
        <template slot-scope="{row}">
          <img v-if="row.img_url" :src="row.img_url" class="img50" />
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" min-width="160" align="center" />
      <el-table-column label="价格" prop="money" min-width="160" align="center" />
      <el-table-column label="创建时间" prop="create_time" min-width="170" align="center" />
      <el-table-column align="center" label="操作" width="100" fixed="right">
        <template slot-scope="{row}">
          <el-button @click="singleChange(row)" type="text">{{singleSelection.gourmet_tweets_id == row.gourmet_tweets_id ? '已' : ''}}选择</el-button>
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

    <div slot="footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Pagination from "@/components/Pagination";
export default {
  name: 'SelectTweets',
  components: { Pagination },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.getList();
      }
    }
  },
  data() {
    return {
      getLoading: false,

      filterForm: {
        title: '',
        status: 1
      },

      tableList: [], // 列表


      singleSelection: {},

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
      this.Api.getGourmetTweetsList(data).then(res => {
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

    // 单选
    singleChange(val) {
      this.singleSelection = val;
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

    // 取消
    handleClose() {
      this.$emit('close', false);
    },
    // 确认
    handleSubmit() {
      this.$emit('submit', this.singleSelection);
    },

  },
};

</script>

<style lang="scss" scoped>
  .filter-box {
    margin-bottom: 20px;

    .title {
      margin: 20px 0 10px;
      font-size: 14px;
      color: #4090ff;
    }

    .bg {
      overflow: hidden;
      padding: 10px 10px 0;
      background: #f7f8fa;
    }

    .el-form-item {
      margin-bottom: 10px !important;
    }

    .el-form-item__label {
      padding-right: 5px !important;
    }
  }
  .w150 {
    width: 150px;
  }
  .w190 {
    width: 190px;
  }
  .w220 {
    width: 220px;
  }
  .tool-box {
    margin-bottom: 20px;
  }

  .img {
    width: 50px;
    height: 50px;
  }
</style>