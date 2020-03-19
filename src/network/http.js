import axios from "axios";
// import Vue from "vue";

const http = axios.create({
  baseURL: "http://127.0.0.1:8888/api/private/v1"
});

http.interceptors.request.use(config => {
  if (window.sessionStorage.getItem("token")) {
    config.headers.Authorization = window.sessionStorage.getItem("token");
  }
  return config;
});

export default http;
