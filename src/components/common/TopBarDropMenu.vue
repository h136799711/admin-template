<template>
  <div class="dropdown topbar-left topbar-info-item topbar-info-dropdown">
    <a
      href="javascript:void(0);"
      class="topbar-btn topbar-info-dropdown-toggle"
      @click.stop="dropMenu()"
    >
      <span>{{ name }}</span>
    </a>
    <ul
      v-if="links.length > 0"
      ref="dropMenu"
      class="topbar-info-dropdown-memu topbar-info-dropdown-memu-list"
      :class="{show: isDropMenu}"
    >
      <li
        v-for="(link, index) in links"
        :key="index"
        class="topbar-info-btn"
      >
        <a
          :href="link.url ? link.url : 'javascript:void(0);'"
          @click.prevent="userMenuClick(link)"
        >
          <span>{{ link.name }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TopBarDropMenu',

  componentName: 'TopBarDropMenu',

  props: {
    name: {
      type: String,
      required: true
    },
    links: {
      type: Array,
      default: function () {
        return []
      }
    }
  },

  data () {
    return {
      isDropMenu: false
    }
  },

  mounted () {
    document.addEventListener('click', (e) => {
      if (!this.$refs.dropMenu) return
      if (!this.$refs.dropMenu.contains(e.target)) {
        this.dropMenu(false)
      }
    })
  },

  methods: {
    // 下拉菜单
    dropMenu (is) {
      this.isDropMenu = is === void 0 ? !this.isDropMenu : is
    },
    userMenuClick (link) {
      this.dropMenu(false)
      if (link.url) {
        if (this.$route.name !== 'admin/index') this.$router.push({ name: 'admin/index' })
        this.$store.dispatch('mainFrameJump', '')
        window.tools.returnTop()
        setTimeout(() => { this.$store.dispatch('mainFrameJump', window.tools.getApiUrl(link.url)) }, 1)
      }
      if (link.method) {
        this.$emit(link.method)
      }
    }
  }
}
</script>
