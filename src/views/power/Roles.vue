<template>
  <div>
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      class="user-breadcrumb"
    >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="roles-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="rolesList" border stripe class="roles-list">
        <!-- 展开列  展开权限 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              type="flex"
              align="middle"
              :class="['bottom-border', i === 0 ? 'top-border' : '']"
              v-for="(first, i) in scope.row.children"
              :key="first.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRight(scope.row, first.id)"
                  class="rights-tag"
                  >{{ first.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 二、三级权限 -->
              <el-col :span="19">
                <el-row
                  type="flex"
                  align="middle"
                  :class="[j === 0 ? '' : 'top-border']"
                  v-for="(second, j) in first.children"
                  :key="second.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRight(scope.row, second.id)"
                      type="success"
                      class="rights-tag"
                      >{{ second.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRight(scope.row, third.id)"
                      v-for="third in second.children"
                      :key="third.id"
                      type="warning"
                      class="rights-tag"
                      >{{ third.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" width="70" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoles(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户dialog -->
    <el-dialog title="添加" :visible.sync="addDialogVisible" width="50%">
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>

        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogCancel">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户dialog -->
    <el-dialog title="修改" :visible.sync="editDialogVisible" width="50%">
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="名称">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogCancel">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限dialog -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="resetDefKeys"
    >
      <el-tree
        :data="rightsList"
        :props="rightsTreeProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defKeys"
        ref="setTreeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogCancel">取 消</el-button>
        <el-button type="primary" @click="setRightByRolesId">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      addDialogVisible: false,
      addForm: {
        roleName: "",
        roleDesc: ""
      },
      addFormRules: {
        roleName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        roleDesc: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      editDialogVisible: false,
      editForm: {},
      setRightDialogVisible: false,
      rightsList: [],
      rightsTreeProps: {
        label: "authName",
        children: "children"
      },
      defKeys: [],
      roleId: ""
    };
  },
  methods: {
    // 获取权限列表
    async getRolesList() {
      const { data: res } = await this.$http.get(`roles`);
      this.rolesList = res.data;
    },

    /**
     * 添加角色 begin
     */
    addDialogCancel() {
      this.$refs.addFormRef.resetFields();
      this.addDialogVisible = false;
    },
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addForm);
        if (res.meta.status !== 201) {
          this.$message({
            type: "error",
            message: "添加失败!",
            duration: "1000",
            center: true
          });
        }
        this.$message({
          type: "success",
          message: "添加角色成功!",
          duration: "1000",
          center: true
        });
        this.addDialogVisible = false;
        this.getRolesList();
      });
    },
    /**
     * 添加角色 end
     */

    /**
     * 修改角色 begin
     */
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status !== 200) {
        return this.$message({
          type: "error",
          message: "获取用户信息失败!",
          duration: "1000",
          center: true
        });
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    editDialogCancel() {
      this.$refs.editFormRef.resetFields();
      this.editDialogVisible = false;
    },
    editRoles() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        await this.$http.put(`roles/${this.editForm.roleId}`, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        });
        this.editDialogVisible = false;
        this.getRolesList();
        this.$message({
          type: "success",
          message: "修改成功!",
          duration: "1000",
          center: true
        });
      });
    },
    /**
     * 修改角色 end
     */

    async removeRoles(id) {
      this.$confirm("是否删除该角色？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await this.$http.delete(`roles/${id}`);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getRolesList();
        })
        .catch(() => {});
    },

    async removeRight(role, rightId) {
      this.$confirm("是否删除该权限？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          );
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          role.children = res.data;
        })
        .catch(() => {});
    },

    /**
     * 分配权限 begin
     */
    async showSetRightDialog(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get("rights/tree");
      this.rightsList = res.data;

      this.getLeafKeys(role, this.defKeys);

      this.setRightDialogVisible = true;
    },
    setRightDialogCancel() {
      this.setRightDialogVisible = false;
    },
    async setRightByRolesId() {
      const keys = [
        ...this.$refs.setTreeRef.getCheckedKeys(),
        ...this.$refs.setTreeRef.getHalfCheckedKeys()
      ];
      const idStr = keys.join(",");
      await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr });
      this.$message({
        type: "success",
        message: "分配权限成功!"
      });
      this.getRolesList();
      this.setRightDialogVisible = false;
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => this.getLeafKeys(item, arr));
    },
    /**
     * 分配权限 end
     */

    resetDefKeys() {
      this.defKeys = [];
    }
  },
  created() {
    this.getRolesList();
  }
};
</script>

<style lang="scss" scoped>
.roles-card {
  margin-top: 0.9375rem;
  .roles-list {
    margin-top: 1rem;
    margin-bottom: 1.5rem;
  }
}
.rights-tag {
  margin: 7px;
}
.top-border {
  border-top: 1px solid #eee;
}
.bottom-border {
  border-top: 1px solid #eee;
}
</style>
