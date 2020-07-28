<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>用户列表</span>
			</div>
			<el-table :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
				<el-table-column prop="id" label="#" width="150">
				</el-table-column>
				<el-table-column prop="avatar" label="头像" sortable>
					<template slot-scope="scope">
						<img :src="scope.row.avatar" style="height: 50px;border-radius: 50%;" />
					</template>
				</el-table-column>
				<el-table-column prop="username" label="账号" sortable>
				</el-table-column>
				<el-table-column prop="fullname" label="姓名" sortable>
				</el-table-column>
				<el-table-column prop="sex" label="性别" sortable>
				</el-table-column>
				<el-table-column prop="tel" label="手机" sortable>
				</el-table-column>
				<el-table-column label="角色" sortable>
					<template slot-scope="scope">
						<el-tag size="medium" :type='issuper(scope.row.role_name)'>{{ scope.row.role_name }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="login_time" label="上次登录" sortable width="150">
				</el-table-column>
				<el-table-column prop="login_count" label="登录次数" sortable>
				</el-table-column>
				<el-table-column prop="operation" label="操作" width="220">
					<template slot-scope="scope">
						<el-button type="primary" plain icon="el-icon-edit" @click="openEditModal(scope.row.id,scope.$event)"></el-button>
						<el-button type="danger" :disabled='issuperDel(scope.row.role_name)' plain icon="el-icon-delete" @click="handleDel(scope.row.id,scope.$index)"></el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<el-dialog title="修改信息" :visible.sync="editModalShow">
			<el-form ref="form" :model="form" label-width="100px" :rules="rules">
				<el-form-item label="姓名" prop="fullname">
					<el-input class="input" v-model="form.fullname"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-radio-group v-model="form.sex">
						<el-radio label="男"></el-radio>
						<el-radio label="女"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="手机" prop="tel">
					<el-input class="input" v-model.number="form.tel"></el-input>
				</el-form-item>
				<el-form-item label="权限" prop="role">
					<template>
						<el-select v-model="form.role">
							<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</template>
				</el-form-item>
				<el-form-item label="头像" prop="avatar">
					<single-upload loadHead="/api/upload/avatar" :url="form.avatar" @success="handleUploadSuccess($event)" @remove="form.avatar=''"></single-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editModalShow = false">取 消</el-button>
				<el-button type="primary" @click="handleEdit('form')">保 存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { Admin } from '@/api/index';
	import { Role } from '@/api/index';
	import SingleUpload from "@/components/SingleUpload.vue";
	export default {
		components: {
			SingleUpload: SingleUpload
		},
		data() {
			return {
				tableData: [],
				editModalShow: false,
				form: {
					fullname: '',
					sex: '',
					tel: '',
					role: '',
					avatar: '',
				},
				options: [],
				rules: {
					fullname: [{
							required: true,
							message: '请输入姓名',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 5,
							message: '长度在 2 到 5 个字符',
							trigger: 'blur'
						}
					],
					sex: [{
						required: true,
						message: '请选择性别',
						trigger: 'change'
					}],
					tel: [{
							required: true,
							message: '请输入手机号码',
							trigger: 'blur'
						},
						{
							validator: function(rule, value, callback) {
								if (/^1[34578]\d{9}$/.test(value) == false) {
									callback(new Error("请输入正确的手机号"));
								} else {
									callback();
								}
							},
							trigger: 'blur'
						},
					],
					role: [{
						required: true,
						message: '请选择权限',
						trigger: 'change'
					}],
					avatar: [{
						required: true,
						message: '头像不能为空',
						trigger: 'blur'
					}]
				}
			}
		},
		async created() {
			//获取列表数据
			this.loadList();
			let { status, data } = await Role.list({});
			if (status) {
				//赋值
				this.options = data;
			}
		},
		methods: {
			async loadList() {
				let { status, data } = await Admin.list({});
				if (status) {
					data.forEach((item) => {
						item.avatar = item.avatar.replace(/(\S*)\images/, 'http://localhost:3003/images');
					});
					this.tableData = data;
				}
			},

			issuper(val) {
				// console.log(val);
				if (val == '超级管理员') {
					return 'danger';
				}
			},
			issuperDel(val) {
				if (val == '超级管理员') {
					return 'disabled';
				}
			},
			handleDel(id, i) {
				this.$confirm("此操作将永久删除该管理员，是否继续？", {
					type: 'warning',
				}).then(async () => {
					// console.log(id);
					let { status } = await Admin.del({ id: id });
					if (status) {
						//更新dom
						this.tableData.splice(i, 1);
						this.$message.info('删除成功');
					}
				}).catch(() => {
					this.$message.info('取消删除');
				})
			},
			async openEditModal(id, i) {
				this.editModalShow = true;
				let { status, data } = await Admin.info({ id });
				if (status) {
					data.avatar = data.avatar.replace(/(\S*)\images/, 'http://localhost:3003/images');
					this.form = data;
				}
			},
			handleEdit(form) {
				this.$refs[form].validate(async (valid) => {
					if (valid) {
						let { status } = await Admin.update({ ...this.form });
						if (status) {
							this.$message.success('修改成功');
							this.editModalShow = false;
							this.loadList();
						} else {
							this.$message.success('修改失败');
							this.editModalShow = false;
						}
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			handleUploadSuccess(res) {
				console.log(res);
				this.form.avatar = res.src;
			},
		}
	}
</script>

<style>
</style>
