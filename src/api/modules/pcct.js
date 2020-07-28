import axios from 'axios';

//省
let province = (data) => axios.get('/api/pcct/province', { params: data });

//市
let city = (id) => axios.get('/api/pcct/city', { params: id });

//县区
let county = (id) => axios.get('/api/pcct/county', { params: id });

export default{
	province,
	city,
	county,
}