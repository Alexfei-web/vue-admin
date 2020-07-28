<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>菜单权限</span>
			</div>
			<el-alert style="margin-bottom: 20px;" title="Tips" type="warning" description="设置后台管理系统的左侧菜单，目前至多支持两层菜单，三层以上菜单将不会显示。"
			 :closable="false" show-icon>
			</el-alert>
			<!-- 树形组件 -->
			<el-tree ref="tree" :load="loadNode" node-key="id" :default-expanded-keys="[0]" lazy :props="defaultProps">
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span>{{ node.label }}</span>
					<span>
						<el-button type="text" :icon="'el-icon-'+data.icon" :disabled="node.level==1" size="mini" @click.stop="openIconModal(node,data)">
							图标
						</el-button>
						<el-button type="text" icon="el-icon-edit" :disabled="node.level==1" size="mini" @click.stop="openEditModal(node,data)">
							编辑
						</el-button>
						<el-button type="text" icon="el-icon-plus" size="mini" @click.stop="openInsertModal(node,data)">
							添加
						</el-button>
						<el-button type="text" icon="el-icon-delete" :disabled="node.level==1" size="mini" @click.stop="openRemoveModal(node, data)">
							删除
						</el-button>
						<span class="number">
							显示序号：
							<el-tag>{{node.data.order}}</el-tag>
						</span>
					</span>
				</span>
			</el-tree>
		</el-card>
		<!-- 添加弹窗 -->
		<el-dialog title="添加节点" :visible.sync="insertModalShow">
			<el-form :model="insertForm" ref="insertForm" :rules="rules">
				<el-form-item label="菜单名称" label-width="120px" prop="name">
					<el-input v-model="insertForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="链接地址" label-width="120px" prop="path">
					<el-input v-model="insertForm.path" autocomplete="off" placeholder="指定此菜单的链接地址,选填"></el-input>
				</el-form-item>
				<el-form-item label="显示顺序" label-width="120px" prop="order">
					<el-input v-model="insertForm.order" autocomplete="off" placeholder="显示顺序按照数字从大到小,如2001"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="insertModalShow = false">取 消</el-button>
				<el-button type="primary" @click="handleInsertNode('insertForm')">添 加</el-button>
			</div>
		</el-dialog>
		<!-- 编辑弹窗 -->
		<el-dialog title="编辑节点" :visible.sync="editModalShow">
			<el-form :model="editForm" ref="editForm" :rules="rules">
				<el-form-item label="菜单名称" label-width="120px" prop="name">
					<el-input v-model="editForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="链接地址" label-width="120px">
					<el-input v-model="editForm.path" autocomplete="off" placeholder="指定此菜单的链接地址,选填"></el-input>
				</el-form-item>
				<el-form-item label="显示顺序" label-width="120px" prop="order">
					<el-input v-model="editForm.order" autocomplete="off" placeholder="显示顺序按照数字从大到小,如2001"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editModalShow = false">取 消</el-button>
				<el-button type="primary" @click="handleUploadNode('editForm')">保 存</el-button>
			</div>
		</el-dialog>
		<el-dialog title="选择图标" :visible.sync="iconModalShow" width="1100px">
			<ul class="clearfix">
				<li class="icon" :class="{ clicked:isClicked == index}" v-for="(item,index) in iconArr" @click="handleClicked(index)">
					<i :class="'el-icon-'+item.name"></i>
					<span>{{item.name}}</span>
				</li>
			</ul>
			<el-pagination style="text-align: right;"  @current-change="handleCurrentChange" 
			background layout="prev, pager, next" :total="100">
			</el-pagination>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editModalShow = false">取 消</el-button>
				<el-button type="primary" @click="handleUpload">确 定</el-button>
			</div>
		</el-dialog>
	</div>

</template>

<script>
	import { Permissions } from '@/api/index';
	import { Admin } from '@/api/index';
	import SingleUpload from "@/components/SingleUpload.vue";
	export default {
		components: {
			SingleUpload: SingleUpload
		},
		data() {
			return {
				defaultProps: {
					label: 'name'
				},
				insertForm: {
					name: '',
					pId: '',
					path: '',
					order: '',
				},
				editForm: {
					id: '',
					name: '',
					path: '',
					order: '',
				},
				nodeData: {}, //节点数据
				node: {}, //节点
				insertModalShow: false,
				editModalShow: false,
				iconModalShow: false,
				iconArr: [],
				isClicked: 0, 
				iconSetId:'',
				iconSetIconId:'',
				iconSetName:'',
				rules: {
					name: [{
						required: true,
						message: '菜单名不能为空',
						trigger: 'blur'
					}],
					order: [{
						required: true,
						message: '显示顺序不能为空',
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
					let { status, data } = await Permissions.sub({ pId: 0 });
					if (status) {
						return resolve(data);
					}
					// return resolve([{ id: 0, name: "全部分类" }]);
				}
				//父级节点id
				let pId = node.data.id;
				//获取子节点数据
				let { status, data } = await Permissions.sub({ pId });
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
						let { status, msg } = await Permissions.update({ ...this.editForm });
						if (status) {
							this.$message.success(msg);
							//更新节点
							this.node.data = this.editForm;
							this.editModalShow = false;
							this.insertForm.name = '';
							this.insertForm.img = '';
						} else {
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
						let { status, msg, data } = await Permissions.add({ ...this.insertForm });
						if (status) {
							this.$message.success(msg);
							//插入新的tree节点
							this.$refs.tree.append({ ...data, ...this.insertForm }, this.node); //this.node是上边存的
							this.insertModalShow = false;
						} else {
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
					let { status } = await Permissions.remove({ id: node.data.id });
					if (status) {
						//更新dom
						this.$refs.tree.remove(node);
						this.$message.success('删除成功');
					}
				}).catch(() => {
					this.$message.info('取消删除');
				})
			},
			handleUploadSuccess(res) {
				console.log(res);
				this.editForm.img = res.src;
			},
			handleUploadSuccessAdd(res) {
				this.editForm.img = res.src;
			},
			async openIconModal(node) {
				this.node = node;
				this.iconSetId = node.data.id;
				this.iconModalShow = true;
				// var index = 
				let { status, icons } = await Admin.iconList({ pageSize: 30, pageIndex: 1 });
				console.log(icons);
				if (status) {
					this.iconArr = icons;
				}
			},
			//分页器
			//改变当前页数
			async handleCurrentChange(val) {
				let { icons } = await Admin.iconList({ pageSize: 30, pageIndex: val });
				//赋值
				this.iconArr = icons;
			},
			handleClicked(index){
				this.isClicked = index;
				this.iconSetIconId = index;
				this.iconSetName = this.iconArr[index].name;
			},
			async handleUpload(){
				let {status} = await Admin.iconSet({id:this.iconSetId,icon:this.iconSetIconId});
				if(status){
					this.iconModalShow = false;
					this.node.data.icon = this.iconSetName;
				}
			}
		}
	};
</script>

<style scoped="scoped">
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}

	.number {
		font-size: 12px;
		vertical-align: middle;
	}

	ul,
	li {
		list-style-type: none;
	}

	ul {
		border: 1px solid #eee;
		padding: 0 !important;
	}

	ul>.icon {
		float: left;
		width: 10%;
		text-align: center;
		height: 100px;
		/* line-height: 100px; */
		color: #666;
		font-size: 10px;
		border-right: 1px solid #eee;
		border-bottom: 1px solid #eee;
		margin-right: -1px;
		margin-bottom: -1px;


	}

	ul>.icon i {
		display: block;
		font-size: 26px;
		margin-bottom: 15px;
		color: #606266;
		margin-top: 20px;
	}

	ul>.icon:hover i {
		color: #5cb6ff;
	}

	ul>.icon:hover {
		color: #5cb6ff;
	}

	ul>.icon.clicked {
		color: white;
		background-color: #5cb6ff;
	}

	ul>.icon.clicked i {
		color: white;
	}

	ul>.icon.clicked:hover {
		color: white;
		background-color: #5cb6ff;
	}

	ul>.icon.clicked:hover i {
		color: white;
	}

	.clearfix {
		*zoom: 1;
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		line-height: 0;
		content: "";
	}

	.clearfix:after {
		clear: both;
	}
</style>
