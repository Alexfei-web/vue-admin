import axios from 'axios';

//获取角色列表
let list = (data) => axios.get('/api/role/list', { params: data });

//添加角色
let insert = (data) => axios.post('/api/role',data);

//更新角色
let update = (data) => axios.put('/api/role',data);

//删除角色
let remove = (data) => axios.delete('/api/role',{params:data});

export default {
	list,
	insert,
	update,
	remove,
}
