import { defineAsyncComponent } from 'vue'

// 公用组件
const NotFound =  defineAsyncComponent(() => import('./pages/404/NotFound.vue'))
const Login = defineAsyncComponent(() => import('./pages/account/Login.vue'))
const Logout = defineAsyncComponent(() => import('./pages/account/Logout.vue'))
const Password = defineAsyncComponent(() => import('./pages/account/password.vue'))
const Avatar = defineAsyncComponent(() => import('./pages/account/avatar.vue'))
// admin组件，管理后台首页部分
const Admin = defineAsyncComponent(() => import('./pages/Admin.vue'))
const AdminIndex = defineAsyncComponent(() => import('./pages/admin/index.vue'))

// 数据字典
const DatatreeIndex = defineAsyncComponent(() => import('./pages/datatree/index.vue'))

// 接口日志
const ApiRequestLog = defineAsyncComponent(() => import('./pages/api/log.vue'))
// 应用管理
const ClientsIndex = defineAsyncComponent(() => import('./pages/clients/index.vue'))
// 角色管理
const RolesIndex = defineAsyncComponent(() => import('./pages/roles/index.vue'))
// 角色菜单
const RolesMenu = defineAsyncComponent(() => import('pages/roles/menu.vue'))

// 角色策略
const RolesPolicy = defineAsyncComponent(() => import('./pages/roles/policy.vue'))
// 角色用户
const RolesUser = defineAsyncComponent(() => import('./pages/roles/user.vue'))
// 策略管理
const PolicyIndex = defineAsyncComponent(() => import('./pages/policy/index.vue'))
// 消息
const MessageIndex = defineAsyncComponent(() => import('./pages/message/index.vue'))
// 配置
const ConfigIndex = defineAsyncComponent(() => import('./pages/config/index.vue'))
// 菜单
const MenuIndex = defineAsyncComponent(() => import('./pages/menu/index.vue'))
// 轮播
const BannersIndex = defineAsyncComponent(() => import('./pages/banners/index.vue'))

// 相册
const AlbumIndex = defineAsyncComponent(() => import('./pages/album/index.vue'))
// 相册分类
const AlbumCategory = defineAsyncComponent(() => import('./pages/album/category.vue'))
// 相册照片
const AlbumPhoto = defineAsyncComponent(() => import('./pages/album/photo.vue'))
// 文章
const CmsArticle = defineAsyncComponent(() => import('./pages/cms_article/index.vue'))

// Shop* * * * ** * * * ** * * * ** * * * ** * * * ** * * * ** * * * ** * * * *
const SpCate = defineAsyncComponent(() => import('./pages/spcate/index.vue'))
const SpBrand = defineAsyncComponent(() => import('./pages/sp_brand/index.vue'))
const SpBrandRelate = defineAsyncComponent(() => import('./pages/spcate/relate_brand.vue'))
const SpProp = defineAsyncComponent(() => import('./pages/sp_prop/index.vue'))
const SpPropValue = defineAsyncComponent(() => import('./pages/sp_prop/value.vue'))
const SpPropRelate = defineAsyncComponent(() => import('./pages/spcate/relate_prop.vue'))
// Shop END * * * * ** * * * ** * * * ** * * * ** * * * ** * * * *
// Pay ***********************
const PayOrder = defineAsyncComponent(() => import('./pages/pay_order/index.vue'))
// Pay END *******************

// Video ***********************
const VideoIndex = defineAsyncComponent(() => import('./pages/video/index.vue'))
const VideoCate = defineAsyncComponent(() => import('./pages/video/cate.vue'))
const VideoSource = defineAsyncComponent(() => import('./pages/video/source.vue'))
const VideoPlay = defineAsyncComponent(() => import('./pages/video/play.vue'))
// Video END *******************

// Goods ***********************
const GoodsIndex = defineAsyncComponent(() => import('./pages/goods/index.vue'))
const GoodsCreate = defineAsyncComponent(() => import('./pages/goods/create.vue'))
const GoodsEdit = defineAsyncComponent(() => import('./pages/goods/edit.vue'))
const GoodsSku = defineAsyncComponent(() => import('./pages/goods/sku.vue'))
const GoodsPlace = defineAsyncComponent(() => import('./pages/goods/place.vue'))
const FreightIndex = defineAsyncComponent(() => import('./pages/freight/index.vue'))
const ShopIndex = defineAsyncComponent(() => import('./pages/sp_shop/index.vue'))
const ShopGoods = defineAsyncComponent(() => import('./pages/sp_shop/goods.vue'))
// Goods END *******************

// Book Start *******************
const BookIndex = defineAsyncComponent(() => import('./pages/book/index.vue'))
const BookSource = defineAsyncComponent(() => import('./pages/book/source.vue'))
const BookAllSource = defineAsyncComponent(() => import('./pages/book/all_source.vue'))
const BookManage = defineAsyncComponent(() => import('./pages/book/manage.vue'))
const BookSourcePages = defineAsyncComponent(() => import('./pages/book/pages.vue'))
const BookSourcePages2 = defineAsyncComponent(() => import('./pages/book/index_pages.vue'))
// Book END *******************

// User Start *******************
const UserIndex = defineAsyncComponent(() => import('./pages/user/index.vue'))
const UserSession = defineAsyncComponent(() => import('./pages/user/session.vue'))
const UserProfile = defineAsyncComponent(() => import('./pages/user/profile.vue'))
const UserLog = defineAsyncComponent(() => import('./pages/user/log.vue'))
const UserClient = defineAsyncComponent(() => import('./pages/user/client.vue'))
const UserWithdraw = defineAsyncComponent(() => import('./pages/withdrawals/index.vue'))
const UserCoupon = defineAsyncComponent(() => import('./pages/user/coupon.vue'))
// User END *******************

// FriendShip Start *******************
const FriendShipIndex = defineAsyncComponent(() => import('./pages/friendship_links/index.vue'))
// FriendShip END *******************

// Suggest Start *******************
const SuggestIndex = defineAsyncComponent(() => import('./pages/suggest/index.vue'))
// Suggest END *******************

// Suggest Start *******************
const RechargeIndex = defineAsyncComponent(() => import('./pages/recharge/index.vue'))
const RechargeProfile = defineAsyncComponent(() => import('./pages/recharge/profile.vue'))
// Suggest END *******************

// Region Start *******************
const RegionIndex = defineAsyncComponent(() => import('./pages/region/index.vue'))
const RegionProvince = defineAsyncComponent(() => import('./pages/region/province.vue'))
const RegionCity = defineAsyncComponent(() => import('./pages/region/city.vue'))
const RegionCityArea = defineAsyncComponent(() => import('./pages/region/cityArea.vue'))
const RegionTown = defineAsyncComponent(() => import('./pages/region/town.vue'))
// Region END *******************

// Diet Start *******************
const DtGoodsIndex = defineAsyncComponent(() => import('./pages/dt_goods/index.vue'))
const DtGoodsCreate = defineAsyncComponent(() => import('./pages/dt_goods/create.vue'))
const DtGoodsEdit = defineAsyncComponent(() => import('./pages/dt_goods/edit.vue'))
const DtGoodsSku = defineAsyncComponent(() => import('./pages/dt_goods/sku.vue'))

const DtCouponIndex = defineAsyncComponent(() => import('./pages/dt_coupon/index.vue'))
const DtOrderIndex = defineAsyncComponent(() => import('./pages/dt_order/index.vue'))
const PickupPlaceIndex = defineAsyncComponent(() => import('./pages/pickup_place/index.vue'))
const OrderComplaintsIndex = defineAsyncComponent(() => import('./pages/order_complaints/index.vue'))

// Diet END *******************

const routes = [
  // 地址为空的时候跳转
  // 登录
  { path: '/login', component: Login },
  // 退出
  { path: '/logout', component: Logout },
  // 登录后管理首页
  {
    path: '/admin',
    component: Admin,
    alias: ['/', ''],
    children: [
      { path: 'region/index', component: RegionIndex },
      { path: 'region/province/:id', component: RegionProvince, props: true },
      { path: 'region/city/:code', component: RegionCity, props: true },
      { path: 'region/city_area/:code', component: RegionCityArea, props: true },
      { path: 'region/town/:code', component: RegionTown, props: true },
      { path: 'suggest/index', component: SuggestIndex },
      { path: 'friendship_links/index', component: FriendShipIndex },
      { path: 'user/index', component: UserIndex },
      { path: 'withdrawal/index', component: UserWithdraw },
      { path: 'recharge/index', component: RechargeIndex },
      { path: 'recharge/profile/:id', component: RechargeProfile, props: true },
      { path: 'user/session/:id/:limit', component: UserSession, props: true },
      { path: 'user/log/:id', component: UserLog, props: true },
      { path: 'user/client/:id', component: UserClient, props: true },
      { path: 'user/profile/:id', component: UserProfile, props: true },
      { path: 'book/source/:id', component: BookSource, props: true },
      { path: 'book/all_source', component: BookAllSource },
      { path: 'book/manage', component: BookManage },
      { path: 'book/pages/:id/:book_id', component: BookSourcePages, props: true },
      { path: 'book/pages2/:id/:book_id', component: BookSourcePages2, props: true },
      { path: 'book/index', component: BookIndex },
      { path: 'shop/index', component: ShopIndex },
      { path: 'shop/goods/:id', component: ShopGoods, props: true },
      { path: 'freight/index', component: FreightIndex },
      { path: 'goods/index', component: GoodsIndex },
      { path: 'goods/create', component: GoodsCreate, props: false },
      { path: 'goods/edit/:id', component: GoodsEdit, props: true },
      { path: 'goods/sku/:id', component: GoodsSku, props: true },
      { path: 'goods/place/:id', component: GoodsPlace, props: true },
      { path: 'video/index', component: VideoIndex },
      { path: 'video/cate', component: VideoCate, props: false },
      { path: 'video/source/:id', component: VideoSource, props: true },
      { path: 'video/source/play/:vtype/:vuri', component: VideoPlay, props: true },
      { path: 'user/coupon/:id', component: UserCoupon, props: true },
      { path: 'dt_goods/index', component: DtGoodsIndex },
      { path: 'dt_goods/create', component: DtGoodsCreate },
      { path: 'dt_goods/edit/:id', component: DtGoodsEdit, props: true },
      { path: 'dt_goods/sku/:id', component: DtGoodsSku, props: true },
      { path: 'dt_coupon/index', component: DtCouponIndex },
      { path: 'dt_order/index', component: DtOrderIndex },
      { path: 'pickup_place/index', component: PickupPlaceIndex },
      { path: 'order_complaints/index', component: OrderComplaintsIndex },
      { path: 'pay_order/index', component: PayOrder },
      { path: 'sp_brand/index', component: SpBrand, props: true },
      { path: 'spcate/index/:id?', component: SpCate, props: true },
      { path: 'spcate/relate_prop/:id', component: SpPropRelate, props: true },
      { path: 'spcate/relate_brand/:id', component: SpBrandRelate, props: true },
      { path: 'sp_prop/index', component: SpProp },
      { path: 'sp_prop/value/:id', component: SpPropValue, props: true },
      { path: 'cms_article/index', component: CmsArticle },
      { path: 'banners/index', component: BannersIndex },
      { path: 'datatree/index', component: DatatreeIndex },
      { path: 'api/log', component: ApiRequestLog },
      { path: 'clients/index', component: ClientsIndex },
      { path: 'roles/index', component: RolesIndex },
      { path: 'roles/menu/:id', component: RolesMenu, props: true },
      { path: 'roles/policy/:id', component: RolesPolicy, props: true },
      { path: 'roles/user/:id', component: RolesUser, props: true },
      { path: 'policy/index', component: PolicyIndex },
      { path: 'message/index', component: MessageIndex },
      { path: 'album/index', component: AlbumIndex },
      { path: 'album/category', component: AlbumCategory },
      { path: 'album/photo/:id', component: AlbumPhoto, props: true },
      { path: 'config/index', component: ConfigIndex },
      { path: 'account/password', component: Password },
      { path: 'menu/index', component: MenuIndex },
      { path: 'account/avatar', component: Avatar },
      { path: 'index', component: AdminIndex },
      { path: ':pathMatch(.*)*', component: NotFound }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

export default routes
