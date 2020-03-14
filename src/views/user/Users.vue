<template>
  <div>
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      class="user-breadcrumb"
    >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="user-card">
      <el-row :gutter="30" class="user-select">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="userList" border stripe class="user-list">
        <el-table-column type="index" width="70" label="#"> </el-table-column>
        <el-table-column prop="username" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180">
        </el-table-column>
        <el-table-column prop="role_name" label="权限" width="180">
        </el-table-column>
        <el-table-column prop="email" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <!-- 分配角色 -->
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
                @click="showSetRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        class="pagination"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户dialog -->
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%">
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogCancel">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户dialog -->
    <el-dialog title="提示" :visible.sync="editDialogVisible" width="50%">
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogCancel">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色dialog -->
    <el-dialog
      @close="resetRoleDialog"
      title="提示"
      :visible.sync="setRoleDialogVisible"
      width="50%"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          角色选项：<el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.value"
              :value="item.id"
              :label="item.roleName"
            ></el-option
          ></el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogCancel">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 邮箱验证
    let checkEmail = (rule, value, cb) => {
      const regEamil = /^(\w-*)+@(\w)+(\.\w{2,})+$/;
      if (regEamil.test(value)) {
        return cb();
      }
      cb(new Error("请输入正确的邮箱地址"));
    };

    // 电话验证
    let checkMobile = (rule, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入正确的手机号"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名应在3-10个字符内",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码应在6-15个字符内",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur"
          }
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur"
          }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      setRoleDialogVisible: false,
      userInfo: {},
      rolesList: [],
      selectRoleId: ""
    };
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        this.$message({
          type: "error",
          message: "获取用户列表失败",
          duration: "1000",
          center: true
        });
      }
      this.userList = res.data.users;
      this.total = res.data.total;
    },

    // 页码值 改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },

    // 用户状态码改变
    async userStateChange(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        this.$message({
          type: "error",
          message: "修改用户状态失败",
          duration: "1000",
          center: true
        });
      }
    },

    addDialogCancel() {
      this.$refs.addFormRef.resetFields();
      this.addDialogVisible = false;
    },

    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addForm);
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
          message: "添加用户成功!",
          duration: "1000",
          center: true
        });
        this.addDialogVisible = false;
        this.getUserList();
      });
    },

    // 修改用户
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("users/" + id);
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

    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        await this.$http.put("users/" + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        });
        this.editDialogVisible = false;
        this.getUserList();
        this.$message({
          type: "success",
          message: "修改成功!",
          duration: "1000",
          center: true
        });
      });
    },

    // 删除用户
    async removeUser(id) {
      this.$confirm("是否删除该用户？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await this.$http.delete(`users/${id}`);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getUserList();
        })
        .catch(() => {});
    },

    // 分配角色
    async showSetRoleDialog(userInfo) {
      this.userInfo = userInfo;
      const { data: res } = await this.$http.get(`roles`);
      this.rolesList = res.data;
      this.setRoleDialogVisible = true;
    },

    async saveRoleInfo() {
      if (!this.selectRoleId) return;
      await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectRoleId
      });

      this.$message({
        type: "success",
        message: "更新角色成功"
      });
      this.getUserList();
      this.setRoleDialogVisible = false;
    },
    resetRoleDialog() {
      this.selectRoleId = "";
      this.userInfo = "";
    }
  },
  created() {
    this.getUserList();
  }
};
</script>

<style lang="scss" scoped>
.user-breadcrumb {
  font-size: 0.75rem;
}
.user-card {
  margin-top: 0.9375rem;
  .user-select {
    margin-bottom: 0.9375rem;
  }
  .user-list {
    margin-bottom: 1.5rem;
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
