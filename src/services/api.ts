import axios from "axios";

  const api = axios.create({
  baseURL: "http://192.168.3.7:3333"
});

api.interceptors.request.use((config) => {
  console.log("INTERCEPTOR => ", config);

  return config;
}, (error) => {
  return Promise.reject(error);
})

export { api };