<template>
  <Video></Video>
<!--  <MainHome>-->
<!--    <router-view />-->
<!--  </MainHome>-->
</template>

<script>
import '../assets/css/animate.css'
import MainHome from './common/MainHome.vue'
import Video from './video/index.vue'

export default {
  components: { MainHome, Video },
  data () {
    return {}
  },
  computed: {
  },
  methods: {
  }
}
</script>
