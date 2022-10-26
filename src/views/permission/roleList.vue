<template>
  <div class="role-config-container">
    <div class="top">
      <el-button @click="openCreate">创建角色</el-button>
    </div>
    <el-table :data="role_list" v-loading="role_list_loading" :header-cell-style="val => Fun.getRowClass(val.rowIndex)">
      <el-table-column label="角色名称" prop="role_name" align="center" min-width="150" />
      <el-table-column label="角色描述" prop="description" align="center" min-width="150" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="openSetMenu(scope.row.role_id)">编辑权限</el-button>
          <el-button size="small" type="text" @click="deleteRole(scope.row.role_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="创建新的角色"
      :visible.sync="create_visible"
      width="500px"
      :before-close="closeCreate"
    >
      <el-form
        ref="createRoleForm"
        :inline="true"
        :model="create_role_form"
        label-width="80px"
        class="edit-menu-form"
      >
        <el-form-item
          label="角色名称"
          prop="role_name"
          :rules="[{ required: true, message: '请填写角色名称', trigger: 'blur' }]"
        >
          <el-input v-model="create_role_form.role_name" style="width: 320px;" />
        </el-form-item>
        <el-form-item label="说明备注">
          <el-input v-model="create_role_form.remark" style="width: 320px;" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeCreate">取 消</el-button>
        <el-button type="primary" @click="createRole">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 编辑权限 -->
    <editMenu :visible="edit_visible" :curId="curRoleId" @close="closeMenu" @confirm="confirmMenu" />
  </div>
</template>

<script>
import editMenu from "./components/editMenu.vue";

export default {
  name: "RoleConfig",
  components: { editMenu },
  data() {
    return {
      user_level: 2,
      create_visible: false,
      edit_visible: false,

      role_list_loading: false,

      role_list: [
        {
          remark: "string",
          role_id: 0,
          role_name: "string",
        },
      ],
      create_role_form: {
        role_id: null,
        role_name: "",
        remark: "",
      },
      active_menu_list: [
        {
          menu_id: 1,
          menu_name: "用户管理",
          menu_url: "xxxxx",
          parent_id: 0,
          used_flag: true,
          list: [
            {
              menu_id: 2,
              menu_name: "用户列表",
              menu_url: "xxxxx",
              parent_id: 1,
              used_flag: true,
              list: [
                {
                  menu_id: 3,
                  menu_name: "用户明细",
                  menu_url: "xxxxx",
                  parent_id: 2,
                  used_flag: true,
                },
              ],
            },
            {
              menu_id: 4,
              menu_name: "用户提现",
              menu_url: "xxxxx",
              parent_id: 1,
              used_flag: true,
            },
          ],
        },
      ],

      curRoleId: 0,
    };
  },
  created() {
    this.user_level = JSON.parse(localStorage.getItem('shop_data')).level;
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    // 获取角色列表 - api
    getRoleList() {
      this.role_list_loading = true;
      this.Api.getRoleList().then(res => {
        if (res.data.ret == 0) {
          this.role_list = res.data.data;
        } else {
          this.$message.error(`获取角色列表失败，${res.data.msg}`);
        }
      }).catch(err => {
        this.$message.error('网络错误');
      }).finally(() => {
        this.role_list_loading = false;
      });
    },
    // 创建角色 - api
    createRole() {
      this.$refs['createRoleForm'].validate(valid => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.create_role_form));
          data.description = data.remark;
          data.menu_list = [];

          this.Api.addOrChangeRole(data).then(res => {
            if (res.data.ret === 0) {
              this.$message.success('创建成功！');
              this.create_visible = false;
              this.getRoleList();
            } else {
              this.$message.error(`创建失败，${res.data.msg}`);
            }
          }).catch(err => {
            this.$message.error('网络错误');
          });
        }
      });
    },
    // 删除角色 - api
    deleteRole(role_id) {
      this.$confirm("确定删除角色？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const data = { role_id }
        this.Api.deleteRole(data).then(res => {
          if (res.data.ret === 0) {
            this.$message.success('删除成功！');
            this.getRoleList();
          } else {
            this.$message.error(`删除失败，${res.data.msg}`);
          }
        }).catch(err => {
          this.$message.error('网络错误');
        });
      }).catch(() => {});
    },
    // 绑定角色 - api
    setRoleMenu() {
      const data = {};
      this.Api.setRoleMenu(data)
        .then(res => {
          console.log();
        })
        .catch(err => {
          this.$message.error('网络错误');
        });
    },
    // 打开编辑弹窗
    openSetMenu(id) {
      this.curRoleId = id || null;
      this.edit_visible = true;
    },
    // 关闭编辑弹窗
    closeMenu() {
      this.edit_visible = false;
    },
    // 确认编辑弹窗
    confirmMenu() {
      this.edit_visible = false;
      this.getRoleList();
    },
    // 打开创建弹窗
    openCreate() {
      this.create_visible = true;
      this.create_role_form = {
        role_id: null,
        role_name: '',
        remark: '',
      };
      this.$nextTick(() => {
        this.$refs.createRoleForm.clearValidate();
      })
    },
    // 关闭创建弹窗
    closeCreate() {
      this.create_visible = false;
    },
  },
};
</script>

<style lang="scss">
.role-config-container {
  .top {
    margin-bottom: 10px;
  }
}
</style>
