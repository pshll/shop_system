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
      { path: "rights", component: () => import("../views/power/Rights.vue") }
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
