<template>
  <div class="container">

    <el-form label-width="120px">
      <el-form-item label="是否开启：">
        <el-radio-group v-model="status">
          <el-radio :label="0">是</el-radio>
          <el-radio :label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="公告内容：">
        <el-button type="text" @click="addItem">新增</el-button>
        <el-table :data="noticeList" :header-cell-style="val => Fun.getRowClass(val.rowIndex)">
          <el-table-column label="内容" min-width="120">
            <template slot-scope="{row}">
              <el-input v-model="row.content" type="textarea" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center" fixed="right">
            <template slot-scope="{$index}">
              <el-button type="text" @click="delItem($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button @click="saveData()" type="primary">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "NoticeSet",
  data() {
    return {
      
      status: 0, // 是否启用  0
      noticeList: [], // 公告列表

      content: '',
      noticeVisible: false,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 获取数据
    getData() {
      this.imageLoading = true;
      this.Api.getBulletinList().then(res => {
        if (res.data.ret === 0) {
          const {status = 1, list = []} = res.data.data || {};
          this.status = status;
          this.noticeList = list;
        } else {
          this.$message.error(`获取数据失败，${res.data.msg}`);
        }
      }).finally(() => {
        this.imageLoading = false;
      })
    },

    // 保存数据
    saveData() {
      const content_list = this.noticeList.map(item => item.content);
      const data = {
        status: this.status,
        content_list
      }
      this.Api.createBulletin(data).then(res => {
        if (res.data.ret === 0) {
          this.$message.success('保存成功！');
          this.getData();
        } else {
          this.$message.error(`保存失败，${res.data.msg}`);
        }
      })
    },

    // 新增公告
    addItem() {
      this.noticeList.push({
        content: ''
      })
    },

    // 删除公告
    delItem(index) {
      this.noticeList.splice(index, 1);
    },

  }
};
</script>

<style lang="scss">
  .alert {
    color: #999;
    font-size: 12px;
    line-height: initial;
  }
</style>



