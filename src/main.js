import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";

import "./assets/css/global.css";

import http from "./network/http";

import TreeTable from "vue-table-with-tree-grid";

Vue.component("tree-table", TreeTable);

Vue.config.productionTip = false;
Vue.prototype.$http = http;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
