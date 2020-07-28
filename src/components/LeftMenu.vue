<template>
	<el-menu default-active="2" router class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
	 background-color="#334e66" text-color="#fff" active-text-color="#ffd04b" :collapse="isCollapse">
		<el-submenu index="1">
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
		</el-submenu>
		
	</el-menu>
</template>

<script>
	export default {
		props:['isCollapse'],
		methods: {
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			}
		}
	}
</script>

<style lang="less">

</style>
