import axios from 'axios';

//获取角色列表
let list = (data) => axios.get('/api/role/list', { params: data });

//添加角色
let insert = (data) => axios.post('/api/role',data);

//更新角色
let update = (data) => axios.put('/api/role',data);

//删除角色
let remove = (data) => axios.delete('/api/role',{params:data});

//获取菜单配置
let tree = (id) => axios.get('/api/role/config',{params:id})

//为指定角色添加菜单
let addMenu = (data) => axios.post('/api/role/menu',data);

//为指定角色删除菜单
let removeMenu = (data) => axios.delete('/api/role/menu',{params:data});

//左侧leftmenu动态获取
let menuGet = (id) => axios.get('/api/menu/tree',{params:id});

export default {
	list,
	insert,
	update,
	remove,
	tree,
	addMenu,
	removeMenu,
	menuGet
}
