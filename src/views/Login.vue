<template>
  <div class="login_container">
    <div class="login_box">
      <h1>Welcome</h1>

      <el-form
        @submit.native.prevent="login"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login_form"
      >
        <!-- username -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user"
            class="form_input"
          ></el-input>
        </el-form-item>
        <!-- password -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-view"
            type="password"
            class="form_input"
          ></el-input>
        </el-form-item>
        <!-- buttom -->
        <el-form-item class="form_btns">
          <el-button class="btn_item" native-type="submit">Login</el-button>
          <el-button class="btn_item" @click.prevent="resetLoginForm">
            Reset
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      // 验证规则
      loginRules: {
        // username验证
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在3-10个字符",
            trigger: "blur"
          }
        ],
        // password验证
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名长度在6-15个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 重置登录表单
    resetLoginForm() {
      // this.$refs.loginFormRef.resetFields();
      this.$refs.loginFormRef.resetFields();
    },
    async login() {
      const { data: res } = await this.$http.post("login", this.loginForm);
      if (res.meta.status !== 200) {
        return this.$message({
          type: "error",
          message: "登录失败!",
          duration: "1000",
          center: true
        });
      }
      window.sessionStorage.setItem("token", res.data.token);
      this.$router.push("/");
      this.$message({
        type: "success",
        message: "登录成功!",
        duration: "1000",
        center: true
      });
      // this.$refs.loginFormRef.validate(async valid => {
      //   console.log(this);
      //   if (!valid) {
      //     return;
      //   }
      //   const { data: res } = await this.$http.post("login", this.loginForm);
      //   if (res.meta.status !== 200) {
      //     return this.$message({
      //       type: "error",
      //       message: "登录失败!",
      //       duration: "1000",
      //       center: true
      //     });
      //   }
      //   window.sessionStorage.setItem("token", res.data.token);
      //   this.$router.push("/home");
      //   this.$message({
      //     type: "success",
      //     message: "登录成功!",
      //     duration: "1000",
      //     center: true
      //   });
      // });
    }
  }
};
</script>

<style lang="scss" scoped>
.login_container {
  background-image: linear-gradient(45deg, #9fbaa8, #31354c);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_box {
    width: 25rem;
    height: 31.25rem;
    border-radius: 0.1875rem;
    text-align: center;
    & h1 {
      font-weight: 400;
      margin-top: 0;
      color: white;
    }
    .login_form {
      margin-top: 2.5rem;
      .form_btns {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .btn_item {
          height: 40px;
          margin-right: 0.3125rem;
          background: #2c3e50;
          border: 0;
          color: white;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 1.2rem;
        }
      }
    }
  }
}
</style>
