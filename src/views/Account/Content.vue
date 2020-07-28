<template>
	<el-card class="login-card">
		<div slot="header" class="clearfix">
			<span>账户信息</span>
		</div>
		<el-form class="contentForm" ref="form" :model="form" label-width="300px" :rules="rules">
			<el-form-item label="账户" prop="username">
				<el-input class="input" disabled="disabled" v-model="form.username"></el-input>
			</el-form-item>
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
			<el-form-item label="图片" prop="avatar">
				<single-upload loadHead="/api/upload/avatar" :url="form.avatar" @success="handleUploadSuccess($event)" @remove="form.avatar=''"></single-upload>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleEdit('form')">修改</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	import {Admin} from '@/api/index';
	import {Role} from '@/api/index';
	import SingleUpload from "@/components/SingleUpload.vue";
	export default {
		//注册组件
		components: {
			SingleUpload: SingleUpload
		},
		data() {
			return {
				form: {
					username: '',
					fullname: '',
					sex: '',
					tel: '',
					role: '',
					avatar: '',
				},
				options: [],
				value: '超级管理员',
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
		created() {
			var id = sessionStorage.id;
			this.loadList(id);
			this.loadList2();
		},
		methods: {
			async loadList(val) {
				let { status, data } = await Admin.info({id:val});
				if (status) {
					data.avatar = data.avatar.replace(/(\S*)\images/,'http://localhost:3003/images');
					//赋值
					this.form = data;
				}
			},
			async loadList2() {
				let { status, data } = await Role.list({});
				if (status) {
					//赋值
					this.options = data;
				}
			},
			handleUploadSuccess(res) {
				console.log(res);
				this.form.avatar = res.src;
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
			handleEdit(form) {
				this.$refs[form].validate(async (valid) => {
					if (valid) {
						let { status } = await Admin.update({ ...this.form });
						if (status) {
							this.$message.success('修改成功');
						} else {
							this.$message.success('修改失败');
						}
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
		}
	}
</script>

<style lang="less" scoped="scoped">
	.input {
		width: 750px;
	}

	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
</style>
