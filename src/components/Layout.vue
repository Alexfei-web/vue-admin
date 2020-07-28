<template>
	<div>
		<el-container>
			<el-header class="header">
				<NavBar @change="isCollapse = !isCollapse"></NavBar>
			</el-header>
			<el-container>
				<LeftMenu :isCollapse="isCollapse"></LeftMenu>
				<el-main>
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	import NavBar from '@/components/NavBar.vue';
	import LeftMenu from '@/components/LeftMenu.vue';
	export default {
		data() {
			return {
				isCollapse: false
			};
		},
		components: {
			NavBar,
			LeftMenu,
		}
	}
</script>

<style lang="less">
	.header {
		padding: 0 !important;
	}
</style>
