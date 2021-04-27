<template>
  <CmsArticle></CmsArticle>
<!--  <MainHome>-->
<!--    <router-view />-->
<!--  </MainHome>-->
</template>

<script>
import '../assets/css/animate.css'
import MainHome from './common/MainHome.vue'
import CmsArticle from './cms_article/index.vue'

export default {
  components: { MainHome, CmsArticle },
  data () {
    return {}
  },
  computed: {
  },
  methods: {
  }
}
</script>
