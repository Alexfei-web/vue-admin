import axios from 'axios';

//获取子菜单
let sub = (data) => axios.get('/api/menu/sub', { params: data });

//更新子菜单
let update = (data) => axios.put('/api/menu',data);

//添加子菜单
let add = (data) => axios.post('/api/menu',data);

//删除子菜单
let remove = (id) => axios.delete('api/menu',{params:id});


export default {
	sub,
	update,
	add,
	remove,
}
