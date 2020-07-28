import axios from 'axios';

//登录
let login = (data) => axios.post('/api/admin/login', data);

//注册
let register = (data) => axios.post('/api/admin/register', data);

//管理员资料
let info = (id) => axios.get('/api/admin', { params: id });

//获取管理员列表
let list = (data) => axios.get('/api/admin/list', { params: data });

//更新管理员资料
let update = (data) => axios.put('/api/admin',data);

//删除管理员
let del = (id) => axios.delete('/api/admin/',{params: id});

//获取所有图标
let iconList = (data) => axios.get('/api/admin/icon/list',{ params: data });

//设置子菜单图标
let iconSet = (data) => axios.put('/api/menu/icon',data);


export default {
	login,
	register,
	info,
	list,
	update,
	del,
	iconList,
	iconSet,
}
