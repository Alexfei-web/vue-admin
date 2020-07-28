import axios from 'axios';

//订单列表
let all = (data) => axios.get('/api/admin/order/list', { params: data });

export default{
	all,
}