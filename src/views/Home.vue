<template>
  <el-container class="home">
    <el-header class="home_header">
      <div class="header_title">
        <img src="../assets/img/home/logo.jpg" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">X</el-button>
    </el-header>
    <el-container>
      <el-aside class="home_aside" :width="isCollapse ? '3.625rem' : '12.5rem'">
        <div class="aside_toggle" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409bff"
          class="aside_nav"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="$route.path"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="home_main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 侧边栏菜单数据
      menuList: [],
      iconsObj: {
        "125": "iconfont el-icon-user",
        "103": "iconfont el-icon-coordinate",
        "101": "iconfont el-icon-shopping-bag-2",
        "102": "iconfont el-icon-collection",
        "145": "iconfont el-icon-paperclip"
      },
      isCollapse: false,
      activePath: ""
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) {
        return this.$message({
          type: "error",
          message: res.meta.msg,
          duration: "1000",
          center: true
        });
      }
      this.menuList = res.data;
    },
    // 折叠侧边栏
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  },
  created() {
    this.getMenuList();
  }
};
</script>

<style lang="scss" scoped>
.home {
  height: 100vh;
  .home_header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 1rem;
    color: #fff;
    font-size: 1.3rem;
    .header_title {
      display: flex;
      align-items: center;
      height: 100%;
      flex: 1;
      & img {
        height: 100%;
        border-radius: 50%;
        margin-right: 1rem;
      }
    }
  }
  .home_aside {
    background-color: #333744;
    .aside_toggle {
      background-color: #4a5064;
      font-size: 0.625rem;
      line-height: 1.5rem;
      text-align: center;
      letter-spacing: 0.1rem;
      color: #fff;
      cursor: pointer;
    }
    .aside_nav {
      border-right: none;
      .iconfont {
        margin-right: 0.625rem;
      }
    }
  }
  .home_main {
    background-color: #eaedf3;
  }
}
</style>
