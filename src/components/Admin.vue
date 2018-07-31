<template>
    <main-home>
        <router-view slot="main-content"></router-view>
    </main-home>
</template>

<script>
import '../assets/css/animate.css';
import MainHome from './common/MainHome.vue';

export default {
  components: { MainHome },
  data () {
    return {};
  },
  methods: {
    mainFrameLoad () {
      if (!this.mainFrameSrc === '') {
        this.$store.dispatch('mainFrameJumpEnd');
      }
    }
  },
  computed: {
    mainFrameSrc () {
      return this.$store.state.mainFrameSrc;
    },
    mainFrameLoading () {
      return this.$store.state.mainFrameLoading;
    }
  }
};
</script>
