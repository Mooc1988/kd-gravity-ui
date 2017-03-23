/**
 * Created by frank on 2017/3/21.
 */
import axios from 'axios'
const API_URL = process.env.API_BASE_URL
const instance = axios.create({
  baseURL: API_URL,
  timeout: 1000,
  headers: {
    'X-Custom_Header': 'foobar'
  }
})

instance.interceptors.request.use(function (config) {
  let token = sessionStorage.getItem('jwtToken')
  if (token !== undefined && token !== null) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config;
}, function (error) {
  return Promise.reject(error);
})

export  default instance