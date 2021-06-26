<style>
    .main-login{
        width: 100%;
        height: 100vh;
        background: #ebebeb;
        font-family: "Helvetica Neue","Hiragino Sans GB","Microsoft YaHei","\9ED1\4F53",Arial,sans-serif;
        color: #222;
        font-size: 12px;
    }
    .top_div{
        background: #008ead;
        width: 100%;
        height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .top_div h1{
        color: #FFF;
        font-size: 30px;
        margin-top: -50px;
        text-shadow: black 0 1px 2px;
    }
    .ipt{
        border: 1px solid #d3d3d3;
        padding: 10px 10px;
        width: 340px;
        border-radius: 4px;
        padding-left: 35px;
        -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
        box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
        -webkit-transition: border-color ease-in-out .3s,-webkit-box-shadow ease-in-out .3s;
        -o-transition: border-color ease-in-out .3s,box-shadow ease-in-out .3s;
        transition: border-color ease-in-out .3s,box-shadow ease-in-out .3s
    }
    .ipt:focus{
        border-color: #66afe9;
        outline: 0;
        -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);
        box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)
    }
    .c_icon{
      padding: 1px 12px;
      position: absolute;
      top: 0px;
      left: 25px;
      font-size: 20px;
      color: #a6a9ac;
    }
    .c_icon_token{
      padding: 9px 12px;
      position: absolute;
      top: 0px;
      left: 25px;
      font-size: 16px;
      color: #a6a9ac;
    }
    .u_logo{
        padding: 10px 10px;
        position: absolute;
        top: 20px;
        left: 25px;
        font-size: 20px;
        color: #a6a9ac;
    }
    .p_logo{
        padding: 3px 10px;
        position: absolute;
        top: 0px;
        left: 28px;
        font-size: 16px;
        color: #a6a9ac;
    }
    a{
        text-decoration: none;
    }
    .tou{
        background: url("../../assets/images/login/tou.png") no-repeat;
        width: 97px;
        height: 92px;
        position: absolute;
        top: -87px;
        left: 140px;
    }
    .left_hand{
        background: url("../../assets/images/login/left_hand.png") no-repeat;
        width: 32px;
        height: 37px;
        position: absolute;
        top: -38px;
        left: 150px;
        transition: top linear .3s, left linear .3s;
    }
    .right_hand{
        background: url("../../assets/images/login/right_hand.png") no-repeat;
        width: 32px;
        height: 37px;
        position: absolute;
        top: -38px;
        right: -64px;
        transition: top linear .3s, right linear .3s;
    }
    .initial_left_hand{
        background: url("../../assets/images/login/hand.png") no-repeat;
        width: 30px;
        height: 20px;
        position: absolute;
        top: -12px;
        left: 100px;
        transition: top linear .3s, left linear .3s;
    }
    .initial_right_hand{
        background: url("../../assets/images/login/hand.png") no-repeat;
        width: 30px;
        height: 20px;
        position: absolute;
        top: -12px;
        right: -112px;
        transition: top linear .3s, right linear .3s;
    }
    .left_handing{
        background: url("../../assets/images/login/left-handing.png") no-repeat;
        width: 30px;
        height: 20px;
        position: absolute;
        top: -24px;
        left: 139px;
    }
    .right_handinging{
        background: url("../../assets/images/login/right_handing.png") no-repeat;
        width: 30px;
        height: 20px;
        position: absolute;
        top: -21px;
        left: 210px;

    }
    .codeImg{
        width: 120px;
        height: 33px;
        position: absolute;
        right: 30px;
        top: 1px;
    }
    .codeImg img{
        width: 100%;
        height: 100%;
        border-radius: 4px;
    }
    .codeImg span.by-icon{
        font-size: 18px;
        position: absolute;
        right: 50px;
        top: 8px;
        width: 25px;
        height: 25px;
        line-height: 25px;
    }
    .code_retry{
        font-size: 12px;
        text-decoration: underline;
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
    }
    .verifyImg {
        cursor: pointer;
    }
    .inf-rotate{ animation:rotate 2s linear infinite;}

    @keyframes rotate
    {
        from {transform: rotate(0deg);}
        to {transform: rotate(360deg);}
    }
</style>

<template>
  <div class="main-login">
    <div class="top_div">
      <h1>Log In</h1>
    </div>
    <form
      action=""
      class="loginForm form clearfix validate-form"
      method="post"
    >
      <div style="background: rgb(255, 255, 255); margin: -100px auto auto; border: 1px solid rgb(231, 231, 231); border-image: none; width: 400px; height: 290px; text-align: center;">
        <div style="width: 165px; height: 96px; position: absolute;">
          <div class="tou" />
          <div :class="[isPswFocus ? 'left_hand': 'initial_left_hand']" />
          <div :class="[isPswFocus ? 'right_hand': 'initial_right_hand']" />
        </div>
        <p style="padding: 30px 0 10px; position: relative;">
          <span class="by-icon by-yonghuming u_logo" /> <input
            ref="username_input"
            v-model.trim="user.mobile"
            autocomplete="username"
            class="ipt"
            type="text"
            name="username"
            placeholder="mobile(only can log in by mobile)"
            tabindex="1"
            @keydown.enter="login"
          >
        </p>
        <p style="position: relative;">
          <span class="by-icon by-iconfontlock p_logo" />
          <input
            id="password"
            ref="password_input"
            v-model="user.password"
            autocomplete="current-password"
            class="ipt"
            type="password"
            name="password"
            placeholder="password"
            tabindex="2"
            @focus="pswFocus(true)"
            @keydown.enter="login"
            @blur="pswFocus(false)"
          >
        </p>
        <p style="position: relative; margin: 10px 0">
          <span style="width: 347px; overflow: hidden; display: inline-block">
            <span class="by-verify by-icon c_icon" />
            <input
              id="code"
              v-model.trim="user.verifyCode"
              class="ipt sm"
              tabindex="3"
              name="verify"
              maxlength="6"
              type="text"
              placeholder="verify code"
              @keydown.enter="login"
            >
            <span class="codeImg">
              <template v-if="verifyImg == 'error'">
                <span
                  class="code_retry"
                  @click="refresh_verify"
                >
                  Refresh Code
                </span>
              </template>
              <template v-else>
                <span
                  v-if="verifyImg == ''"
                  class="inf-rotate by-icon by-iconloading-copy"
                />
                <img
                        v-else
                  :src="verifyImg"
                  class="verifyImg"
                  @click="refresh_verify"
                >
              </template>
            </span>
          </span>
        </p>

        <div style="position: relative;">
          <span class="by-iconfontlock by-icon c_icon_token" />
          <input
            id="google"
            v-model="user.token"
            style="font-size: 12px;"
            class="ipt"
            type="text"
            name="token"
            placeholder="开启2步验证后需要填写"
            tabindex="4"
            @focus="pswFocus(true)"
            @keydown.enter="login"
            @blur="pswFocus(false)"
          >
        </div>
        <div
          class="clearfix"
          style="height: 50px; line-height: 50px; margin-top: 20px; border-top-color: rgb(231, 231, 231); border-top-width: 1px; border-top-style: solid;"
        >
          <div style="float: right;margin: 0 35px 20px 45px;">
            <el-button
              type="primary"
              @click="login"
              @keyup.enter="login"
            >
              {{ isLogging ? 'Log in...' : 'Log In' }}
            </el-button>
            <!--              <a-->
            <!--                style="display:block;background: rgb(0, 142, 173);margin-top:7px; padding: 7px 10px; border-radius: 4px; border: 1px solid rgb(26, 117, 152); border-image: none; color: rgb(255, 255, 255); font-weight: bold;"-->
            <!--                href="javascript:void(0);"-->
            <!--                class="ajax-post"-->
            <!--                @click="login"-->
            <!--                @keyup.enter="login"-->
            <!--              >-->
            <!--              </a>-->
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import * as types from '../../store/mutation-types'
import securityCodeApi from '../../api/securityCodeApi.js'
import {dbhTool,dbhCache} from '@peter_xiter/dbh-js-tools';

export default {
  data () {
    return {
      isLogging: false,
      isPswFocus: false,
      verifyImg: '',
      user: {
        mobile: '',
        loginInfo: '',
        token: '',
        password: '',
        verifyCode: '',
        verifyId: 0
      }
    }
  },
  computed: {
    loginError () {
      return this.$store.getters.loginError
    },
    loginUser () {
      return this.$store.getters.loginUser
    },
    loginStatus () {
      return this.$store.getters.loginStatus
    }
  },
  watch: {
    loginStatus: function (oldVal, newVal) {
      console.debug('loginStatus', oldVal, this.loginError)
      if (oldVal === types.ByUserLoginFail) {
        this.isLogging = false
        this.refresh_verify()
        window.dbh.alertError(this.loginError.msg)
      }
      if (oldVal === types.ByUserLoginReq) {
        window.dbh.alertInfo('process...')
      }
      if (oldVal === types.ByUserLoginSuc && this.loginUser) {
        this.isLogging = false
        let msg = this.loginUser.nickname + ', Login Success'
        // 登录用户的clientId
//        console.debug('用户信息', this.loginUser)
        dbhTool.setJwt(this.loginUser.jwt, this.loginUser.jwt_expire);
        dbhTool.setUID(this.loginUser.id, this.loginUser.jwt_expire);
        dbhTool.setNick(this.loginUser.nickname, this.loginUser.jwt_expire);
        dbhTool.setClientId(this.loginUser.client_id, this.loginUser.jwt_expire);
        dbhTool.setAvatar(this.loginUser.avatar, this.loginUser.jwt_expire);
        this.jump2Admin()
      }
    }
  },
  created () {
  },
  mounted () {
    dbhCache.clearAll();
    this.refresh_verify();
  },
  methods: {
    pswFocus (is) {
      this.isPswFocus = is
    },
    checkLogin () {
      if (this.user.mobile === '') {
        window.dbh.alertError('mobile required')
        this.$refs.username_input.focus()
        return false
      }
      if (this.user.password === '') {
        window.dbh.alertError('password required')
        this.$refs.password_input.focus()
        return false
      }
      return true
    },
    login () {
      if (!this.checkLogin()) return
      this.isLogging = true

      this.$store.dispatch('login', this.user)
    },
    refresh_verify () {
      this.verifyImg = ''
      let that = this;
      securityCodeApi.image_create([], function (resData) {
        that.user.verifyId = resData.id
        that.verifyImg = resData.code
      }, function (failMsg) {

        that.verifyImg = 'error'
      })
    },
    jump2Admin () {
      this.$router.push({ path: '/admin' })
    }
  }
}
</script>
