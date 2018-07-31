<template>
    <div class="main-content" v-loading.body="pageLoading">
        <el-alert
                title="欢迎您使用本系统"
                type="success"
                description="">
        </el-alert>
    </div>
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
      // if (this.pageLoading) return;
      //                tools.alertWarn('加载中...');
      //                this.pageLoading = true;
      //                console.log(`${this.$route.path}:loadData`);
      //                this.pageLoading = false;
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