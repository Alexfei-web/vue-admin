<template>
	<div>
		<el-card class="login-card-role left">
			<div slot="header" class="clearfix head">
				<span>角色列表</span>
				<el-button type="primary" plain @click="openInsertModel"><i class="el-icon-circle-plus-outline"></i>添加角色</el-button>
			</div>
			<el-table class="table" :data="tableData" style="width: 100%">
				<el-table-column prop="id" label="#" width="120">
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
						<el-button type="danger" plain icon="el-icon-setting" @click="setRole(scope.row.id)"></el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<div class="right">
			<el-card class="login-card-role" v-for="(item,index) in menuTree" :key="item.id" style="margin-bottom: 10px;">
				<div slot="header" class="clearfix head">
					<span class="title"><i class="el-icon-collection-tag"></i>{{item.name}}</span>
					<el-switch v-model="item.checked" @change="clickTitle(item.id, item.checked, item.children)"></el-switch>
				</div>
				<div class="content" v-for="itemChild in item.children">
					<span>{{itemChild.name}}</span>
					<el-switch v-model="itemChild.checked" @change="clickChild(itemChild.id, itemChild.checked,item)"></el-switch>
				</div>
			</el-card>
		</div>
	</div>
</template>

<script>
	import { Role } from "@/api/index";
	export default {
		data() {
			return {
				tableData: [],
				menuTree: [],
				menuTreeId: '',
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
					// console.log("dddd");
				})
			},
			removeRole(id, i) {
				this.$confirm("此操作将永久删除该角色，是否继续？", {
					type: 'warning',
				}).then(async () => {
					let { status } = await Role.remove(id);
					if (status) {
						//更新dom
						// console.log(this.tableData);
						this.tableData.splice(i, 1);
						this.$message.info('删除成功');
					}
				}).catch(() => {
					this.$message.info('取消删除');
				})
			},
			//获取菜单配置
			async setRole(id) {
				let { status, data } = await Role.tree({ id: id });
				if (status) {
					this.menuTree = data;
					console.log(data);
					//存一下角色id
					this.menuTreeId = id;
				}
			},

			async clickTitle(id, checked, children) {
				//标题上的按钮控制全部按钮的添加和删除
				if (checked) {
					let { status } = await Role.addMenu({ role_id: this.menuTreeId, menu_id: id });
					children.forEach(async (item) => {
						let { status } = await Role.addMenu({ role_id: this.menuTreeId, menu_id: item.id });
						item.checked = checked;
					})
				} else {
					let { status } = await Role.removeMenu({ role_id: this.menuTreeId, menu_id: id });
					children.forEach(async (item) => {
						let { status } = await Role.removeMenu({ role_id: this.menuTreeId, menu_id: item.id });
						item.checked = checked;
					})
				}
			},
			async clickChild(checked, id, parentItem) {
				//内容有一个选中的标题的就选中；内容全部不选中，标题才不选中
				if (checked) {
					let { status } = await Role.addMenu({ role_id: this.menuTreeId, menu_id: id });
					if (!parentItem.checked) {
						let { status } = await Role.addMenu({ role_id: this.menuTreeId, menu_id: parentItem.id });
						parentItem.checked = checked;
					}
				} else {
					let { status } = await Role.removeMenu({ role_id: this.menuTreeId, menu_id: id });
					//每一个都不选中isclick才不选中
					var isclick = parentItem.children.every((item) => item.checked == false);
					if (isclick) {
						let { status } = await Role.removeMenu({ role_id: this.menuTreeId, menu_id: parentItem.id });
						parentItem.checked = checked;
					}
				}
			}
		},
	}
</script>

<style lang="less">
	.head {
		display: flex;
		justify-content: space-between;
	}

	.right {
		float: right;
		width: 700px;
	}

	.left {
		float: left;
		width: 530px;
	}

	.title {
		color: #409EFF;
	}

	.content {
		display: flex;
		justify-content: space-between;
		color: #909399;
		margin-bottom: 10px;
		font-size: 12px;
	}
</style>
