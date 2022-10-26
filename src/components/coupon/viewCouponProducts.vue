<template>
  <el-dialog
    :visible.sync="visible"
    :before-close="handleClose"
    width="1000px"
    class="dialog-common"
  >
    <div class="dialog-common-head">
      <div class="title">支持优惠券商品列表</div>
    </div>
    <el-table
      :data="productList"
      :header-cell-style="getRowClass"
      @selection-change="selectionChange"
      ref="singleTable"
      max-height="600"
      v-loading="loading"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="product_name" label="商品名" min-width="160" />
      <el-table-column prop="category" label="商品类目" min-width="180px" align="center" />
      <el-table-column label="零售价" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{row.sale_price_min}} - {{row.sale_price_max}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="store" label="现有库存" min-width="80px" align="center" />
      <el-table-column label="操作" width="80px" align="center" fixed="right">
        <template slot-scope="{row}">
          <el-button @click="delCouponProduct(row.product_id)" type="text">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="dialog-common-foot">
      <div>
        <el-button @click="delCouponProduct()" type="primary" plain :size="eleSize">批量移除</el-button>
      </div>
      <pagination v-show="total > 0" :total="total" :page.sync="now_page" :limit.sync="page_size" @pagination="getPage" />
    </div>
  </el-dialog>
</template>

<script>
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    couponId: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      productList: [],
      multipleSelection: [], // 选中的商品列表
      loading: false,
      now_page: 1, // 当前页
      page_size: 10, // 每页条数
      total: 0, // 订单条数
      eleSize: 'mini'
    };
  },
  watch: {
    visible(flag) {
      if (flag) {
        this.getCouponProduct();
      }
    }
  },
  methods: {
    // 获取优惠券商品
    getCouponProduct() {
      this.loading = true;
      const params = {
        token: localStorage.getItem('token'),
        coupon_id: this.couponId,
        current_page: this.now_page,
        page_size: this.page_size
      };
      this.Api.getCouponPorduct(params).then(res => {
        const data = res.data;
        if (data.ret === 0) {
          this.productList = data.data.data;
          this.total = data.data.total_size;
        } else {
          this.productList = [];
          this.total = 0;
          this.$message.error('获取失败！');
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    // 移除优惠券商品
    delCouponProduct(id = false) {
      const multipleSelection = this.multipleSelection;
      if (!id && multipleSelection.length == 0) {
        this.$message.error('请选择要移除的商品');
        return;
      }
      this.$confirm('是否移除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = [];
        if (id) { // 单个移除
          ids = [id];
        } else { // 多个移除
          ids = multipleSelection.map(item => {
            return item.product_id;
          });
        }

        const params = {
          token: localStorage.getItem('token'),
          coupon_id: this.couponId,
          flag: 2 // 1新增 2删除
        };
        const data = ids;
        this.Api.addDleCouponPorduct(data, params).then(res => {
          if (res.data.ret === 0) {
            this.dialog_now_page = 1;
            this.getCouponProduct();
            this.$message.success('移除成功');
          } else {
            this.$message.error('移除失败！');
          }
        });
      }).catch(() => {});
    },
    // 多选商品
    selectionChange(val) {
      this.multipleSelection = val;
    },
    // 分页
    getPage(val) {
      this.now_page = val.page;
      this.page_size = val.limit;
      this.getCouponProduct();
    },
    // 关闭弹框
    handleClose() {
      this.$emit('close');
    },
    // 设置表头样式
    getRowClass({row, column, rowIndex, columnIndex}) {
      return this.Fun.getRowClass(rowIndex);
    },
  }
};
</script>

<style scoped lang="scss">

</style>
