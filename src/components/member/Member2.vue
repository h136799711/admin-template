<template>
    <div class="main-content" v-loading.body="pageLoading">我是Member22哦</div>
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
      this.pageLoading = true;
      console.log(`${this.$route.path}:loadData`);
      setTimeout(() => {
        this.pageLoading = false;
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