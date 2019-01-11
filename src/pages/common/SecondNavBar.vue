<template>
    <!--二级导航-->
    <div>
        <div class="main-product-navbar">
            <div class="product-nav-stage product-nav-stage-main">
                <div class="product-nav-scene product-nav-main-scene">
                    <div class="product-nav-title">
                        {{ menu.title }}
                    </div>
                    <div class="product-nav-list">
                        <ul>
                            <li
                                    v-for="(subMenu, index) in menu.children"
                                    :key="index"
                                    :class="{ active: !subMenu.children && index === activeNavIndex }"
                            >
                                <div>
                                    <a
                                            v-if="!subMenu.children"
                                            href="javascript:void(0)"
                                            @click.prevent="routerJump(subMenu.url, index)"
                                    >
                                        <div class="nav-icon"/>
                                        <div class="nav-title">
                                            {{ subMenu.title }}
                                        </div>
                                    </a>
                                    <a
                                            v-else
                                            href="javascript:void(0);"
                                    >
                                        <div class="nav-icon">
                                            <span class="icon-arrow-down"/>
                                        </div>
                                        <div class="nav-title">
                                            {{ subMenu.title }}
                                        </div>
                                    </a>
                                </div>
                                <ul v-if="!!subMenu.children">
                                    <li
                                            v-for="(item, v) in subMenu.children"
                                            :key="`${index}-${v}`"
                                    >
                                        <div>
                                            <a :href="!item.IsFront ? menuUrl(item.url) : routerUrl(item.url)">
                                                <div class="nav-icon"/>
                                                <div class="nav-title">
                                                    {item.Name}
                                                </div>
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="main-product-navbar-collapse">
            <div
                    class="product-navbar-collapse-inner"
                    @click="toggleSecondMenu"
            >
                <div class="product-navbar-collapse-bg"/>
                <div class="product-navbar-collapse">
          <span
                  v-if="isShowSecondMenu"
                  class="by-icon by-icon-copy1"
          />
                    <span
                            v-else
                            class="by-icon by-icon-copy-copy"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		name: 'SecondNavBar',
		componentName: 'SecondNavBar',
		props: {
			isShowSecondMenu: {
				type: Boolean,
				required: true
			},
			menu: {
				type: Object,
				required: true
			}
		},
		data() {
			return {
				activeNavIndex: false
			}
		},
		computed: {},
		watch: {
			routerReloadData: (newValue) => {
				console.log ('刷新', newValue)
			}
		},
		mounted() {
			window.bus.$on ('F5', (text) => {
				console.log ('F5', text)
			})
		},
		// todo 监听路由变化
		methods: {
			// 切换显示二级菜单
			toggleSecondMenu() {
				this.$emit ('isShowSecondMenu')
			},
			navOnClick(index) {
				this.activeNavIndex = index
			},
			mainFrameJump(UrlAddress, index) {
				this.navOnClick (index)
				//                if (this.$route.name !== 'Home/Index') this.$router.push({ name: 'Home/Index' });
				this.$store.dispatch ('mainFrameJump', '')
				window.tools.returnTop ()
				setTimeout (() => {
					this.$store.dispatch ('mainFrameJump', this.menuUrl (UrlAddress))
				}, 1)
			},
			routerJump(UrlAddress, index) {
				window.tools.returnTop ()
//      console.log(this.$router, this.$router.resolve(UrlAddress, this.$router.currentRoute, false), this.$router.resolve(UrlAddress, '#', false).href)
				window.location.href = this.$router.resolve (UrlAddress, '#', false).href
			},
			menuUrl(UrlAddress) {
				console.log ('menuUrl', UrlAddress)
				return UrlAddress
			},
			routerUrl(UrlAddress) {
				return UrlAddress
				// console.log('routerUrl', UrlAddress)
				// console.log('routerUrl', this.$router.resolve(`${UrlAddress}`, false, false).href)
				// return this.$router.resolve(`${UrlAddress}`).href + '?t=' + (new Date()).getTime()
			}
		}
	}
</script>
