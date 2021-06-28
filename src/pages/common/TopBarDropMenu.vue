<style>
  .avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      margin-right: 8px;
  }
  a.topbar-btn.topbar-info-dropdown-toggle {
    flex: 1;
    justify-content: space-between;
    align-items: center;
  }
</style>
<template>
  <div class="dropdown topbar-left topbar-info-item topbar-info-dropdown">
    <a
      href="javascript:void(0);"
      class="topbar-btn topbar-info-dropdown-toggle"
      @click.stop="dropMenu()"
    >
      <el-image
              v-if="head"
              class="avatar"
              lazy
              :src="head.removeSchema()">
      </el-image>
      <i :class="iconClass"></i>
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
          <span>{{ $t(link.name) }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TopBarDropMenu',
  componentName: 'TopBarDropMenu',
  emits: ["menuClick"],
  props: {
    name: {
      type: String,
      required: true
    },
    head: {
      required: false,
      type: String,
      default: function () {
        return '';
      }
    },
    iconClass: {
      type: String,
      required: false
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
  computed: {
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
      this.$emit('menuClick', link)
    }
  }
}
</script>
