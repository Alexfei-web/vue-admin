<template>
	<div class="bg">
		<div class="login-box">
			<el-card class="login-card">
				<div slot="header" class="clearfix">
					<span>注册</span>
				</div>
				<el-form class="form" ref="form" :model="form" label-width="60px" :rules="rules">
					<el-form-item label="账户" prop="username">
						<el-input v-model="form.username" placeholder="账户名长度在3到15个字符!" prefix-icon="iconfont el-icon-user"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password" required>
						<el-input type="password" v-model.number="form.password" autocomplete="off" placeholder="密码至少3位数字!" show-password prefix-icon="iconfont el-icon-key"></el-input>
					</el-form-item>
					<el-form-item label="姓名" prop="fullname">
						<el-input v-model="form.fullname" placeholder="请填写真实姓名!" show-password prefix-icon="iconfont el-icon-postcard"></el-input>
					</el-form-item>
					<el-form-item label="性别" prop="sex">
						<el-radio-group v-model="form.sex">
							<el-radio label="男"></el-radio>
							<el-radio label="女"></el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="手机" prop="tel">
						<el-input v-model.number="form.tel" placeholder="请填写常用手机号码!" show-password prefix-icon="iconfont el-icon-mobile-phone"></el-input>
					</el-form-item>
					<el-form-item label="" prop="agree">
						<el-checkbox v-model.number="form.agree" label="同意本站用户协议" name="type"></el-checkbox>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleRegister('form')">注册</el-button>
					</el-form-item>
				</el-form>
				<div class="foot">
					<router-link to="/login">登录账户</router-link>
					<router-link to="/">忘记密码</router-link>
				</div>
			</el-card>
		</div>
	</div>
</template>

<script>
	import {Admin} from '@/api/index';
	
	export default {
		data() {
			return {
				form: {
					username: '',
					password: '',
					fullname: '',
					sex: '',
					tel: '',
					agree:''
				},
				rules: {
					username: [{
							required: true,
							message: '请输入账户名',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 15,
							message: '长度在 3 到 15 个字符',
							trigger: 'blur'
						}
					],
					password:[{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},{
							pattern:/^\d{3,}$/,
							message: '密码至少3位数字',
							trigger: 'blur'
						}],
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
					agree: [{
						required: true,
						message: '请同意协议',
						trigger: 'check'
					}],
				}
			}
		},
		methods: {
			handleRegister(form) {
				this.$refs[form].validate(async(valid) => {
					if (!valid) {
						return false;
					}
					//校验通过
					let { status, msg,data } = await Admin.register({...this.form});
					if (status) {
						// //储存Token、uid、role
						// sessionStorage.token = data.token;
						// sessionStorage.uid = data.id;
						// sessionStorage.role = data.role;
						this.$router.replace('/good/list');
						//注册成功
						this.$message.success(msg);
					} else {
						//注册失败
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
	
	.bg .login-box{
		position: absolute;
		right:100px;
		top: 50%;
		transform: translateY(-50%);
	}
	.bg .login-box .foot {
		display: flex;
		justify-content: space-between;
	}
</style>
