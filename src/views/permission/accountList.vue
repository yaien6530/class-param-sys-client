<template>
  <div class="account-config-container">
    <!-- 筛选 -->
    <el-form :inline="true">
      <el-form-item>
        <el-button @click="openAdmin()">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table v-loading="getLoading" :data="adminList" :header-cell-style="val => Fun.getRowClass(val.rowIndex)">
      <el-table-column label="登录名" prop="account" min-width="120" />
      <el-table-column label="等级" align="center" min-width="120">
        <template slot-scope="{row}">
          <div v-if="row.level == 1">超级管理员</div>
          <div v-else-if="row.level == 2">普通管理员</div>
          <div v-else-if="row.level == 3">商家运维人员</div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="create_time" min-width="160" align="center" />
      <el-table-column label="更新时间" prop="update_time" min-width="160" align="center" />
      <el-table-column align="center" label="操作" width="120" fixed="right">
        <template slot-scope="{row}">
          <el-button @click="openAdmin(row)" type="text">编辑</el-button>
          <el-button @click="delAdmin(row.admin_id)" type="text">删除</el-button>
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

    <!-- 编辑账号 -->
    <el-dialog title="编辑账号" :visible.sync="accountVisible" width="800px">
      <el-form ref="createForm" :rules="rules" :model="accountForm" label-width="100px" class="account-dialog">
        <el-form-item label="登录名：" prop="account">
          <el-input v-model="accountForm.account" :disabled="Boolean(accountForm.admin_id)" @input="getUserName" class="w280" />
        </el-form-item>
        <el-form-item label="登录密码：" :prop="accountForm.admin_id ? '' : 'password'">
          <el-input v-model="accountForm.password" :placeholder="accountForm.admin_id ? '旧密码已隐藏，仅修改密码时需填写' : ''" @input="getPassword" class="w280" />
        </el-form-item>
        <el-form-item label="角色：">
          <el-select v-model="accountForm.role_id" placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.role_id" :label="item.role_name" :value="item.role_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="级别：" prop="level">
          <el-radio-group v-model="accountForm.level">
            <el-radio :label="Number(2)">管理员</el-radio>
            <el-radio :label="Number(3)">商家运维人员</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="accountForm.level == 3">
          <el-form-item label="美食商家：" prop="gourmet_list">
            <el-button @click="openShop(1)" type="text">新增</el-button>
            <el-table v-loading="getLoading" :data="accountForm.gourmet_list" :header-cell-style="val => Fun.getRowClass(val.rowIndex)" max-height="300px">
              <el-table-column label="店铺图片" width="80" align="center">
                <template slot-scope="{row}">
                  <img v-if="row.img_url" :src="row.img_url" class="img50" />
                </template>
              </el-table-column>
              <el-table-column label="店铺名" prop="shop_name" min-width="160" align="center" />
              <el-table-column label="联系方式" prop="phone" min-width="200" align="center" />
              <el-table-column align="center" label="操作" width="120" fixed="right">
                <template slot-scope="{$index}">
                  <el-button @click="delShop($index, 'gourmet_list')" type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="民宿商家：" prop="housing_list">
            <el-button  @click="openShop(2)" type="text">新增</el-button>
            <el-table v-loading="getLoading" :data="accountForm.housing_list" :header-cell-style="val => Fun.getRowClass(val.rowIndex)" max-height="300px">
              <el-table-column label="店铺图片" width="80" align="center">
                <template slot-scope="{row}">
                  <img v-if="row.img_url" :src="row.img_url" class="img50" />
                </template>
              </el-table-column>
              <el-table-column label="店铺名" prop="shop_name" min-width="160" align="center" />
              <el-table-column label="联系方式" prop="phone" min-width="200" align="center" />
              <el-table-column align="center" label="操作" width="120" fixed="right">
                <template slot-scope="{$index}">
                  <el-button @click="delShop($index, 'housing_list')" type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="accountVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdmin">保 存</el-button>
      </div>
    </el-dialog>
    
    <SelectShop :visible="shopVisible" :type="shopType" @close="shopVisible = false" @submit="selectShop"  />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import SelectShop from "@/components/common/selectShop";
export default {
  name: "AccountList",
  components: { Pagination, SelectShop },
  data() {
    return {
      rules: {
        account: [
          { required: true, message: "请输入登录名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请设置登录密码", trigger: "blur" },
        ],
        level: [
          { required: true, message: "请选择级别", trigger: "blur" }
        ]
      },

      getLoading: false,

      adminList: [], // 账号列表
      roleList: [], // 角色列表
      accountForm: { // 编辑账号弹窗
        admin_id: 0,
        account: '', // 账号
        level: 2, // 2-管理员 3-商家运维人员
        password: '', // 密码
        role_id: 0,
        role_name: '',
        gourmet_list: [], // 美食商家 level为3时选填
        housing_list: [], // 民宿商家 level为3时选填
      },
      accountVisible: false,
      accountLoading: false,
      shopVisible: false,
      shopType: 1, // 选择店铺类型

      now_page: 1, // 当前页
      page_size: 10, // 每页条数
      total_count: 0, // 总条数
    };
  },
  created() {
    this.getAdminList();
    this.getRoleList();
  },
  methods: {
    // 获取账号列表
    getAdminList() {
      const data = {
        page: this.now_page,
        page_size: this.page_size,
      }
      this.getLoading = true;
      this.Api.getAdminList(data).then(res => {
        if (res.data.ret === 0) {
          const resData = res.data.data || {};
          this.adminList = resData.data || [];
          this.total_count = resData.total_size || 0;
        } else {
          this.$message.error(`获取账号失败，${res.data.msg}`);
        }
      }).finally(() => {
        this.getLoading = false;
      });
    },

    // 获取角色列表
    getRoleList() {
      this.Api.getRoleList().then(res => {
        if (res.data.ret == 0) {
          this.roleList = res.data.data;
        } else {
          this.$message.error(`获取角色列表失败，${res.data.msg}`);
        }
      }).catch(err => {
        this.$message.error('网络错误');
      }).finally(() => {
      });
    },

    // 获取账号详情
    getAdminDetail(admin_id) {
      const data = {
        admin_id
      }
      this.accountLoading = true;
      this.Api.getAdminDetail(data).then(res => {
        if (res.data.ret === 0) {
          const resData = res.data.data;
          this.accountForm = {
            admin_id: resData.admin_id || 0,
            account: resData.account || '',
            password: '',
            level: resData.level || 2,
            role_id: resData.role_id || null,
            gourmet_list: resData.gourmet_list || [],
            housing_list: resData.housing_list || []
          };

        } else {
          this.$message.error(`获取账号失败，${res.data.msg}`);
        }
      }).finally(() => {
        this.accountLoading = false;
      });
    },

    // 保存账号
    saveAdmin() {
      this.$refs['createForm'].validate(valid => {
        if (!valid) return;
        let accountForm = JSON.parse(JSON.stringify(this.accountForm));

        if (accountForm.password === '') {
          delete accountForm.password;
        }

        accountForm.gourmet_ids = accountForm.gourmet_list.map(item => item.shop_id);
        accountForm.housing_ids = accountForm.housing_list.map(item => item.shop_id);
        
        this.Api.addOrChangeAdmin(accountForm).then(res => {
          if (res.data.ret === 0) {
            this.$message.success('保存成功！');
            this.getAdminList();
            this.accountVisible = false;
          } else {
            this.$message.error(`保存失败，${res.data.msg}`);
          }
        })
      });
    },

    // 删除管理员
    delAdmin(admin_id) {
      this.$confirm("是否删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const params = {
          admin_id
        }
        this.Api.deleteAdmin(params).then(res => {
          if (res.data.ret === 0) {
            this.$message.success('删除成功');
            this.getAdminList();
          } else {
            this.$message.error(`删除失败，${res.data.msg}`);
          }
        })
      }).catch(() => {})
    },

    // 打开账号弹窗
    openAdmin(row = {}) {
      const admin_id = row.admin_id || 0;
      if (admin_id) {
        this.getAdminDetail(admin_id);
      } else {
        this.accountForm = {
          admin_id: row.admin_id || 0,
          account: row.account || '',
          password: '',
          level: row.level || 2,
          role_id: row.role_id || null,
          gourmet_list: row.gourmet_list || [],
          housing_list: row.housing_list || [],
        };
      }
      this.accountVisible = true;
    },

    // 打开店铺
    openShop(type) {
      this.shopType = type;
      this.shopVisible = true;
    },
    // 选择店铺
    selectShop(list) {
      const prop = this.shopType == 1 ? 'gourmet_list' : 'housing_list';
      list = list.filter(item => {
        return this.accountForm[prop].every(subitem => {
          return item.shop_id != subitem.shop_id;
        })
      })
      this.accountForm[prop] = this.accountForm[prop].concat(list);
      this.shopVisible = false;
    },
    // 删除店铺
    delShop(index, prop) {
      this.accountForm[prop].splice(index, 1);
    },

    // 分页
    handleChangePage(e) {
      this.now_page = e.page;
      this.page_size = e.limit;
      this.getAdminList();
    },

    getUserName() {
      this.accountForm.account = this.accountForm.account.replace(
        /^\s*|\s*$/g,
        ""
      );
      console.log("登录名：", this.accountForm.account);
    },
    
    getPassword() {
      this.accountForm.password = this.accountForm.password.replace(
        /^\s*|\s*$/g,
        ""
      );
      var reg = /[\u4E00-\u9FA5]/g;
      this.accountForm.password = this.accountForm.password.replace(reg, "");
      this.accountForm.password = this.accountForm.password.replace(
        /[\'\"\\\/\b\f\n\r\t]/g,
        ""
      );
      this.accountForm.password = this.accountForm.password.replace(
        /[\^\*\{\}\:\：\"\<\>\？\?\“\”\。]/,
        ""
      );
      console.log("密码：", this.accountForm.password);
    },

  },
};
</script>

<style lang="scss">

.w280 {
  width: 280px;
}

</style>
