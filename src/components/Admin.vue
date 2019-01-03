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
    mainFrameSrc () {
      return this.$store.state.mainFrameSrc
    },
    mainFrameLoading () {
      return this.$store.state.mainFrameLoading
    }
  },
  methods: {
    mainFrameLoad () {
      if (!this.mainFrameSrc === '') {
        this.$store.dispatch('mainFrameJumpEnd')
      }
    }
  }
}
</script>
