import axios from 'axios';

//获取子级分类
let sub = (pId) => axios.get('/api/category/sub', { params: pId });

//更新分类
let update = (data) => axios.put('/api/category', data);

//添加子分类
let add = (data) => axios.post('/api/category', data);

//删除分类
let remove = (id) => axios.delete('/api/category', { params: id });


export default {
	sub,
	update,
	add,
	remove,
}
