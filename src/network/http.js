import axios from "axios";
// import Vue from "vue";

const http = axios.create({
  baseURL: "http://127.0.0.1:8888/api/private/v1"
});

export default http;
