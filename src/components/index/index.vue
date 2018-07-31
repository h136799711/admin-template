<template>
    <div class="main-content iframe" v-loading.body="mainFrameLoading">
        <iframe name="mainframe" @load="mainFrameLoad" class="LRADMS_iframe" width="100%" height="100%" frameborder="0" :src="defaultSrc"></iframe>

    </div>
</template>

<script>
import tools from '../../assets/plugins/tools';

export default {
  data () {
    return {};
  },
  methods: {
    mainFrameLoad () {
      this.$store.dispatch('mainFrameJumpEnd');
    }
  },
  watch: {
    mainFrameSrc (val) {
      document.mainframe.location.href = val;
    }
  },
  computed: {
    mainFrameSrc () {
      return this.$store.state.mainFrameSrc;
    },
    mainFrameLoading () {
      return this.$store.state.mainFrameLoading;
    },
    defaultSrc () {
      return '#/welcome/hello';
    }
  }
};
</script>