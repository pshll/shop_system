<template>
  <div>
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      class="user-breadcrumb"
    >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="add-card">
      <el-alert
        style="margin-bottom: 1.5rem;"
        type="info"
        title="添加商品信息"
        show-icon
        center
      ></el-alert>

      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addGoodsForm"
        :rules="addGoodsFormRules"
        ref="addGoodsFormRef"
        label-width="100px"
        label-position="left"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="tabsChange"
          @tab-click="tabsClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称：" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>

            <el-form-item label="商品价格：" prop="goods_price">
              <el-input
                v-model="addGoodsForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>

            <el-form-item label="商品重量：" prop="goods_weight">
              <el-input
                v-model="addGoodsForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>

            <el-form-item label="商品数量：" prop="goods_number">
              <el-input
                v-model="addGoodsForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>

            <el-form-item label="商品名称：" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>

            <el-form-item label="商品分类：" prop="goods_name">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTableList"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <br />
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  class="attr-checkbox"
                  border
                  v-for="(val, i) in item.attr_vals"
                  :key="i"
                  :label="val"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableList"
              :label="item.attr_name + ' ：'"
              :key="item.attr_id"
              label-width="200px"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="uploadPreview"
              :on-remove="uploadRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
            <div class="AddBtn">
              <el-button type="primary" @click="submitForm">添加商品</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览Dialog -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img style="width: 100%" :src="previewPath" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  data() {
    return {
      cateList: [],
      cateProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      activeIndex: "0",
      addGoodsForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: []
      },
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" }
        ]
      },
      manyTableList: [],
      onlyTableList: [],
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      headerObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      previewPath: "",
      previewVisible: false
    };
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get(`categories`);
      this.cateList = res.data;
    },

    handleChange() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = [];
      }
    },

    /**
     * tabs切换相关函数
     */
    tabsChange(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message({
          type: "error",
          message: "请选择商品分类"
        });
        return false;
      }
    },
    async tabsClicked() {
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" }
          }
        );
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
        });
        this.manyTableList = res.data;
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" }
          }
        );
        this.onlyTableList = res.data;
      }
    },

    /**
     * upload上传图片相关函数
     */
    // 图片预览
    uploadPreview(file) {
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    // 图片移除
    uploadRemove(file) {
      const filePath = file.response.data.tmp_path;
      const i = this.addGoodsForm.pics.findIndex(x => {
        x.pic === filePath;
      });
      this.addGoodsForm.pics.splice(i, 1);
    },
    // 图片上传成功
    uploadSuccess(response) {
      const picInfo = { pic: response.data.tmp_path };
      this.addGoodsForm.pics.push(picInfo);
    },

    submitForm() {
      this.$refs.addGoodsFormRef.validate(async valid => {
        if (!valid) {
          return this.$message({
            type: "error",
            message: "请填写必要的表单项"
          });
        }
        const form = _.cloneDeep(this.addGoodsForm);
        form.goods_cat = this.addGoodsForm.goods_cat.join(",");
        this.manyTableList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            value: item.attr_vals.join(",")
          };
          this.addGoodsForm.attrs.push(newInfo);
        });
        this.onlyTableList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            value: item.attr_vals
          };
          this.addGoodsForm.attrs.push(newInfo);
        });
        form.attrs = this.addGoodsForm.attrs;

        await this.$http.post("goods", form);
        this.$message({
          type: "success",
          message: "添加商品成功"
        });
        this.$router.push("/goods");
      });
    }
  },
  computed: {
    cateId() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2];
      }
      return null;
    }
  },
  created() {
    this.getCateList();
  }
};
</script>

<style lang="scss" scoped>
.add-card {
  margin-top: 0.9375rem;
  .attr-checkbox {
    margin: 0 5px !important;
  }
  .AddBtn {
    margin-top: 1.5rem;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
