<template>
  <div>
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      class="user-breadcrumb"
    >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="rights-card">
      <el-table :data="rightsList" border stripe class="rights-list">
        <el-table-column label="#" width="70" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success"
              >二级</el-tag
            >
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    };
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      const { data: res } = await this.$http.get(`rights/list`);
      this.rightsList = res.data;
    }
  },
  created() {
    this.getRightsList();
  }
};
</script>

<style lang="scss" scoped>
.rights-card {
  margin-top: 0.9375rem;
  .rights-list {
    margin-bottom: 1.5rem;
  }
}
</style>
