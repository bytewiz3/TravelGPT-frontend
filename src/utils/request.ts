import axios, { AxiosInstance } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import qs from 'qs';
import { Local } from '/@/utils/storage.ts';


// let baseURL = 'http://127.0.0.1:8089'
let baseURL = '/'
let token = Local.get('token')
// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
	// baseURL: import.meta.env.VITE_API_URL,
	baseURL: baseURL,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json' },
	paramsSerializer: {
		serialize(params) {
			return qs.stringify(params, { allowDots: true });
		},
	},
});

// 添加请求拦截器
service.interceptors.request.use(
	(config: any) => {
		config.headers!['token'] = token || `eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTUzOTAxNjksImV4cCI6MTcxNTk5NDk2OSwiaXNzIjoidHJhdmVsX2dwdCIsImRhdGEiOnsidXNlcl9pZCI6IjE3Nzc4ODEyNTU3MjgyNTkwNzIiLCJ1c2VybmFtZSI6ImFkbWluIiwibmlja25hbWUiOiJcdTdiYTFcdTc0MDZcdTU0NTgiLCJyb2xlcyI6WyJhZG1pbiJdLCJwaG90byI6InN0YXRpYy9waG90by9oZWFkLmpwZyIsImxvZ2luX2lwIjoiMTI3LjAuMC4xIiwibGFzdF9sb2dpbiI6IjIwMjQtMDUtMTEgMDk6MTY6MDkiLCJ0b2tlbiI6IiJ9LCJqdGkiOiI0ZjFnMjNhMTJhYSJ9.MuYLSYDE_FOBqZ1UMO7vg--KCuS0eZf-uzrxw0XiTNP_6uHzOrUtex_C3veIWXQX-CowHeh32__WXchWkWvy0g`;
		return config;
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

// 添加响应拦截器
service.interceptors.response.use(
	(response) => {
		// 对响应数据做点什么
		const res = response.data;
		if (res.code && res.code === '200') {
			return res.data;
		} else {
			return res
		}
	},
	(error) => {
		// 对响应错误做点什么
		if (error.message.indexOf('timeout') != -1) {
			ElMessage.error('网络超时');
		} else if (error.message == 'Network Error') {
			ElMessage.error('网络连接错误');
		} else {
			if (error.response.data) ElMessage.error(error.response.statusText);
			else ElMessage.error('接口路径找不到');
		}
		return Promise.reject(error);
	}
);

// 导出 axios 实例
export default service;
