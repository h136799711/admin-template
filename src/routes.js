// 公用组件
const NotFound = r => require.ensure([], () => r(require('./pages/404/NotFound.vue')), 'notFound')
const Login = r => require.ensure([], () => r(require('./pages/account/Login.vue')), 'login')
const Logout = r => require.ensure([], () => r(require('./pages/account/Logout.vue')), 'logout')
// admin组件，管理后台首页部分
const Admin = r => require.ensure([], () => r(require('./pages/Admin.vue')), 'admin')
const AdminIndex = r => require.ensure([], () => r(require('./pages/admin/index.vue')), 'adminIndex')

// 数据字典
const Datatree = r => require.ensure([], () => r(require('./pages/datatree/index.vue')), 'datatree')
const DatatreeIndex = r => require.ensure([], () => r(require('./pages/datatree/index.vue')), 'datatreeIndex')

// 接口日志
const ApiRequestLog = r => require.ensure([], () => r(require('./pages/api/log.vue')), 'apiRequestLog')
// 应用管理
const ClientsIndex = r => require.ensure([], () => r(require('./pages/clients/index.vue')), 'clientsIndex')
// 角色管理
const RolesIndex = r => require.ensure([], () => r(require('./pages/roles/index.vue')), 'rolesIndex')
// 角色菜单
const RolesMenu = r => require.ensure([], () => r(require('./pages/roles/menu.vue')), 'rolesMenu')
// 角色策略
const RolesPolicy = r => require.ensure([], () => r(require('./pages/roles/policy.vue')), 'rolesPolicy')
// 角色用户
const RolesUser = r => require.ensure([], () => r(require('./pages/roles/user.vue')), 'rolesUser')
// 策略管理
const PolicyIndex = r => require.ensure([], () => r(require('./pages/policy/index.vue')), 'policyIndex')

const MessageIndex = r => require.ensure([], () => r(require('./pages/message/index.vue')), 'messageIndex')
// 配置
const ConfigIndex = r => require.ensure([], () => r(require('./pages/config/index.vue')), 'ConfigIndex')

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
			{
				path: 'api',
				component: ApiRequestLog,
				children: [
					{ name: 'apiRequestLog', path: 'log', component: ApiRequestLog }
				]
			},
			{
				path: 'clients',
				component: ClientsIndex,
				children: [
					{ name: 'ClientsIndex', path: 'index', component: ClientsIndex }
				]
			},
			{
				path: 'roles',
				component: RolesIndex,
				children: [
					{ path: 'index', component: RolesIndex }
				]
			},
			{ path: 'roles/menu/:id', component: RolesMenu, props: true },
			{ path: 'roles/policy/:id', component: RolesPolicy, props: true },
			{ path: 'roles/user/:id', component: RolesUser, props: true },
			{
				path: 'policy',
				component: PolicyIndex,
				children: [
					{ path: 'index', component: PolicyIndex }
				]
			},
			{
				path: 'message',
				component: MessageIndex,
				children: [
					{ path: 'index', component: MessageIndex }
				]
			},
			{
				path: 'config',
				component: ConfigIndex,
				children: [
					{ path: 'index', component: ConfigIndex }
				]
			},
			{
				path: 'index',
				component: AdminIndex,
				children: [
					{ path: 'index', component: AdminIndex }
				]
			},
			{ path: '*', component: NotFound }
    ]
  },
  { path: '*', component: NotFound }
]

export default routes
