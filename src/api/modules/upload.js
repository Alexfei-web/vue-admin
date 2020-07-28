import axios from 'axios';

//删除图片
let del = (src) => axios.delete('/api/upload',{params:src});

export default {
	del,
}