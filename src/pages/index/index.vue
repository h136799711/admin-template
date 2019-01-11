<template>
  <div
    v-loading.body="mainFrameLoading"
    class="main-content iframe"
  >
    <iframe
      name="mainframe"
      class="LRADMS_iframe"
      width="100%"
      height="100%"
      frameborder="0"
      :src="defaultSrc"
      @load="mainFrameLoad"
    />
  </div>
</template>

<script>

	export default {
  data () {
    return {}
  },
  computed: {
    mainFrameSrc () {
      return this.$store.state.mainFrameSrc
    },
    mainFrameLoading () {
      return this.$store.state.mainFrameLoading
    },
    defaultSrc () {
      return '#/welcome/hello'
    }
  },
  watch: {
    mainFrameSrc (val) {
      document.mainframe.location.href = val
    }
  },
  methods: {
    mainFrameLoad () {
      this.$store.dispatch('mainFrameJumpEnd')
    }
  }
}
</script>
