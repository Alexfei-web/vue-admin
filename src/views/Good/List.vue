<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>商品列表</span>
		</div>
		<el-table :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
			<el-table-column prop="name" label="商品名称" width="500">
				<template slot-scope="scope">
					<div class="goodShow">
						<img :src="scope.row.img_md" style="width: 100px" />
						<div style="margin-left: 20px;">
							<div>{{scope.row.name}}</div>
							<div>商品货号：{{scope.row.articleNo}}</div>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="price" label="价格" sortable width="180">
			</el-table-column>
			<el-table-column prop="inventory" label="库存" sortable width="180">
			</el-table-column>
			<el-table-column prop="create_time" label="发布时间" sortable>
			</el-table-column>
			<el-table-column prop="operation" label="操作" width="220">
				<template slot-scope="scope">
					<el-link :href="`#/good/edit/${scope.row.id}`">
						<!-- 一定要带# -->
						<el-button type="primary" plain icon="el-icon-edit"></el-button>
					</el-link>
					<el-button class="btn" type="danger" plain icon="el-icon-delete" @click="handleRemove(scope.row.id,scope.$index)"></el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination style="text-align: right;" @current-change="handleCurrentChange" @size-change="handleSizeChange"
		 background :page-sizes="[4, 8, 16, 32]" :page-size="100" layout="prev, pager, next,sizes,total" :total="total">
		</el-pagination>
	</el-card>
</template>

<script>
	import { Good } from "@/api/index";
	export default {
		data() {
			return {
				total: 0,
				pageIndex: 1,
				pageSize: 4,
				tableData: []
			}
		},
		created() {
			//获取列表数据
			this.loadList();
		},
		methods: {
			async loadList() {
				let { goods, total } = await Good.list({ pageSize: 4, pageIndex: 1 });
				this.tableData = goods;
				this.total = total;
			},
			//改变当前页数
			async handleCurrentChange(val) {
				// console.log(val);
				this.pageIndex = val;
				var size = this.pageSize; //每页个数不变
				// console.log(val);
				let { goods, total } = await Good.list({ pageSize: size, pageIndex: val });
				//赋值
				this.tableData = goods;
				this.total = total;
			},
			//每页个数改变
			async handleSizeChange(val) {
				this.pageSize = val;
				var index = this.pageIndex; //当前页不变
				let { goods, total } = await Good.list({ pageSize: val, pageIndex: index });
				//赋值
				this.tableData = goods;
				this.total = total;
			},
			handleRemove(id, i) {
				this.$confirm("此操作将永久删除该管理员，是否继续？", {
					type: 'warning',
				}).then(async () => {
					let { status } = await Good.remove({id:id});
					if (status) {
						//更新dom
						this.tableData.splice(i, 1);
						this.$message.info('删除成功');
					}
				}).catch(() => {
					this.$message.info('取消删除');
				})
			}
		},
	}
</script>

<style scoped="scoped">
	.goodShow {
		display: flex;
		align-items: center;
	}

	.btn {
		margin-left: 10px;
	}
</style>
