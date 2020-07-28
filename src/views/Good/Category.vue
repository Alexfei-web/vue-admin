<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>商品分类</span>
			</div>
			<!-- 树形组件 -->
			<el-tree ref="tree" :load="loadNode" node-key="id" :default-expanded-keys="[0]" lazy :props="defaultProps">
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span>{{ node.label }}</span>
					<span>
						<el-button type="text" icon="el-icon-edit" :disabled="node.level==1" size="mini" @click.stop="openEditModal(node,data)">
							编辑
						</el-button>
						<el-button type="text" icon="el-icon-plus" size="mini" @click.stop="openInsertModal(node,data)">
							添加
						</el-button>
						<el-button type="text" icon="el-icon-delete" :disabled="node.level==1" size="mini" @click.stop="openRemoveModal(node, data)">
							删除
						</el-button>
					</span>
				</span>
			</el-tree>
		</el-card>
		<!-- 添加弹窗 -->
		<el-dialog title="添加分类" :visible.sync="insertModalShow">
			<el-form :model="insertForm" ref="insertForm" :rules="rules">
				<el-form-item label="分类名称" label-width="120px" prop="name">
					<el-input v-model="insertForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="图片" label-width="120px">
					<single-upload loadHead="/api/upload/common" :url="insertForm.img" @success="handleUploadSuccessAdd($event)" @remove="insertForm.img=''"></single-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="insertModalShow = false">取 消</el-button>
				<el-button type="primary" @click="handleInsertNode('insertForm')">添 加</el-button>
			</div>
		</el-dialog>
		<!-- 编辑弹窗 -->
		<el-dialog title="编辑分类" :visible.sync="editModalShow">
			<el-form :model="editForm" ref="editForm" :rules="rules">
				<el-form-item label="分类名称" label-width="120px" prop="name">
					<el-input v-model="editForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="图片" label-width="120px">
					<single-upload loadHead="/api/upload/common" :url="editForm.img" @success="handleUploadSuccess($event)" @remove="editForm.img=''"></single-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editModalShow = false">取 消</el-button>
				<el-button type="primary" @click="handleUploadNode('editForm')">保 存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { Category } from '@/api/index';
	import SingleUpload from "@/components/SingleUpload.vue";
	export default {
		components:{
			SingleUpload:SingleUpload
		},
		data() {
			return {
				defaultProps: {
					label: 'name'
				},
				insertForm: {
					name: '',
					pId: '',
					img:'',
				},
				editForm: {
					id: '',
					name: '',
					pId: '',
					img:'',
				},
				nodeData: {}, //节点数据
				node: {}, //节点
				insertModalShow: false,
				editModalShow: false,
				rules: {
					name: [{
						required: true,
						message: '名称不能为空',
						trigger: 'blur'
					}]
				},
			};
		},
		methods: {
			async loadNode(node, resolve) {
				//node：节点对象
				//resolve:返回下一级节点数据的方法
				if (node.level == 0) {
					let { status, data } = await Category.sub({ pId: 0 });
					if (status) {
						return resolve(data);
					}
					// return resolve([{ id: 0, name: "全部分类" }]);
				}
				//父级节点id
				let pId = node.data.id;
				//获取子节点数据
				let { status, data } = await Category.sub({ pId });
				if (status) {
					return resolve(data);
				}
			},
			//打开编辑的model
			openEditModal(node, data) {
				this.editForm = { ...data };
				this.node = node;
				this.editModalShow = true;
			},
			//编辑节点
			handleUploadNode(editForm) {
				this.$refs[editForm].validate(async (valid) => {
					if (valid) {
						let { status, msg } = await Category.update({ ...this.editForm });
						if (status) {
							this.$message.success(msg);
							//更新节点
							this.node.data = this.editForm;
							this.editModalShow = false;
						}else {
							this.$message.success('修改失败');
						}
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			//打开插入Model
			openInsertModal(node, data) {
				//node：节点对象，data:节点数据
				// console.log(node, data);
				//把父节点node对象转存一下
				this.node = node;
				this.insertForm.name = '';
				this.insertForm.img = '';
				this.insertForm.pId = data.id;
				this.insertModalShow = true;
			},
			//插入节点
			handleInsertNode(insertForm) {
				this.$refs[insertForm].validate(async (valid) => {
					if (valid) {
						let { status, msg, data } = await Category.add({ ...this.insertForm });
						if (status) {
							this.$message.success(msg);
							//插入新的tree节点
							this.$refs.tree.append({ ...data, ...this.insertForm }, this.node); //this.node是上边存的
							this.insertModalShow = false;
						}else {
							this.$message.success('修改失败');
						}
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			openRemoveModal(node, data) {
				console.log(node);
				this.$confirm("此操作将永久删除该节点，是否继续？", {
					type: 'warning',
				}).then(async () => {
					// let id = node.data.id;
					let { status } = await Category.remove({ id:node.data.id });
					if (status) {
						//更新dom
						this.$refs.tree.remove(node);
						this.$message.info('删除成功');
					}
				}).catch(() => {
					this.$message.info('取消删除');
				})
			},
			handleUploadSuccess(res) {
				console.log(res);
				this.editForm.img = res.src;
			},
			handleUploadSuccessAdd(res){
				this.insertForm.img = res.src;
			}
		}
	};
</script>

<style>
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}
</style>
