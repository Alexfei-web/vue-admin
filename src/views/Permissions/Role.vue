<template>
	<el-card class="login-card-role">
		<div slot="header" class="clearfix head">
			<span>角色列表</span>
			<el-button type="primary" plain @click="openInsertModel"><i class="el-icon-circle-plus-outline"></i>添加角色</el-button>
		</div>
		<el-table class="table" :data="tableData" style="width: 100%">
			<el-table-column prop="id" label="#">
			</el-table-column>
			<el-table-column label="角色">
				<template slot-scope="scope">
					<el-tag size="medium" :type='issuper(scope.row.name)'>{{ scope.row.name }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="operation" label="操作">
				<template slot-scope="scope">
					<el-button type="primary" plain icon="el-icon-edit" @click="editRole(scope.row.id,scope.row.name,scope.$index)"></el-button>
					<el-button type="danger" plain icon="el-icon-delete" @click="removeRole(scope.row.id,scope.$index)"></el-button>
					<el-button type="danger" plain icon="el-icon-setting"></el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-card>
</template>

<script>
	import { Role } from "@/api/index";
	export default {
		data() {
			return {
				tableData: []
			}
		},
		created() {
			// 获取列表数据
			this.loadList();
		},
		methods: {
			// 加载列表数据
			async loadList() {
				let { status, data } = await Role.list({});
				if (status) {
					//赋值
					this.tableData = data;
				}
			},
			issuper(val) {
				// console.log(val);
				if (val == '超级管理员') {
					return 'danger';
				}
			},
			openInsertModel() {
				this.$prompt("请输入添加的角色名称", "添加角色", {
					inputPattern: /\S/,
					inputErrorMessage: '不能输入空白字符'
				}).then(async ({ value }) => {
					let { status, data } = await Role.insert({ name: value });
					if (status) {
						//更新dom
						this.tableData.push({ name: value, ...data })
						this.$message.success('添加成功');
					}
				}).catch(() => {
					this.$message.info('取消添加');
				})
			},
			editRole(id, name, index) {
				this.$prompt("请输入修改的角色名称", "修改角色", {
					inputValue: name,
					inputPattern: /\S/,
					inputErrorMessage: '不能输入空白字符'
				}).then(async ({ value }) => {
					let { status } = await Role.update(id, value);
					if (status) {
						//更新dom
						this.tableData[index].name = value;
						this.$message.success('修改成功');
					}
				}).catch(() => {
					this.$message.info('取消修改');
					console.log("dddd");
				})
			},
			removeRole(id, i) {
				this.$confirm("此操作将永久删除该角色，是否继续？", {
					type: 'warning',
				}).then(async () => {
					let { status } = await Role.remove(id);
					if (status) {
						//更新dom
						console.log(this.tableData);
						this.tableData.splice(i, 1);
						this.$message.info('删除成功');
					}
				}).catch(() => {
					this.$message.info('取消删除');
				})
			},
		},
	}
</script>

<style lang="less">
	.head {
		display: flex;
		justify-content: space-between;
	}

	.login-card-role {
		width: 600px;
	}
</style>
