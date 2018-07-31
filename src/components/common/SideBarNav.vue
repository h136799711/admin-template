<template>
    <div class="sidebar-nav" :class="{ 'sidebar-nav-active': isNavActive }">
        <div class="sidebar-title sidebar-trans">
            <div v-if="navMenu.AllowExpand" class="sidebar-title-inner" @click="toggleNav"
                 @mouseenter="navOnMouseHover(navMenu.Name, $event)">
                <span class="sidebar-title-icon by-triangle_right by-icon"></span>
                <span class="sidebar-title-text">
                    {{ navMenu.Name }}
                </span>
            </div>
            <div class="sidebar-title-inner" v-else>
                <span class="sidebar-title-text">
                    {{ navMenu.Name }}
                </span>
            </div>
        </div>
        <ul v-if="navMenu.AllowExpand" class="sidebar-trans" :style="{ 'max-height': !isNavActive ? 0 : navMaxHeight + 'px' }">
            <li class="nav-item" :class="{ active: activeIndex == `${index}-${i}` }" @click="navClick(i)" v-for="(menu, i) in navMenu.children" :key="menu.Id"
                @mouseenter="navOnMouseHover(menu.Name, $event)">
                <template v-if="menu.AllowExpand">
                    <a href="javascript:void(0);" class="sidebar-trans">
                        <div class="nav-icon sidebar-trans">
                            <span class="boyefont" :class="menu.Icon!='' ? menu.Icon : 'by-menu'"></span>
                        </div>
                        <span class="nav-title">{{ menu.Name }}&nbsp;</span>
                    </a>
                </template>
                <template v-else>
                    <a :href="!menu.IsFront ? menuUrl(menu.UrlAddress) : routerUrl(menu.UrlAddress)"
                       class="sidebar-trans"
                       @click.prevent="!menu.IsFront ? mainFrameJump(menu.UrlAddress) : routerJump(menu.UrlAddress)"
                       @mouseenter="navOnMouseHover(menu.Name, $event)">
                        <div class="nav-icon sidebar-trans">
                            <span class="boyefont" :class="menu.Icon!='' ? menu.Icon : 'by-menu'"></span>
                        </div>
                        <span class="nav-title">{{ menu.Name }}&nbsp;</span>
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
    return { };
  },
  methods: {
    // 切换显示子菜单
    toggleNav () {
      this.$emit('NavOnActive', this.isNavActive ? false : this.index);
    },
    navClick (index) {
      this.$emit('NavOnClick', `${this.index}-${index}`, this.navMenu.children[index].children.length > 0 ? this.navMenu.children[index] : false);
    },
    mainFrameJump (UrlAddress) {
      if (this.$route.name !== 'Home/Index') this.$router.push({ name: 'Home/Index' });
      this.$store.dispatch('mainFrameJump', '');
      window.tools.returnTop();
      setTimeout(() => { this.$store.dispatch('mainFrameJump', this.menuUrl(UrlAddress)); }, 1);
    },
    routerJump (UrlAddress) {
      this.$store.dispatch('routerReloadData');
      window.tools.returnTop();
      this.$router.push(`${UrlAddress}`);
    },
    menuUrl (UrlAddress) {
      //                return this.$router.resolve(`${UrlAddress}`).href;
      return window.tools.getApiUrl(UrlAddress);
    },
    routerUrl (UrlAddress) {
      return this.$router.resolve(`${UrlAddress}`).href;
    },
    navOnMouseHover (text, $event) {
      // mimi状态才显示tooltip
      if (document.getElementsByClassName('main-body')[0].className.indexOf('main-sidebar-mini') === -1) return;
      let $ele = $event.target;
      let top = $ele.offsetTop;
      let current = $ele.offsetParent;
      while (current !== null) {
        top += current.offsetTop;
        current = current.offsetParent;
      }
      let tooltip = document.createElement('div');
      let arrow = document.createElement('div');
      let inner = document.createElement('div');

      tooltip.className = 'main-sidebar-tooltip right fade';
      tooltip.style.top = top - 50 + 'px';
      arrow.className = 'tooltip-arrow';
      inner.className = 'tooltip-inner';
      inner.innerHTML = text;

      tooltip.appendChild(arrow);
      tooltip.appendChild(inner);

      document.getElementsByClassName('main-product')[0].appendChild(tooltip);
      setTimeout(() => {
        tooltip.className = 'main-sidebar-tooltip right fade in';
      }, 100);

      const listener = e => {
        setTimeout(() => {
          tooltip.className = 'main-sidebar-tooltip right fade';
          document.getElementsByClassName('main-product')[0].removeChild(tooltip);
        }, 150);
        $ele.removeEventListener('mouseleave', listener);
      };

      $ele.addEventListener('mouseleave', listener);
    }
  }
};

</script>