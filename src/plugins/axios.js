import axios from 'axios';
//loading 服务方式
import { Loading,Message } from 'element-ui';
//路由的实例
import router from '@/router/index';
//loading实例
let loading;


//设置默认baseURL
axios.defaults.baseURL = 'http://localhost:3003';

// 添加请求拦截器
axios.interceptors.request.use(function(config) {
	// 在发送请求之前做些什么
	// console.log(config);
	//开启loading
	loading = Loading.service({background:"rgba(0,0,0,0.3)"});
	
	//判断是否携带token
	if(config.url == '/admin/register'||config.url == '/admin/login'){
		return config;
	}
	//获取token
	let token = sessionStorage.token;
	//无token
	if(!token){
		//在组件外部，以服务的方式使用提示框，需要import进来
		Message.error("无效的Token，请重新登录！");
		setTimeout(()=>{
			loading.close();
			// console.log(router);
			router.replace('/login');
		},2000);
	}
	//有token
	config.headers.Authorization = `Bearer ${token}`;
	return config;
}, function(error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
	let {status,data} = response;
	//关闭 Loading
	loading.close();
	//在这里你可以判断后台返回数据携带的请求码
	// console.log(response);
	return data;
}, function(error) {
	// 对响应错误做点什么
	return Promise.reject(error);
});
