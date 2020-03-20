<template>
  <div>
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      class="user-breadcrumb"
    >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="order-card">
      <el-row :gutter="30" class="order-search">
        <el-col :span="7">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column
          label="订单编号"
          width=""
          prop="order_number"
        ></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>

        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">
              已付款
            </el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="是否发货" prop="is_send"></el-table-column>

        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="showBox"
          ></el-button>

          <el-button
            type="success"
            size="mini"
            icon="el-icon-location"
            @click="showProgressBox"
          ></el-button>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="prev, pager, next, jumper"
        :total="total"
        class="pagination"
      >
      </el-pagination>

      <!-- 修改地址Dialog -->
      <el-dialog
        title="修改地址"
        :visible.sync="addressVisible"
        width="50%"
        @close="addressDialogClosed"
      >
        <el-form
          :model="addressForm"
          :rules="addressFormRules"
          ref="addressFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              style="width: 100%"
              :options="cityData"
              v-model="addressForm.address1"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressVisible = false">取消</el-button>
          <el-button type="primary" @click="addressVisible = false">
            确定
          </el-button>
        </span>
      </el-dialog>

      <!-- 物流进度Dialog -->
      <el-dialog
        title="物流进度"
        :visible.sync="progressVisible"
        width="50%"
        @close="addressDialogClosed"
      >
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time"
          >
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityData from "./citydata.js";

export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],

      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ""
      },
      addressFormRules: {
        address1: [
          { requierd: true, message: "请选择省市区/县", trigger: "blur" }
        ],
        address2: [
          { requierd: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      cityData,

      progressVisible: false,
      progressInfo: []
    };
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },

    /**
     * 分页相关函数
     */
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },

    /**
     * 修改地址相关的函数
     */
    showBox() {
      this.addressVisible = true;
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },

    /**
     * 相关的函数
     */
    async showProgressBox() {
      const { data: res } = await this.$http.get(`/kuaidi/1106975712662`);
      this.progressInfo = res.data;
      this.progressVisible = true;
    }
  },
  created() {
    this.getOrderList();
  }
};
</script>

<style lang="scss" scoped>
.order-card {
  margin-top: 0.9375rem;
  .order-search {
    margin-bottom: 0.9375rem;
  }
  .pagination {
    margin-top: 1.5rem;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
