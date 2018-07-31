<style>
    .not-found0-404{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-size: 30px;
    }
    .content-wrapper .not-found0-404{
        height: calc(100vh - 101px);
    }
</style>

<template>
    <div class="not-found0-404">404 NotFound</div>
</template>

<script>
import http from '../../assets/js/http';

export default {
  data () {
    return {
      pageLoading: true
    };
  },
  methods: {
    //
  },
  computed: {

  },
  created () {
    // 这里获取数据
  },
  mixins: [http]
};
</script>