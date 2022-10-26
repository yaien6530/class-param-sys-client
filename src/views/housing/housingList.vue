

<template>
  <div class="account-config-container">
    <!-- 筛选 -->
    <el-form :inline="true">
       <el-form-item label="民宿名">
         <el-input v-model="filterForm.housing_name" />
      </el-form-item>
      <el-form-item label="联系方式">
         <el-input v-model="filterForm.phone" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="filterForm.status">
          <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="filterForm.type">
          <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="filterData" type="primary">搜索</el-button>
        <el-button v-if="level != 3" @click="toEdit()" type="primary">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table v-loading="getLoading" :data="tableList" :header-cell-style="val => Fun.getRowClass(val.rowIndex)">
      <el-table-column label="主图" align="center" width="80">
        <template slot-scope="{row}">
          <img v-if="row.img_url" :src="row.img_url" class="img50" />
        </template>
      </el-table-column>
      <el-table-column label="民宿名称" prop="housing_name" min-width="160" align="center" />
      <el-table-column label="联系电话" prop="phone" min-width="160" align="center" />
      <el-table-column label="地址" prop="address" min-width="160" align="center" />
      <el-table-column label="价格" prop="money" min-width="160" align="center" />
      <el-table-column label="创建时间" prop="create_time" min-width="170" align="center" />
      <el-table-column label="状态" min-width="80" align="center">
        <template slot-scope="{row}">
          <div v-for="item in statusList" :key="item.value" v-if="row.status === item.value">{{item.label}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="right" fixed="right">
        <template slot-scope="{row}">
          <el-button v-if="row.status == 0" @click="updateStatus(row.housing_id, 1)" type="text">正常营业</el-button>
          <el-button v-else-if="row.status == 1" @click="updateStatus(row.housing_id, 0)" type="text">不营业</el-button>
          <el-button @click="toEdit(row.housing_id)" type="text">编辑</el-button>
          <el-button @click="updateStatus(row.housing_id, -1)" type="text">删除</el-button>
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
      level: 2,

      filterForm: {
        housing_name: '', // 民宿名
        merchant_name: '', // 商家名
        phone: '', // 联系方式
        status: null, // 状态
        type: null, // 类型
      },
      getLoading: false,

      statusList: [
        {value: 1, label: '正常营业'},
        {value: 0, label: '不营业'},
      ],
      typeList: [
        {value: 0, label: '酒店'},
        {value: 1, label: '民宿'},
        {value: 2, label: '民俗户'},
      ],

      tableList: [],

      now_page: 1, // 当前页
      page_size: 10, // 每页条数
      total_count: 0, // 总条数
    };
  },
  created() {
    this.level = localStorage.getItem('level');
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
      this.Api.getHousingtList(data).then(res => {
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
    updateStatus(housing_id, status) {
      let text = '';
      if (status == 1) {
        text = '正常营业';
      } else if (status == 0) {
        text = '不营业';
      } else if (status == -1) {
        text = '删除';
      }
      this.$confirm(`是否${text}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const params = {
          housing_id,
          status
        }
        this.Api.changeHousingtStatus(params).then(res => {
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
    toEdit(housing_id = 0) {
      this.$router.push({
        path: 'housingEdit',
        query: {
          housing_id
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
