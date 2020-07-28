<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>订单列表</span>
		</div>
		<el-table :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
			<el-table-column prop="goodsList[0].order_id" label="#" width="50">
			</el-table-column>
			<el-table-column label="">
				<template slot-scope="scope">
					<el-table style="width: 100%" :data="scope.row.goodsList">
						<el-table-column label="商品" width="400">
							<template slot-scope="scope">
								<div class="goodShow">
									<img :src="scope.row.img_md" style="width: 100px" />
									<div>{{scope.row.name}}</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="goods_price" label="单价">
						</el-table-column>
						<el-table-column prop="goods_num" label="数量">
						</el-table-column>
					</el-table>
				</template>
			</el-table-column>
			<el-table-column prop="payment" label="付款总额" width="150">
			</el-table-column>
			<el-table-column prop="create_time" label="下单时间" sortable width="200">
			</el-table-column>
			<el-table-column prop="status" label="状态" sortable width="120">
			</el-table-column>
			<el-table-column prop="operation" label="操作" width="100">
				<template slot-scope="scope">
					<el-button type="primary" plain icon="el-icon-edit"></el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-card>
</template>

<script>
	import { Order } from "@/api/index";
	
	export default {
		data() {
			return {
				tableData: [

				]
			}
		},
		created() {
			this.loadList();
		},
		methods: {
			
			//加载列表数据
			async loadList() {
				// console.log(data);
				let { status, data } = await Order.all({ status: 'all' });
				if (status) {
					data.forEach((item)=>{
						item.create_time = new Date(item.create_time).toLocaleString();
					})
					this.tableData = data;
				}
			}
		}
	}
</script>

<style>
	.goodShow {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
