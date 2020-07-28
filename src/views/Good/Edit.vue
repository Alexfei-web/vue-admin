<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>发布新商品</span>
		</div>
		<el-form ref="form" :model="form" label-width="120px" label-position="left" :rules="rules">
			<el-form-item label="商品分类">
				<el-col :span="4" prop="cate_1st">
					<el-select v-model="form.cate_1st" placeholder="一级">
						<el-option v-for="option in options_1st" :key="option.id" :label="option.name" :value="option.id"></el-option>
					</el-select>
				</el-col>
				<el-col :span="4" prop="cate_2nd">
					<el-select v-model="form.cate_2nd" placeholder="二级">
						<el-option v-for="option in options_2nd" :key="option.id" :label="option.name" :value="option.id"></el-option>
					</el-select>
				</el-col>
				<el-col :span="4" prop="cate_3rd">
					<el-select v-model="form.cate_3rd" placeholder="三级">
						<el-option v-for="option in options_3rd" :key="option.id" :label="option.name" :value="option.id"></el-option>
					</el-select>
				</el-col>
			</el-form-item>
			<el-form-item label="商品名称" prop="name">
				<el-input class="goodName" v-model="form.name"></el-input>
				<p>商品标题名称长度至少3个字符，最长200个汉字</p>
			</el-form-item>
			<el-form-item label="商品卖点">
				<el-input class="goodName" type="textarea" v-model="form.hotPoint"></el-input>
				<p>商品卖点不能超过140个汉字</p>
			</el-form-item>
			<el-form-item label="商品价格" prop="price">
				<el-input class="priceInput" v-model.number="form.price">
					<template slot="append">元</template>
				</el-input>
				<p>价格必须是0-999999之间的数字，且不能高于市场价</p>
				<p>此价格为商品实际销售价格，如果商品存在规格，改价格显示最低价格</p>
			</el-form-item>
			<el-form-item label="市场价" prop="marketPrice">
				<el-input class="priceInput" v-model.number="form.marketPrice">
					<template slot="append">元</template>
				</el-input>
				<p>价格必须是0-999999之间的数字，此价格仅为市场参考价，请根据实际情况认真填写</p>
			</el-form-item>
			<el-form-item label="成本价">
				<el-input class="priceInput" v-model.number="form.cost">
					<template slot="append">元</template>
				</el-input>
				<p>价格必须是0-999999之间的数字，此价格为商户对所销售的商品的实际成本价进行备注记录，非必填选项，不会在前台销售页面中显示</p>
			</el-form-item>
			<el-form-item label="折扣">
				<el-input class="priceInput" v-model.number="discount">
					<template slot="append">折</template>
				</el-input>
				<p>根据销售价与市场价比例自动生成不需要编辑</p>
			</el-form-item>
			<el-form-item label="商品库存" prop="inventory">
				<el-input class="priceInput" v-model.number="form.inventory" value="1000">
					<template slot="append">件</template>
				</el-input>
				<p>必须是0-999999之间的整数</p>
				<p>若启动了库存配置，则系统自动计算商品的总数，此处无需卖家填写</p>
			</el-form-item>
			<el-form-item label="商品货号" prop="articleNo">
				<el-input class="priceInput" v-model="form.articleNo"></el-input>
				<p>商品货号是商家管理商品的编号，买家不可见</p>
				<p>最多输入20个字符，只支持输入中文、字母、数字、_、/、-和小数点</p>
			</el-form-item>
			<el-form-item label="商品主图" prop="img_lg">
				<single-upload loadHead="/api/upload/goods" :url="form.img_lg" @success="handleUploadSuccess($event)" @remove="form.img_lg=''"></single-upload>
				<p>上传商品默认主图，如多规格时将默认图片或分规格上传规格主图，支持jpg、if、png格式上传或从图片空间选中，建议使用尺寸 800*800像素以上，大小不超过1M的正方形图片，上传后的图片将自动保存在图片空间的默认分类中</p>
			</el-form-item>
			<el-form-item label="商品轮播图" prop="slider">
				<el-upload :file-list="fileList" action="/api/upload/slider" :on-success="handleSuccess" list-type="picture-card"
				 :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible">
					<img width="100%" :src="dialogImageUrl" alt="">
				</el-dialog>
				<p>上传商品默认主图，如多规格时将默认图片或分规格上传规格主图，支持jpg、if、png格式上传或从图片空间选中，建议使用尺寸 800*800像素以上，大小不超过1M的正方形图片，上传后的图片将自动保存在图片空间的默认分类中</p>
			</el-form-item>
			<span class="titleBlack">商品详情描述</span>
			<el-form-item label="商品品牌" prop="brand">
				<el-input class="goodName" v-model="form.brand"></el-input>
			</el-form-item>
			<el-form-item label="商品描述" prop="detail" style="z-index: -9999!important;">
				<div ref="editor" v-model="form.detail"></div>
			</el-form-item>
			<span class="titleBlack">商品物流信息</span>
			<el-form-item label="所在地">
				<el-col :span="4" prop="province">
					<el-select v-model="form.province" placeholder="省">
						<el-option v-for="option in provinceAll" :key="option.province_id" :label="option.name" :value="option.province_id"></el-option>
					</el-select>
				</el-col>
				<el-col :span="4" prop="city">
					<el-select v-model="form.city" placeholder="市">
						<el-option v-for="option in cityAll" :key="option.city_id" :label="option.name" :value="option.city_id"></el-option>
					</el-select>
				</el-col>
				<el-col :span="4" prop="county">
					<el-select v-model="form.county" placeholder="区">
						<el-option v-for="option in countyAll" :key="option.county_id" :label="option.name" :value="option.county_id"></el-option>
					</el-select>
				</el-col>
			</el-form-item>
			<el-form-item label="运费" prop="freight">
				<el-input class="priceInput" v-model.number="form.freight">
					<template slot="append">元</template>
				</el-input>
				<p>运费设为0，前台商品将显示免运费</p>
			</el-form-item>
			<el-form-item>
				<el-button type="success" @click="handleSubmit('form')">提交</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	import { Category } from '@/api/index';
	import SingleUpload from "@/components/SingleUpload.vue";
	import { Upload } from '@/api/index';
	import { Pcct } from '@/api/index';
	import { Good } from '@/api/index';
	import E from 'wangeditor';
	export default {
		//注册组件
		components: {
			SingleUpload: SingleUpload
		},
		props: ['id'],
		data() {
			return {
				form: {
					cate_1st: '',
					cate_2nd: '',
					cate_3rd: '',
					name: '',
					hotPoint: '',
					price: '',
					marketPrice: '',
					cost: '',
					discount: '',
					inventory: '1000', //库存
					articleNo: '',
					img_lg: '',
					img_md: '',
					slider: '',
					detail: '',
					freight: '0',
					brand: '',
					province: '',
					city: '',
					county: '',
				},
				headers: {
					//给上传组件添加token
					Authorization: `Bearer ${sessionStorage.token}`
				},
				options_1st: [],
				options_2nd: [],
				options_3rd: [],
				provinceAll: [],
				cityAll: [],
				countyAll: [],
				dialogImageUrl: '',
				dialogVisible: false,

				// 轮播图
				resolveSlider: [],
				urlResolveSlider: [],
				fileList: [],

				rules: {
					name: [
						{ required: true, message: '商品名称不能为空', trigger: 'blur' },
						{ pattern: /^[\u4e00-\u9fa5]{3,200}$/, message: '请输入正确的商品名称', trigger: 'blur' }
					],
					hotPoint: [
						{ required: true, message: '商品卖点不能为空', trigger: 'blur' },
						{ pattern: /^[\u4e00-\u9fa5]{0,140}$/, message: '请输入正确的商品卖点内容', trigger: 'blur' }
					],
					price: [
						{ required: true, message: '商品价格不能为空', trigger: 'blur' },
						{ pattern: /^[0-9]*$/, message: '请输入正确的商品价格', trigger: 'blur' }
					],
					marketPrice: [
						{ required: true, message: '市场价不能为空', trigger: 'blur' },
						{ pattern: /^[0-9]*$/, message: '请输入正确的市场价格', trigger: 'blur' }
					],
					cost: [
						{ required: true, message: '成本价不能为空', trigger: 'blur' },
						{ pattern: /^[0-9]*$/, message: '请输入正确的成本价', trigger: 'blur' }
					],
					inventory: [
						{ required: true, message: '商品库存不能为空', trigger: 'blur' },
						{ pattern: /^[0-9]*$/, message: '请输入正确的商品库存', trigger: 'blur' }
					],
					articleNo: [
						{ required: true, message: '商品货号不能为空', trigger: 'blur' },
						{ pattern: /^[\u4E00-\u9FA5A-Za-z0-9\.\-\/]{0,20}$/, message: '请输入正确的商品货号', trigger: 'blur' }
					],
					img_md: [
						{ required: true, message: '商品主图不能为空', trigger: 'blur' },
					],
					slider: [
						{ required: true, message: '商品轮播图不能为空', trigger: 'blur' },
					],
					freight: [
						{ required: true, message: '运费不能为空', trigger: 'blur' },
						{ pattern: /^[0-9]*$/, message: '请输入正确的运费价格', trigger: 'blur' }
					]
				},

			}
		},
		computed: {
			discount: {
				get: function() {
					if (this.form.price != '' && this.form.marketPrice != '') {
						var discount = this.form.price / this.form.marketPrice * 10;
						this.form.discount = discount;
						return discount;
					}
				},
			}
		},
		async created() {
			//获取一级分类的数据
			let options = await this.loadSubcate(1);
			this.options_1st = options;
			//获取省数据
			let areaOptions = await this.loadSubProvince(1);
			this.provinceAll = areaOptions;

			this.loadDetail(this.id);
		},
		watch: {
			'form.cate_1st': async function(val) {
				//获取二级分类数据
				let options = await this.loadSubcate(val);
				this.options_2nd = options;
				this.form.cate_2nd = options[0].id;
			},
			'form.cate_2nd': async function(val) {
				//获取三级分类数据
				let options = await this.loadSubcate(val);
				this.options_3rd = options;
				this.form.cate_3rd = options[0].id;
			},
			'form.province': async function(val) {
				//获取市数据
				let options = await this.loadSubCity(val);
				this.cityAll = options;
				this.form.city = options[0].city_id;
			},
			'form.city': async function(val) {
				//获取市数据
				let options = await this.loadSubCounty(val);
				this.countyAll = options;
				this.form.county = options[0].county_id;
			},
		},
		async mounted() {
			//获取商品详情
			let good = await this.loadDetail(this.id);
			this.form = good;

			// 富文本编辑器
			var editor = new E(this.$refs.editor);
			// 同步 form 数据
			editor.customConfig.onchange = (html) => {
				this.form.detail = html
			}
			// 图片上传
			// 配置 api 接口
			editor.customConfig.uploadImgServer = '/api/upload/editor';
			// 配置上传的 fileName
			editor.customConfig.uploadFileName = 'file';
			// 自定义 header
			editor.customConfig.uploadImgHeaders = {
				Authorization: `Bearer ${sessionStorage.token}`
			};
			editor.create();
			editor.txt.html(this.form.detail);

			// 轮播图
			this.resolveSlider = this.form.slider.split(",");
			this.resolveSlider.forEach((item) => {
				this.urlResolveSlider.url = item;
				this.fileList.push(this.urlResolveSlider);
				this.urlResolveSlider = {};
			});

		},
		methods: {
			//获取商品详情
			async loadDetail(id) {
				let { status, data } = await Good.detail({ id });
				if (status) {
					return data;
				}
			},

			handleUploadSuccess(res) {
				console.log(res);
				this.form.img_lg = res.lgImg;
				this.form.img_md = res.lgImg;
			},
			handleSuccess(file) {
				if (this.form.slider == '') {
					this.form.slider = file.src;
				} else {
					this.form.slider = this.form.slider + ',' + file.src;
				}
			},
			//根据传参去获取下一级分类
			async loadSubcate(pId) {
				let { status, data } = await Category.sub({ pId });
				return data; //async return出去的是promise对象
			},
			//获取省份的接口
			async loadSubProvince(pId) {
				let { status, data } = await Pcct.province({});
				return data; //async return出去的是promise对象
			},
			//获取市的接口
			async loadSubCity(id) {
				let { status, data } = await Pcct.city({ id });
				return data; //async return出去的是promise对象
			},
			//获取县区
			async loadSubCounty(id) {
				let { status, data } = await Pcct.county({ id });
				return data; //async return出去的是promise对象
			},
			async handleRemove(file) {
				let { status, msg } = await Upload.del({ src: file.response.src });
				if (status) {
					this.$message.success(msg);
				}
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			handleSubmit(form) {
				this.$refs[form].validate(async (valid) => {
					if (valid) {
						let { status } = await Good.edit({ ...this.form });
						if (status) {
							this.$message.success('修改成功');
							this.$router.push('/good/list');
						} else {
							this.$message.success('修改失败');
						}
					} else {
						alert("发布失败！");
						return false;
					}
				});
			}
		}
	}
</script>

<style>
	.goodName {
		width: 650px;
	}

	.priceInput {
		width: 180px;
	}

	p {
		margin: 0 !important;
		font-size: 12px;
		color: #999;
	}

	.titleBlack {
		display: inline-block;
		height: 20px;
		width: 100%;
		padding: 10px 0;
		background-color: #f5f5f5;
		margin-bottom: 10px;
	}
</style>
