<template>
  <div
    v-loading.body="pageLoading"
    class="main-content"
  >
    我是Member22哦
  </div>
</template>

<script>
	import http from '../../assets/js/http'
	import routeLoad from '../../assets/js/routeLoad'

	export default {
  mixins: [http, routeLoad],
  data () {
    return {
      pageLoading: false
    }
  },
  computed: {

  },
  created () {
    // 这里获取数据
    this.loadData()
  },
  methods: {
    // 获取数据 必须要要有个loadData方法以供刷新使用
    loadData () {
      if (this.pageLoading) return
      this.pageLoading = true
      console.log(`${this.$route.path}:loadData`)
      setTimeout(() => {
        this.pageLoading = false
      }, 1000)
    }
  }
}
</script>
