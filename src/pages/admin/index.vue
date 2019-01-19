<template>
  <div
    v-loading.body="pageLoading"
    class="main-content"
  >
    <el-alert
      title="欢迎您使用本系统"
      type="success"
      description=""
    />
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
      // if (this.pageLoading) return;
      //                tools.alertWarn('加载中...');
      //                this.pageLoading = true;
      //                console.debug(`${this.$route.path}:loadData`);
      //                this.pageLoading = false;
    }
  }
}
</script>
