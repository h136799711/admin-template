<style>

</style>

<template>
    <div class="main-login" >
        <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="12" >
                <div class="grid-content bg-purple text-center">正在退出中...</div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import * as types from '../../store/mutation-types';

export default {
  computed: {
    loginStatus () {
      return this.$store.getters.loginStatus;
    },
    loginUser () {
      return this.$store.getters.loginUser;
    }
  },
  watch: {
    loginStatus: function (newVal) {
      if (newVal === types.ByUserLogoutDone) {
        this.$router.push('login');
      }
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout', this.loginUser);
    }
  },
  created () {
    this.logout();
  }
};
</script>