<template>
  <main-home>
    <router-view slot="main-content" />
  </main-home>
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
