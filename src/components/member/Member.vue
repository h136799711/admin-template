<template>
    <div class="main-content" v-loading.body="pageLoading"><div style="height: 2000px">我是Member11哦</div></div>
</template>

<script>
import http from '../../assets/js/http';
import routeLoad from '../../assets/js/routeLoad';

export default {
  data () {
    return {
      pageLoading: false
    };
  },
  methods: {
    // 获取数据 必须要要有个loadData方法以供刷新使用
    loadData () {
      if (this.pageLoading) return;
      let msg = bus.$message({
        showClose: true,
        message: '加载中...',
        type: 'warning',
        duration: 0
      });
      this.pageLoading = true;
      console.log(`${this.$route.path}:loadData`);
      setTimeout(() => {
        this.pageLoading = false;
        msg.close();
      }, 1000);
    }
  },
  computed: {

  },
  created () {
    // 这里获取数据
    this.loadData();
  },
  mixins: [http, routeLoad]
};
</script>