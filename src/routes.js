// 公用组件
const NotFound = r => require.ensure([], () => r(require('./components/404/NotFound.vue')), 'notFound')
const Login = r => require.ensure([], () => r(require('./components/account/Login.vue')), 'login')
const Logout = r => require.ensure([], () => r(require('./components/account/Logout.vue')), 'logout')
// admin组件，管理后台首页部分
const Admin = r => require.ensure([], () => r(require('./components/Admin.vue')), 'admin')
const AdminIndex = r => require.ensure([], () => r(require('./components/admin/index.vue')), 'adminIndex')

// 数据字典
const Datatree = r => require.ensure([], () => r(require('./components/datatree/index.vue')), 'datatree')
const DatatreeIndex = r => require.ensure([], () => r(require('./components/datatree/index.vue')), 'datatreeIndex')

const routes = [
  // 地址为空的时候跳转
  { path: '', redirect: '/admin' },
	{ path: '/', redirect: '/admin' },
  // 登录
  { path: '/login', component: Login },
  // 退出
  { path: '/logout', component: Logout },
  // 登录后管理首页
  { path: '/admin',
    component: Admin,
    children: [
			{
				path: 'datatree',
				component: Datatree,
				children: [
					{ name: 'datatreeIndex', path: 'index', component: DatatreeIndex }
				]
			},
			{ path: 'index/index', component: AdminIndex },
    ]
  },
  { path: '*', component: NotFound }
]

export default routes
