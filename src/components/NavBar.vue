<template>
	<div class="navbar">
		<div class="left">
			<img src="../assets/img/logo.png" alt="">
			<i class="el-icon-s-fold" @click="changeNavigation"></i>
		</div>
		<div class="right">
			<el-menu router class="el-menu-demo" mode="horizontal" @select="handleSelect"
			 background-color="#30404e" text-color="#fff" active-text-color="#409EFF">
				<el-submenu index="2" :model="form">
					<template slot="title">
						<img :src=form.avatar alt="" style="border-radius: 50%;">
						{{form.admin}}
					</template>
					<el-menu-item index="/permissions/menu">消息</el-menu-item>
					<el-menu-item index="/account/content">设置</el-menu-item>
					<el-menu-item index="/permissions/menu">退出</el-menu-item>
				</el-submenu>
			</el-menu>
		</div>
	</div>
</template>

<script>
	import {Admin} from '@/api/index';
	export default {
		data(){
			return{
				form:{
					admin:'',
					avatar:'',
				}
			}
		},
		created() {
			var id = sessionStorage.id;
			//获取列表数据
			this.loadList(id);
		},
		methods: {
			async loadList(id) {
				let {status,data} = await Admin.info({id:id});
				if(status){
					this.form.admin = data.username;
					this.form.avatar = data.avatar;
				}
			},
			handleSelect(key, keyPath) {
				console.log(key, keyPath);
			},
			changeNavigation(){
				console.log("ppp");
				this.$emit('change');
			}
		}
	}
</script>

<style lang="less">
	.navbar {
		background-color: #31404e;
		color: #fff;
		height: 100%;
		line-height: 55px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.navbar .left,
	.navbar .right {
		display: flex;
		align-items: center;
	}

	.navbar .right {
		padding-right: 20px;
		margin-right: 20px;
		padding-left: 20px;
	}

	.navbar .left>img {
		height: 50px;
		margin-left: 20px;
		margin-right: 10px;
		float: left;
	}

	.navbar .right img {
		height: 30px;
		margin-right: 10px;
	}

	.el-dropdown-link {
		cursor: pointer;
		color: #fff;
	}

	.el-icon-arrow-down {
		font-size: 12px;
	}
</style>
