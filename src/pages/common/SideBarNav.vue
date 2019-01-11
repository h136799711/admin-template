<template>
  <div
    class="sidebar-nav"
    :class="{ 'sidebar-nav-active': isNavActive }"
  >
    <div class="sidebar-title sidebar-trans">
      <div
        v-if="navMenu.AllowExpand"
        class="sidebar-title-inner"
        @click="toggleNav"
        @mouseenter="navOnMouseHover(navMenu.title, $event)"
      >
        <span class="sidebar-title-icon by-triangle_right by-icon" />
        <span class="sidebar-title-text">
          {{ $t(navMenu.title) }}
        </span>
      </div>
      <div
        v-else
        class="sidebar-title-inner"
      >
        <span class="sidebar-title-text">
          {{ $t(navMenu.title) }}
        </span>
      </div>
    </div>
    <ul
      v-if="navMenu.AllowExpand"
      class="sidebar-trans"
      :style="{ 'max-height': !isNavActive ? 0 : navMaxHeight + 'px' }"
    >
      <li
        v-for="(menu, i) in navMenu.children"
        :key="menu.Id"
        class="nav-item"
        :class="{ active: activeIndex == `${index}-${i}` }"
        @click="navClick(i)"
        @mouseenter="navOnMouseHover(menu.title, $event)"
      >
        <template v-if="menu.AllowExpand">
          <a
            href="javascript:void(0);"
            class="sidebar-trans"
          >
            <div class="nav-icon sidebar-trans">
              <span
                class="boyefont"
                :class="menu.icon!='' ? menu.icon : 'by-menu'"
              />
            </div>
            <span class="nav-title">
              {{ $t(menu.title) }}
            </span>
          </a>
        </template>
        <template v-else>
            <a href="#"
               @click="routerJump(menu.url)"
            >
            <div class="nav-icon sidebar-trans">
              <span
                class="boyefont"
                :class="menu.icon!='' ? menu.icon : 'by-menu'"
              />
            </div>
            <span class="nav-title">{{ $t(menu.title) }}
            </span>
            </a>
        </template>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'SideBarNav',
  componentName: 'SideBarNav',
  props: {
    navMaxHeight: {
      type: Number,
      required: true
    },
    activeIndex: {
      default: false
    },
    index: {
      required: true
    },
    navMenu: {
      type: Object,
      required: true
    },
    isNavActive: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return { }
  },
  methods: {
    // 切换显示子菜单
    toggleNav () {
      this.$emit('NavOnActive', this.isNavActive ? false : this.index)
    },
    navClick (index) {
      this.$emit('NavOnClick', `${this.index}-${index}`, this.navMenu.children[index].children.length > 0 ? this.navMenu.children[index] : false)
    },
    routerJump (UrlAddress) {
      window.tools.returnTop()
//      console.log(this.$router, this.$router.resolve(UrlAddress, this.$router.currentRoute, false), this.$router.resolve(UrlAddress, '#', false).href)
      window.location.href = this.$router.resolve(UrlAddress, '#', false).href
    },
    routerUrl (UrlAddress) {
      return this.$router.resolve(`${UrlAddress}`).href
    },
    navOnMouseHover (text, $event) {
      // mimi状态才显示tooltip
      if (document.getElementsByClassName('main-body')[0].className.indexOf('main-sidebar-mini') === -1) return
      let $ele = $event.target
      let top = $ele.offsetTop
      let current = $ele.offsetParent
      while (current !== null) {
        top += current.offsetTop
        current = current.offsetParent
      }
      let tooltip = document.createElement('div')
      let arrow = document.createElement('div')
      let inner = document.createElement('div')

      tooltip.className = 'main-sidebar-tooltip right fade'
      tooltip.style.top = top - 50 + 'px'
      arrow.className = 'tooltip-arrow'
      inner.className = 'tooltip-inner'
      inner.innerHTML = text

      tooltip.appendChild(arrow)
      tooltip.appendChild(inner)

      document.getElementsByClassName('main-product')[0].appendChild(tooltip)
      setTimeout(() => {
        tooltip.className = 'main-sidebar-tooltip right fade in'
      }, 100)

      const listener = e => {
        setTimeout(() => {
          tooltip.className = 'main-sidebar-tooltip right fade'
          document.getElementsByClassName('main-product')[0].removeChild(tooltip)
        }, 150)
        $ele.removeEventListener('mouseleave', listener)
      }

      $ele.addEventListener('mouseleave', listener)
    }
  }
}

</script>
