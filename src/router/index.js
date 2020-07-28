import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui'

Vue.use(VueRouter)

//页面级组件
import Layout from '@/components/Layout.vue'

const routes = [{
		path: '/login',
		alias: '/',
		name: 'Login',
		component: () => import('@/views/Login.vue'),
		// meta: { requiresAuth: false },
	},
	{
		path: '/register',
		name: 'Register',
		component: () => import('@/views/Register.vue'),
		// meta: { requiresAuth: false },
	},
	{
		path: '/good/',
		name: 'Good',
		component: Layout,
		// meta: { requiresAuth: true },
		children: [{
				path: 'category',
				name: 'GoodCategory',
				component: () => import('@/views/Good/Category.vue')
			},
			{
				path: 'list',
				name: 'GoodList',
				component: () => import('@/views/Good/List.vue')
			},
			{
				path: 'release',
				name: 'GoodRelease',
				props: true,
				component: () => import('@/views/Good/Release.vue')
			},
			{
				path: 'edit/:id',
				name: 'GoodEdit',
				props: true,
				component: () => import('@/views/Good/Edit.vue')
			}
		]
	},
	{
		path: '/order/',
		name: 'Order',
		component: Layout,
		// meta: { requiresAuth: true },
		children: [{
				path: 'list',
				name: 'OrderList',
				component: () => import('@/views/Order/List.vue')
			}]
	},
	{
		path: '/account/',
		name: 'Account',
		component: Layout,
		// meta: { requiresAuth: true },
		children: [{
				path: 'content',
				name: 'AccountContent',
				component: () => import('@/views/Account/Content.vue')
			}]
	},
	{
		path: '/user/',
		name: 'User',
		component: Layout,
		// meta: { requiresAuth: true },
		children: [{
				path: 'list',
				name: 'UserList',
				component: () => import('@/views/User/List.vue')
			}]
	},
	{
		path: '/permissions/',
		name: 'Permissions',
		component: Layout,
		// meta: { requiresAuth: true },
		children: [{
				path: 'menu',
				name: 'permissionsMenu',
				component: () => import('@/views/Permissions/Menu.vue')
			},{
				path: 'role',
				name: 'permissionsRole',
				component: () => import('@/views/Permissions/Role.vue')
			}]
	},
]

const router = new VueRouter({
	routes
})

export default router
