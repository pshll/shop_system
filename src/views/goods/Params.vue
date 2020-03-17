<template>
  <div>
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      class="user-breadcrumb"
    >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="params-card">
      <el-alert
        effect="dark"
        show-icon
        :closable="false"
        type="warning"
        title="注意：只允许为第三季分类设置相关参数"
      ></el-alert>

      <el-row class="params-select">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisable"
            @click="showAddDialog"
          >
            添加参数
          </el-button>
          <el-table :data="manyTableData" border stripe class="params-table">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  class="vals-tag"
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model.trim="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >
                  + New Tag
                </el-button>
              </template>
            </el-table-column>

            <el-table-column label="#" type="index"></el-table-column>

            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeAttr(scope.row.attr_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisable"
            @click="showAddDialog"
          >
            添加属性
          </el-button>
          <el-table :data="onlyTableData" border stripe class="params-table">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  class="vals-tag"
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model.trim="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>

            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeAttr(scope.row.attr_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数Dialog -->
    <el-dialog
      @closed="addDialogCancel"
      :title="`添加${dialogTitle}`"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <el-form
        :model="addForm"
        ref="addFormRef"
        :rules="formRules"
        label-width="6rem"
      >
        <el-form-item :label="`${dialogTitle}：`" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttr">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加参数Dialog -->
    <el-dialog
      :title="`添加${dialogTitle}`"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        :model="editForm"
        ref="editFormRef"
        :rules="formRules"
        label-width="6rem"
      >
        <el-form-item :label="`${dialogTitle}：`" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAttr">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      selectedCateKeys: [],
      activeTabName: "many",
      manyTableData: [],
      onlyTableData: [],
      formRules: {
        attr_name: [{ required: true, message: "请输入名称", trigger: "blur" }]
      },

      addDialogVisible: false,
      addForm: {
        attr_name: ""
      },

      editDialogVisible: false,
      editForm: {},

      inputVisible: false,
      inputValue: ""
    };
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      this.cateList = res.data;
    },
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeTabName }
        }
      );
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
        item.inputVisible = false;
        item.inputValue = "";
      });
      if (this.activeTabName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },

    handleChange() {
      this.getParamsData();
    },

    handleTabClick() {
      this.getParamsData();
    },

    /**
     * 添加参数或属性相关函数
     */
    showAddDialog() {
      this.addDialogVisible = true;
    },
    addDialogCancel() {
      this.$refs.addFormRef.resetFields();
      this.addDialogVisible = false;
    },
    addAttr() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeTabName
          }
        );
        if (res.meta.status === 201) {
          this.$message({
            type: "success",
            message: "添加属性成功"
          });
        }
        this.getParamsData();
        this.addDialogVisible = false;
      });
    },

    /**
     * 修改参数相关函数
     */
    async showEditDialog(attrId) {
      const {
        data: res
      } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attrId}`,
        { params: { attr_sel: this.activeTabName } }
      );
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    editAttr() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeTabName
          }
        );
        if (res.meta.status === 200) {
          this.$message({
            type: "success",
            message: "添加属性成功"
          });
        }
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },

    // 删除属性
    removeAttr(attrId) {
      this.$confirm("是否删除该属性", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await this.$http.delete(
            `categories/${this.cateId}/attributes/${attrId}`
          );
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getParamsData();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    /**
     * Tag相关的函数
     */
    async saveAttrVals(row) {
      await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(",")
        }
      );
    },
    handleInputConfirm(row) {
      if (row.inputValue === "") {
        row.inputVisible = false;
        row.inputValue = "";
        return;
      }
      row.attr_vals.push(row.inputValue);
      row.inputVisible = false;
      row.inputValue = "";
      this.saveAttrVals(row);
    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    }
  },
  computed: {
    isBtnDisable() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    dialogTitle() {
      if (this.activeTabName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    }
  },
  created() {
    this.getCateList();
  }
};
</script>

<style lang="scss" scoped>
.params-card {
  margin-top: 0.9375rem;
  .params-select {
    margin-top: 0.9375rem;
    margin-bottom: 0.9375rem;
  }
  .params-table {
    margin-top: 0.9375rem;
    .vals-tag {
      margin-right: 0.9375rem;
    }
    .input-new-tag {
      width: 90px;
    }
  }
}
</style>
