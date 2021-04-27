<template>
  <MainHome>
    <router-view />
  </MainHome>
</template>

<script>
import '../assets/css/animate.css'
import MainHome from './common/MainHome.vue'

export default {
  components: { MainHome },
  data () {
    return {}
  },
  computed: {
  },
  methods: {
  }
}
</script>
