<template>
  <div class="edit-menu-container">
    <el-dialog
      title="编辑角色详情"
      :visible.sync="visible"
      width="880px"
      :before-close="close"
      top="5vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div v-loading="getLoading">
        <el-form
          ref="editMenu"
          :inline="true"
          :model="roleDetail"
          label-width="80px"
          class="edit-menu-form"
        >
          <el-form-item
            label="角色名称"
            prop="role_name"
            :rules="[{ required: true, message: '请填写角色名称', trigger: 'blur' }]"
          >
            <el-input v-model="roleDetail.role_name" />
          </el-form-item>
          <el-form-item label="说明备注">
            <el-input v-model="roleDetail.remark" />
          </el-form-item>
        </el-form>
        <div class="form-label-title">菜单权限</div>
        <div class="menu-content">
          <div v-for="(ff,f_index) in roleDetail.menu_list" :key="f_index" class="first-menu">
            <div class="menu-title">
              <span
                class="select-box"
                :class="{selected: ff.used_flag}"
                @click="handleSelect(ff, true)"
              />
              <p class="title-text first-title" @click="handleSelect(ff, true)">{{ ff.menu_name }}</p>
              <el-button
                v-if="ff.used_flag"
                type="text"
                class="all-select"
                @click="selectAll(ff)"
              >全选</el-button>
            </div>
            <div class="second-menu">
              <div v-if="!ss.hidden" v-for="(ss,s_index) in ff.list" :key="s_index" class="menu-title">
                <span
                  class="select-box"
                  :class="{selected: ss.used_flag}"
                  @click="handleSelect(ss, false, ff)"
                />
                <p class="title-text" @click="handleSelect(ss, false, ff)">{{ ss.menu_name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="updateRole" :loading="setLoading">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EditMenu",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    curId: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      roleDetail: {},
      getLoading: false,
      setLoading: false,
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.getRoleDetail();
        this.$nextTick(() => {
          this.$refs.editMenu.clearValidate();
        })
      }
    }
  },
  methods: {
    // 获取角色详情 - api
    getRoleDetail() {
      this.getLoading = true;
      const data = {
        role_id: this.curId
      };
      this.Api.getRoleDetail(data).then(res => {
        if (res.data.ret === 0) {
          const roleDetail = res.data.data || {};
          roleDetail.remark = roleDetail.description;
          this.roleDetail = roleDetail;
        } else {
          this.$message.error(`获取角色详情失败，${res.data.msg}`);
        }
      }).catch(err => {
        this.$message.error("网络错误");
      }).finally(() => {
        this.getLoading = false;
      });
    },
    // 更新角色 - api
    updateRole() {
      this.$refs['editMenu'].validate((valid) => {
        if (valid) {
          this.setLoading = true;
          this.Api.addOrChangeRole(this.roleDetail).then(res => {
            if (res.data.ret === 0) {
              this.$message.success('保存成功！');
              this.confirm();
            } else {
              this.$message.error(`保存失败，${res.data.msg}`);
            }
          }).catch(err => {
            this.$message.error('网络错误');
          }).finally(() => {
            this.setLoading = false;
          });
        }
      });
    },
    close() {
      this.$emit("close");
    },
    confirm() {
      this.$emit("confirm");
    },
    handleSelect(item, first, ff) {
      item.used_flag = !item.used_flag;
      if (first) {
        if (!item.used_flag) {
          item.list.map((ii) => {
            ii.used_flag = false;
          });
        }
      } else {
        ff.used_flag = true;
      }
    },
    selectAll(item) {
      if (item.used_flag) {
        item.list.map((ii) => {
          ii.used_flag = true;
        });
      }
    },
  },
};
</script>

<style lang="scss">
.edit-menu-container {
  .el-dialog__body {
    padding: 10px 20px;
  }
  .edit-menu-form {
    .el-input {
      width: 320px;
    }
  }
  .form-label-title {
    text-align: right;
    vertical-align: middle;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
    width: 80px;
    font-weight: 700;
    position: relative;
    bottom: 5px;
  }
  .menu-content {
    width: 100%;
    max-height: 600px;
    min-height: 200px;
    overflow-y: auto;

    .first-menu {
      width: 100%;
      min-height: 100px;
      background-color: #f8f8f8;
      margin-bottom: 10px;
      padding-left: 20px;

      .menu-title {
        height: 40px;
        /*background-color: #eee;*/
        display: flex;
        align-items: center;
        align-content: center;
        position: relative;

        span.select-box {
          width: 20px;
          height: 20px;
          border: 1px solid #2a82e4;
          background-color: #fff;
          cursor: pointer;
          &.selected {
            background-color: #2a82e4;
          }
        }

        p.title-text {
          font-size: 14px;
          color: #555;
          padding-left: 10px;
          line-height: 20px;
          cursor: pointer;
          &.first-title {
            font-size: 15px;
            color: #222;
          }
        }
        .all-select {
          margin-left: 15px;
          padding-left: 5px;
          padding-right: 5px;
        }
      }

      .second-menu {
        width: 100%;
        overflow: hidden;
        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        padding-left: 10px;

        .menu-title {
          padding: 0 16px;
        }
      }
    }
  }
}
</style>
