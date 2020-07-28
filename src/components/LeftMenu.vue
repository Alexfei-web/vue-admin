<template>
	<el-menu default-active="2" router class="el-menu-vertical-demo"
	 background-color="#334e66" text-color="#fff" active-text-color="#ffd04b" :collapse="isCollapse">
		<!-- <el-submenu index="1">
			<template slot="title">
				<i class="el-icon-goods"></i>
				<span>商品管理</span>
			</template>
			<el-menu-item index="/good/category">商品分类</el-menu-item>
			<el-menu-item index="/good/release">发布商品</el-menu-item>
			<el-menu-item index="/good/list">商品列表</el-menu-item>
		</el-submenu>
		
		<el-submenu index="2">
			<template slot="title">
				<i class="el-icon-files"></i>
				<span>订单管理</span>
			</template>
			<el-menu-item index="/order/list">商品列表</el-menu-item>
		</el-submenu>
		
		<el-submenu index="3">
			<template slot="title">
				<i class="el-icon-setting"></i>
				<span>账户设置</span>
			</template>
			<el-menu-item index="/account/content">账户信息</el-menu-item>
		</el-submenu>
		
		<el-submenu index="4">
			<template slot="title">
				<i class="el-icon-user"></i>
				<span>用户管理</span>
			</template>
			<el-menu-item index="/user/list">用户列表</el-menu-item>
		</el-submenu>
		
		<el-submenu index="5">
			<template slot="title">
				<i class="el-icon-set-up"></i>
				<span>权限设置</span>
			</template>
			<el-menu-item index="/permissions/role">用户角色</el-menu-item>
			<el-menu-item index="/permissions/menu">菜单权限</el-menu-item>
		</el-submenu> -->
		<el-submenu v-for="(item,index) in menuList" :key="item.id" :index="index+''">
			<template slot="title">
				<i :class="'el-icon-' + item.icon"></i>
				<span>{{item.name}}</span>
			</template>
			<el-menu-item v-for="(item) in item.children" :key="item.id" :index="item.path">{{item.name}}</el-menu-item>
		</el-submenu>
	</el-menu>
</template>

<script>
	import { Role } from "@/api/index";
	export default {
		created() {
			this.loadMenu();
		},
		props: ["isCollapse"],
		data() {
			return {
				menuList: [],
			};
		},
		methods: {
			async loadMenu() {
				var id = sessionStorage.role;
				let { status, data } = await Role.menuGet({ id });
				if (status) {
					console.log(data);
					this.menuList = data;
				}
			},
		},
	};
</script>

<style lang="less">
</style>
