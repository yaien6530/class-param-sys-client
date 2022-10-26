

<template>
  <div class="account-config-container">
    <!-- 筛选 -->
    <el-form :inline="true">
      <el-form-item>
        <el-button @click="openEdit()" type="primary">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table v-loading="getLoading" :data="tableList" :header-cell-style="val => Fun.getRowClass(val.rowIndex)">
      <el-table-column label="图标" align="center" width="80">
        <template slot-scope="{row}">
          <img v-if="row.img_url" :src="row.img_url" class="img50" />
        </template>
      </el-table-column>
      <el-table-column label="分类名" prop="sort_name" min-width="160" align="center" />
      <el-table-column label="状态" min-width="80" align="center">
        <template slot-scope="{row}">
          <div v-if="row.flag === 1">是</div>
          <div v-else-if="row.flag === 0">否</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180" fixed="right">
        <template slot-scope="{row}">
          <el-button @click="openEdit(row)" type="text">编辑</el-button>
          <el-button @click="updateStatus(row.attractions_sort_id)" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑 -->
    <el-dialog title="编辑" :visible.sync="dialogVisible" width="500px">
      <el-form label-width="80px">
        <el-form-item label="标签名">
          <el-input v-model="formData.sort_name" />
        </el-form-item>
        <el-form-item label="图标：">
        <div class="choose-picture-80">
          <img v-show="formData.img_url" :src="formData.img_url" class="img" />
          <p v-show="!formData.img_url"><i class="el-icon-plus icon" /></p>
          <selectSingleImage slots @successCBK="successSort">
            <template scope="{ openDetail }">
              <div class="select-image-component" @click="openDetail()" />
            </template>
          </selectSingleImage>
        </div>
        <div class="alert-box">建议尺寸：1：1</div>
      </el-form-item>
        <el-form-item label="特殊资源">
          <el-radio-group v-model="formData.flag">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import selectSingleImage from "@/components/common/selectSingleImage";
export default {
  components: { selectSingleImage },
  data() {
    return {
      filterForm: {
        name: '',
        status: null,
      },
      getLoading: false,

      tableList: [],

      formData: {},

      dialogVisible: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      this.getLoading = true;
      this.Api.getAttractionSortList().then(res => {
        if (res.data.ret === 0) {
          this.tableList = res.data.data || [];
        } else {
          this.$message.error(`获取数据失败，${res.data.msg}`);
        }
      }).finally(() => {
        this.getLoading = false;
      });
    },

    // 新增数据
    addData() {
      this.getLoading = true;
      this.Api.createOrChangeAttractionSort(this.formData).then(res => {
        if (res.data.ret === 0) {
          this.$message.success('操作成功');
          this.dialogVisible = false;
          this.getList();
        } else {
          this.$message.error(`操作失败，${res.data.msg}`);
        }
      }).finally(() => {
        this.getLoading = false;
      });
    },

    // 修改状态
    updateStatus(attractions_sort_id) {
      this.$confirm(`是否删除`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const params = {
          attractions_sort_id
        }
        this.Api.deleteAttractionSort(params).then(res => {
          if (res.data.ret === 0) {
            this.$message.success('删除成功');
            this.getList();
          } else {
            this.$message.error(`删除失败，${res.data.msg}`);
          }
        })
      }).catch(() => {})
    },

    // 打开编辑
    openEdit(item = {}) {
      item = JSON.parse(JSON.stringify(item));
      this.formData = {
        attractions_sort_id: item.attractions_sort_id || 0,
        sort_name: item.sort_name || '',
        flag: item.flag || 1,
        img_url: item.img_url || ''
      }
      this.dialogVisible = true;
    },

    successSort(val) {
      this.formData.img_url = val.url;
    }
  },
};
</script>

<style lang="scss">

</style>
