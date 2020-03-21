import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue"),
    children: [
      { path: "users", component: () => import("../views/user/Users.vue") },
      { path: "roles", component: () => import("../views/power/Roles.vue") },
      { path: "rights", component: () => import("../views/power/Rights.vue") },
      {
        path: "categories",
        component: () => import("../views/goods/Cate.vue")
      },
      { path: "params", component: () => import("../views/goods/Params.vue") },
      { path: "goods", component: () => import("../views/goods/List.vue") },
      {
        path: "goods/addGoods",
        component: () => import("../views/goods/AddGoods.vue")
      },
      {
        path: "orders",
        component: () => import("../views/order/Order.vue")
      },
      {
        path: "reports",
        component: () => import("../views/report/Report.vue")
      }
    ]
  },
  {
    path: "/login",
    component: () => import("../views/Login.vue")
  }
];

const router = new VueRouter({
  routes
});

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    return next();
  }
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) {
    return next("/login");
  }
  next();
});

export default router;
