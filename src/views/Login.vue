<template>
	<div class="bg">
		<el-card class="login-card">
			<div slot="header" class="clearfix">
				<span>欢迎登录</span>
			</div>
			<el-form ref="form" :model="form" label-width="60px" :rules="rules">
				<el-form-item label="账户" prop="username">
					<el-input v-model="form.username" placeholder="请输入账户名!" prefix-icon="iconfont el-icon-user">
					</el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="form.password" placeholder="请输入密码!" show-password prefix-icon="iconfont el-icon-key"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleLogin('form')">登录</el-button>
				</el-form-item>
			</el-form>
			<div class="action-box">
				<router-link to="/register">注册账户</router-link>
				<router-link to="/">忘记密码</router-link>
			</div>
		</el-card>
	</div>
</template>

<script>
	import { Admin } from '@/api/index';
	// console.log(Admin);

	export default {
		data() {
			return {
				form: {
					username: '',
					password: '',
				},
				rules: {
					username: [{
							required: true,
							message: '请输入账户名',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 11,
							message: '长度在 1 到 11 个字符',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 16,
							message: '长度在 3 到 16 个字符',
							trigger: 'blur'
						}
					],
				}
			}
		},
		methods: {
			handleLogin(form) {
				this.$refs[form].validate(async (valid) => {
					if (!valid) {
						return false;
					}
					//校验通过
					let { status, msg, data } = await Admin.login({ ...this.form });
					if (status) {
						console.log(data);
						//储存Token、uid、role
						sessionStorage.token = data.token;
						sessionStorage.role = data.role;
						sessionStorage.id = data.id;
						//成功提示
						this.$message.success(msg);
						//是否有redirect参数？
						let { redirect } = this.$route.query;
						if (redirect) {
							this.$router.replace(redirect);
						}
						//默认跳转路由
						this.$router.replace('/goods/list');
					} else {
						this.$message.error(msg);
					}
				});
			},
		}
	}
</script>

<style scoped>
	.bg {
		position: relative;
		height: 100vh;
		background: url(../assets/img/login-bg.jpg) no-repeat top center;
		background-size: cover;

	}

	.bg .login-card {
		position: absolute;
		right: 100px;
		top: 50%;
		transform: translateY(-50%);
	}

	.action-box {
		display: flex;
		justify-content: space-between;
		font-size: 13px;
	}
</style>
