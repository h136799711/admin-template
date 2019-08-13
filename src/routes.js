// 公用组件
const NotFound = r => require.ensure([], () => r(require('./pages/404/NotFound.vue')), 'notFound')
const Login = r => require.ensure([], () => r(require('./pages/account/Login.vue')), 'login')
const Logout = r => require.ensure([], () => r(require('./pages/account/Logout.vue')), 'logout')
const Password = r => require.ensure([], () => r(require('./pages/account/password.vue')), 'password')
const Avatar = r => require.ensure([], () => r(require('./pages/account/avatar.vue')), 'avatar')
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
// 消息
const MessageIndex = r => require.ensure([], () => r(require('./pages/message/index.vue')), 'messageIndex')
// 配置
const ConfigIndex = r => require.ensure([], () => r(require('./pages/config/index.vue')), 'ConfigIndex')
// 菜单
const MenuIndex = r => require.ensure([], () => r(require('./pages/menu/index.vue')), 'MenuIndex')
// 轮播
const BannersIndex = r => require.ensure([], () => r(require('./pages/banners/index.vue')), 'bannersIndex')

// 相册
const AlbumIndex = r => require.ensure([], () => r(require('./pages/album/index.vue')), 'albumIndex')
// 相册分类
const AlbumCategory = r => require.ensure([], () => r(require('./pages/album/category.vue')), 'AlbumCategory')
// 相册照片
const AlbumPhoto = r => require.ensure([], () => r(require('./pages/album/photo.vue')), 'AlbumPhoto')
// 文章
const CmsArticle = r => require.ensure([], () => r(require('./pages/cms_article/index.vue')), 'CmsArticle')

// Shop* * * * ** * * * ** * * * ** * * * ** * * * ** * * * ** * * * ** * * * *
const SpCate = r => require.ensure([], () => r(require('./pages/spcate/index.vue')), 'SpCate')
const SpBrand = r => require.ensure([], () => r(require('./pages/sp_brand/index.vue')), 'SpBrand')
const SpBrandRelate = r => require.ensure([], () => r(require('./pages/spcate/relate_brand.vue')), 'SpBrandRelate')
const SpProp = r => require.ensure([], () => r(require('./pages/sp_prop/index.vue')), 'SpProp')
const SpPropValue = r => require.ensure([], () => r(require('./pages/sp_prop/value.vue')), 'SpPropValue')
const SpPropRelate = r => require.ensure([], () => r(require('./pages/spcate/relate_prop.vue')), 'SpPropRelate')
// Shop END * * * * ** * * * ** * * * ** * * * ** * * * ** * * * *
// Pay ***********************
const PayOrder = r => require.ensure([], () => r(require('./pages/pay_order/index.vue')), 'PayOrder')
// Pay END *******************

// Video ***********************
const VideoIndex = r => require.ensure([], () => r(require('./pages/video/index.vue')), 'VideoIndex')
const VideoCate = r => require.ensure([], () => r(require('./pages/video/cate.vue')), 'VideoCate')
const VideoSource = r => require.ensure([], () => r(require('./pages/video/source.vue')), 'VideoSource')
const VideoPlay = r => require.ensure([], () => r(require('./pages/video/play.vue')), 'VideoPlay')
// Video END *******************

// Goods ***********************
const GoodsIndex = r => require.ensure([], () => r(require('./pages/goods/index.vue')), 'GoodsIndex')
const GoodsCreate = r => require.ensure([], () => r(require('./pages/goods/create.vue')), 'GoodsCreate')
// Goods END *******************

const routes = [
  // 地址为空的时候跳转
  { path: '', redirect: '/admin' },
  { path: '/', redirect: '/admin' },
  // 登录
  { path: '/login', component: Login },
  // 退出
  { path: '/logout', component: Logout },
  // 登录后管理首页
  {
    path: '/admin',
    component: Admin,
    children: [
      {
        path: 'goods',
        component: GoodsIndex,
        children: [
          { path: 'index', component: GoodsIndex },
        ]
      },
      { path: 'goods/create', component: GoodsCreate, props: false },
      {
        path: 'video',
        component: VideoIndex,
        children: [
          { path: 'index', component: VideoIndex },
        ]
      },
      { path: 'video/cate', component: VideoCate, props: false },

      { path: 'video/source/:id', component: VideoSource, props: true },
      { path: 'video/source/play/:vtype/:vuri', component: VideoPlay, props: true },
      {
        path: 'pay_order',
        component: PayOrder,
        children: [
          { path: 'index', component: PayOrder }
        ]
      },
      {
        path: 'sp_brand',
        component: SpBrand,
        children: [
          { path: 'index', component: SpBrand, props: true }
        ]
      },
      {
        path: 'spcate',
        component: SpCate,
        children: [
          { path: 'index/:id?', component: SpCate, props: true }
        ]
      },
      { path: 'spcate/relate_prop/:id', component: SpPropRelate, props: true },
      { path: 'spcate/relate_brand/:id', component: SpBrandRelate, props: true },
      {
        path: 'sp_prop',
        component: SpProp,
        children: [
          { path: 'index', component: SpProp }
        ]
      },
      { path: 'sp_prop/value/:id', component: SpPropValue, props: true },
      {
        path: 'cms_article',
        component: CmsArticle,
        children: [
          { path: 'index', component: CmsArticle }
        ]
      },
      {
        path: 'banners',
        component: BannersIndex,
        children: [
          { path: 'index', component: BannersIndex }
        ]
      },
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
        path: 'album',
        component: AlbumIndex,
        children: [
          { path: 'index', component: AlbumIndex }
        ]
      },
      {
        path: 'album',
        component: AlbumCategory,
        children: [
          { path: 'category', component: AlbumCategory }
        ]
      },
      { path: 'album/photo/:id', component: AlbumPhoto, props: true },
      {
        path: 'config',
        component: ConfigIndex,
        children: [
          { path: 'index', component: ConfigIndex }
        ]
      },
      {
        path: 'menu',
        component: MenuIndex,
        children: [
          { path: 'index', component: MenuIndex }
        ]
      },
      { path: 'account/password', component: Password },
      { path: 'account/avatar', component: Avatar },
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
