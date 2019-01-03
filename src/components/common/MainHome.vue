<style>

    * {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    *:before, *:after {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    html{
        height: 100%;
    }
    body{
        height: 100%;
        font-size: 12px;
    }
    #app{
        height: 100%;
    }
    .wrapper{
        position: relative;
        height: auto;
        min-height: 100%;
    }
    .content-wrapper {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: auto;
        background-color: #FFF;
        z-index: 2;
        overflow: hidden;
        overflow-y: auto;
        -o-transition: all 0.2s ease;
        -ms-transition: all 0.2s ease;
        -moz-transition: all 0.2s ease;
        -webkit-transition: all 0.2s ease;
    }
    .el-loading-mask{
        z-index: 999!important;
    }
    .sidebar-collapse .content-wrapper{
        margin-left: 50px !important;
        z-index: 840;
    }
    .content-wrapper .main-content{
        margin: 10px 10px 0;
        padding: 0;
        min-height: calc(100vh - 101px);
        padding-bottom: 50px;
    }
    .content-wrapper .main-content.iframe{
        height: calc(100vh - 101px);
    }

    [class^="icon-"], [class*=" icon-"]{
        font-family: FontAwesome;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    .main-topbar .topbar-clearfix:before, .main-topbar .topbar-clearfix:after {
        display: table;
        content: " ";
    }
    .main-topbar{
        position: fixed;
        width: 100%;
        height: 50px;
        background: #373d41;
        z-index: 101;
    }
    .main-topbar .topbar-wrap{
        height: 100%;
    }
    .main-topbar .topbar-head{
        background: #2a2f32;
        height: 50px;
        position: relative;
        z-index: 3;
    }
    .main-topbar .topbar-btn {
        color: #fff;
        font-size: 14px;
        line-height: 50px;
    }
    .main-topbar .topbar-logo span {
        line-height: 50px;
    }
    .main-topbar .topbar-left {
        float: left;
    }
    .icon-logo {
        font-size: 24px;
        line-height: 50px;
        display: block;
    }
    .main-topbar .topbar-logo {
        background: #373d41;
    }
    .main-topbar .topbar-logo{
        display: block;
        width: 50px;
        color: #FFF;
        text-align: center;
        line-height: 50px;
        margin-right: 1px;
    }
    .main-topbar .topbar-btn:hover, .main-topbar .topbar-btn.topbar-btn-dark {
        background: #2a2f32;
    }
    .main-topbar .topbar-info .topbar-btn:hover, .main-topbar .topbar-info .topbar-btn.topbar-btn-dark {
        background: #2a2f32;
    }
    .main-topbar .topbar-home-link {
        margin-right: 1px;
        background: #373d41;
        width: 129px;
        text-align: center;
    }
    .main-topbar .topbar-product {
        position: relative;
        z-index: 2;
        background: #373d41;
    }
    .main-topbar .topbar-product-btn {
        padding: 0 20px;
        display: inline-block;
        height: 50px;
        cursor: pointer;
    }
    .main-topbar span, .main-topbar a, .main-topbar p, .main-topbar li {
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        letter-spacing: 0.02em;
    }
    .main-topbar .icon-arrow-down {
        display: inline-block;
        width: 18px;
        text-align: center;
        vertical-align: middle;
        transition: transform 0.2s, vertical-align 0.2s;
        -o-transition: transform 0.2s, vertical-align 0.2s;
        -ms-transition: transform 0.2s, vertical-align 0.2s;
        -moz-transition: transform 0.2s, vertical-align 0.2s;
        -webkit-transition: transform 0.2s, vertical-align 0.2s;
    }
    .icon-arrow-down:before {
        content: "\f0d7";
    }
    .main-topbar .topbar-info {
        background: #2a2f32;
        position: absolute;
        z-index: 3;
        top: 0;
        right: 0;
    }
    .main-topbar .topbar-wrap, .main-topbar .topbar-logo, .main-topbar .topbar-home, .main-topbar .topbar-home-link, .main-topbar .topbar-product, .main-topbar .topbar-info {
        height: 100%;
    }
    .main-topbar .topbar-notice {
        position: relative;
        font-size: 12px;
    }
    .main-topbar .topbar-info-item {
        display: inline-block;
    }
    .main-topbar .topbar-notice .topbar-btn {
        padding: 0 16px;
    }
    .main-topbar .topbar-info .topbar-btn {
        padding: 0 18px;
        height: 50px;
        display: block;
        z-index: 2;
        background: #373d41;
        border-right: 1px solid #2a2f32;
    }
    .main-topbar .topbar-info-dropdown .topbar-btn {
        position: relative;
    }
    .main-topbar .topbar-btn-notice .topbar-btn-notice-icon {
        line-height: 50px;
        vertical-align: text-bottom;
    }
    .icon-bell {
        font-size: 20px;
    }
    .main-topbar .topbar-btn-notice .topbar-btn-notice-num {
        font-size: 12px;
        color: #fff;
        background: #ff9900;
        border-radius: 5px;
        padding: 2px 5px;
        display: inline-block;
        margin-top: 15px;
        line-height: 16px;
        vertical-align: top;
        text-align: center;
    }
    .main-topbar .topbar-info-dropdown .topbar-info-dropdown-toggle {
        color: #fff;
    }
    .main-topbar span, .main-topbar a, .main-topbar p, .main-topbar li {
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        letter-spacing: 0.02em;
    }
    .main-topbar .topbar-info-dropdown-memu {
        padding: 0;
        position: absolute;
        top: 100%;
        right: 0;
        visibility: hidden;
        float: left;
        list-style: none;
        background-color: #ffffff;
        background-clip: padding-box;
        z-index: 1;
        font-size: 12px;
        min-width: 100%;
        margin: 0;
        border: none;
        -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        -moz-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        -webkit-transition: opacity 0.15s, visibility 0s 0.15s;
        transition: opacity 0.15s, visibility 0s 0.15s;
        opacity: 0;
    }
    .main-topbar .topbar-info-dropdown-memu.show{
        visibility: visible;
        opacity: 1;
    }
    .main-topbar .topbar-info-dropdown-memu li a {
        display: block;
        padding: 0 20px;
        clear: both;
        font-weight: normal;
        line-height: 1.428571429;
        color: #333333;
        white-space: nowrap;
        min-width: 140px;
        -webkit-transition: all 0.15s;
        transition: all 0.15s;
    }
    .main-topbar .topbar-info .topbar-info-btn a {
        height: 40px;
        line-height: 39px;
        padding: 0 18px;
    }
    .main-topbar .topbar-info-dropdown-memu li a:hover, .main-topbar .topbar-info-dropdown-memu li a:focus {
        background-color: #f5f5f5;
    }
    .main-topbar .topbar-info-dropdown-memu-list {
        padding: 10px 0;
        margin: -2px;
    }
    .main-body {
        position: absolute;
        width: 100%;
        top: 50px;
        bottom: 0px;
        background-color: #000;
        z-index: 100;
    }
    .main-sidebar span, .main-sidebar a, .main-sidebar p, .main-sidebar li {
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        letter-spacing: 0.02em;
    }
    .main-sidebar-full .main-sidebar, .main-sidebar.sidebar-full {
        width: 180px;
        display: block;
    }

    .main-sidebar.sidebar-content {
        width: 180px;
        height: 100%;
        overflow: auto;
        overflow-x: hidden;
        overflow-y: hidden;
    }
    .main-sidebar {
        width: 0;
        position: fixed;
        top: 50px;
        bottom: 0;
        background-color: #333744;
        z-index: 102;
    }
    .main-sidebar .sidebar-trans {
        -o-transition: all 0.12s ease, 0.12s ease;
        -ms-transition: all 0.12s ease, 0.12s ease;
        -moz-transition: all 0.12s ease, 0.12s ease;
        -webkit-transition: all 0.12s ease, 0.12s ease;
    }
    .main-sidebar .sidebar-inner {
        position: relative;
        height: 100%;
    }
    .main-sidebar .sidebar-fold {
        height: 30px;
        width: 100%;
        background: #4A5064;
        color: #aeb9c2;
        text-align: center;
        line-height: 30px !important;
        font-size: 12px;
        user-select: none;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
    }
    .sidebar-fold > span{
        display: inline-block;
    }
    .icon-unfold {
        display: block;
        text-align: center;
    }
    .sidebar-fold .icon-fold{
        transform: rotate(90deg);
    }
    .main-sidebar .sidebar-nav-wrap {
        width: 180px;
        height: calc(100% - 30px);
        overflow-x: hidden;
        overflow-y: auto;
    }
    .main-sidebar .sidebar-nav {
        width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .main-sidebar .sidebar-nav li a {
        display: block;
        width: 180px;
        height: 40px;
        line-height: 40px;
        overflow: hidden;
    }
    .main-sidebar .sidebar-nav li a:hover {
        background: #4A5064;
    }
    .main-sidebar .sidebar-nav .sidebar-title {
        height: 40px;
        background: #42485B;
        color: #fff;
        line-height: 40px;
        position: relative;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        overflow: hidden;
    }
    .main-sidebar .sidebar-nav .sidebar-title:hover {
        background: #00C1DE;
    }
    .main-sidebar .sidebar-nav-active .sidebar-title-icon {
        vertical-align: text-top;
        transform: rotate(90deg);
    }
    .main-sidebar .sidebar-nav .sidebar-title-icon {
        width: 45px;
        text-align: center;
        font-size: 16px;
        float: left;
        color: #aeb9c2;
        display: inline-block;
        vertical-align: middle;
        transition: transform 0.12s;
        -o-transition: -o-transform 0.12s;
        -ms-transition: -ms-transform 0.12s;
        -moz-transition: -moz-transform 0.12s;
        -webkit-transition: -webkit-transform 0.12s;
    }
    .icon-arrow-right:before {
        content: "\f0da";
    }
    .main-sidebar .sidebar-nav ul {
        width: 200px;
        margin: 0;
        padding: 0;
        list-style: none;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .main-sidebar .sidebar-nav .nav-item {
        position: relative;
    }
    .main-sidebar-full .main-sidebar .sidebar-nav .nav-icon, .main-sidebar.sidebar-full .sidebar-nav .nav-icon {
        width: 50px;
    }
    .main-sidebar .sidebar-nav .nav-icon {
        width: 50px;
        text-align: center;
        font-size: 16px;
        float: left;
        color: #aeb9c2;
    }
    .main-sidebar .sidebar-nav .nav-title {
        float: left;
        overflow: hidden;
        color: #fff;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
        width: 130px;
    }
    .main-sidebar-mini .main-sidebar, .main-sidebar.sidebar-mini {
        width: 50px;
        display: block;
    }
    .sidebar-content .sidebar-nav li.active a .nav-icon {
        color: #fff;
    }
    .main-sidebar-mini .sidebar-content .sidebar-nav ul li a, .main-sidebar-mini .sidebar-content .sidebar-nav ul li a {
        width: 50px;
    }
    .sidebar-content .sidebar-nav li.active a {
        background: #00C1DE;
        transition: none;
        -webkit-transition: none;
    }
    .main-sidebar-mini .main-sidebar .sidebar-title .sidebar-title-text, .main-sidebar.sidebar-mini .sidebar-title .sidebar-title-text {
        display: none;
    }
    .main-sidebar-mini .main-product {
        left: 50px;
    }
    .main-product {
        width: auto;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        overflow: hidden;
        background: #FFF;
    }
    .main-sidebar-full .main-product {
        left: 180px;
    }
    .main-product-col-1 .main-product-navbar-bg, .main-product-col-1 .main-product-navbar {
        width: 180px;
    }
    .main-product-navbar {
        width: 0;
        float: left;
        background-color: #EAEDF1;
        position: absolute;
        top: 0;
        bottom: 0;
        z-index: 2;
        overflow: hidden;
        -o-transition: all 0.2s ease;
        -ms-transition: all 0.2s ease;
        -moz-transition: all 0.2s ease;
        -webkit-transition: all 0.2s ease;
    }
    .main-product-navbar .product-nav-stage {
        width: 180px;
        overflow: hidden;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
    }
    .main-product-navbar .product-nav-stage .product-nav-scene {
        width: 180px;
        position: absolute;
        top: 0;
        bottom: 0;
        -webkit-transition: position,.2s,linear;
        -moz-transition: position,.2s,linear;
    }
    .main-product-navbar .product-nav-stage-main .product-nav-main-scene {
        left: 0;
    }
    .main-product-navbar .product-nav-main-scene .product-nav-title {
        font-weight: bold;
        text-indent: 20px;
    }
    .main-product-navbar .product-nav-main-scene .product-nav-title {
        font-weight: bold;
        text-indent: 20px;
    }
    .main-product-navbar .product-nav-scene .product-nav-title {
        width: 180px;
        height: 70px;
        line-height: 70px;
        background: #D9DEE4;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .main-product-navbar .product-nav-list {
        position: absolute;
        top: 70px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .main-product-navbar .product-nav-list ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .main-product-navbar .product-nav-list li.active a {
        background-color: #FFF;
    }
    .main-product-navbar .product-nav-list li a {
        width: 180px;
        height: 40px;
        line-height: 40px;
        display: block;
        color: #333;
    }
    .main-product-navbar .product-nav-list li a:hover {
        background-color: #F4F6F8;
    }
    .main-product-navbar .product-nav-list .nav-icon {
        width: 30px;
        height: 40px;
        float: left;
        text-align: center;
        font-size: 16px;
        color: #333;
    }
    .main-product-navbar .product-nav-list .nav-title {
        width: 138px;
        float: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .main-product-navbar .product-nav-list ul ul li a {
        color: #666;
    }
    .main-product-col-1 .main-product-navbar-collapse {
        left: 160px;
    }
    .main-product-navbar-collapse {
        position: absolute;
        left: 0;
        top: 50%;
        width: 20px;
        height: 50px;
        -o-transition: all 0.2s ease;
        -ms-transition: all 0.2s ease;
        -moz-transition: all 0.2s ease;
        -webkit-transition: all 0.2s ease;
    }
    .main-product-col-1 .main-product-navbar-collapse .product-navbar-collapse-inner{
        z-index: 2;
    }
    .main-product-navbar-collapse .product-navbar-collapse-inner {
        top: -50%;
        position: relative;
        overflow: hidden;
        z-index: 3;
    }
    .main-product-navbar-collapse .product-navbar-collapse-bg {
        width: 0;
        height: 50px;
        position: absolute;
        top: 0;
        left: 0;
        border-bottom: 9px solid transparent;
        border-left: 13px solid #D9DEE4;
        border-top: 9px solid transparent;
        -o-transition: all 0.1s ease,0.1s ease;
        -ms-transition: all 0.1s ease,0.1s ease;
        -moz-transition: all 0.1s ease,0.1s ease;
        -webkit-transition: all 0.1s ease,0.1s ease;
    }
    .main-product-navbar-collapse:hover .product-navbar-collapse-bg {
        border-bottom: 8px solid transparent;
        border-left: 20px solid #D9DEE4;
        border-top: 8px solid transparent;
    }
    .main-product-navbar-collapse:hover .product-navbar-collapse {
        left: 0;
        font-size: 16px;
    }
    .main-product-col-1 .main-product-navbar-collapse .product-navbar-collapse-bg {
        right: 0;
        left: auto;
        border-bottom: 9px solid transparent;
        border-left: none;
        border-right: 13px solid #f7f7f7;
        border-top: 9px solid transparent;
    }
    .main-product-col-1 .main-product-navbar-collapse .product-navbar-collapse {
        right: -7px;
        left: auto;
    }
    .main-product-col-1 .main-product-navbar-collapse .product-navbar-collapse>span {
        color: #546478;
    }
    .main-product-col-1 .main-product-navbar-collapse .icon-collapse-left {
        display: inline;
    }
    .main-product-navbar-collapse .product-navbar-collapse>span {
        font-size: 20px;
        line-height: 50px;
        vertical-align: text-top;
    }
    .icon-collapse-left:before {
        content: "\f100";
    }
    .icon-collapse-right:before {
        content: "\f101";
    }
    .main-product-col-1 .main-product-navbar-collapse .product-navbar-collapse>span {
        color: #546478;
    }
    .main-product-col-1 .main-product-navbar-collapse .icon-collapse-left {
        display: inline;
    }
    .main-product-col-1 .main-product-navbar-collapse .icon-collapse-right {
        display: inline;
    }
    .main-product-navbar-collapse .product-navbar-collapse {
        height: 50px;
        position: relative;
        left: -7px;
        text-align: center;
        cursor: pointer;
        -o-transition: all 0.1s ease,0.1s ease;
        -ms-transition: all 0.1s ease,0.1s ease;
        -moz-transition: all 0.1s ease,0.1s ease;
        -webkit-transition: all 0.1s ease,0.1s ease;
    }
    .main-product-col-1 .main-product-navbar-collapse:hover .product-navbar-collapse {
        right: 0;
        left: auto;
    }
    .main-product-col-1 .main-product-navbar-collapse:hover .product-navbar-collapse-bg {
        border-bottom: 8px solid transparent;
        border-left: none;
        border-right: 20px solid #f7f7f7;
        border-top: 8px solid transparent;
    }
    .fade {
        opacity: 0;
        -webkit-transition: opacity 0.15s linear;
        transition: opacity 0.15s linear;
    }
    .main-sidebar-tooltip.right {
        padding: 0 5px;
        margin-left: 3px;
    }
    .main-sidebar-tooltip.in {
        opacity: 0.9;
        filter: alpha(opacity=90);
    }
    .main-sidebar-tooltip {
        position: absolute;
        z-index: 1030;
        display: block;
        font-size: 12px;
        line-height: 1.4;
        opacity: 0;
        filter: alpha(opacity=0);
        visibility: visible;
    }
    .main-sidebar-tooltip.right .tooltip-arrow {
        top: 50%;
        left: 0;
        margin-top: -5px;
        border-right-color: #425160;
        border-width: 5px 5px 5px 0;
    }
    .main-sidebar-tooltip .tooltip-arrow {
        position: absolute;
        width: 0;
        height: 0;
        border-color: transparent;
        border-style: solid;
    }
    .main-sidebar-tooltip .tooltip-inner {
        max-width: 200px;
        padding: 12px 8px;
        color: #ffffff;
        text-align: center;
        text-decoration: none;
        border-radius: 0 0;
        background-color: #425160;
    }

</style>
<template>
  <div
    v-show="isLoading"
    v-loading.fullscreen.lock="!isLoading"
    class="wrapper skin-blue"
  >
    <!--头部信息-->
    <div class="main-topbar">
      <div class="topbar-wrap">
        <div class="topbar-head topbar-left">
          <a
            class="topbar-btn topbar-logo topbar-left"
            href="javascript:void(0);"
          >
            <span class="by-icon icon-logo by-SaaSguanlikongzhitai" />
          </a>
          <a
            href="javascript:void(0);"
            class="topbar-home-link topbar-btn topbar-left"
            @click="userLinkClick('/admin/index')"
          >
            <span>{{ platformInfo.all }}</span>
          </a>
        </div>

        <div class="topbar-info topbar-right topbar-clearfix">
          <div
            style="display:none;"
            class="dropdown topbar-notice topbar-left topbar-info-dropdown topbar-info-item"
          >
            <a
              href="javascript:void(0);"
              class="topbar-btn topbar-btn-notice topbar-hover-dark"
            >
              <span class="topbar-btn-notice-icon icon-bell by-icon by-xiaoxi" />
              <span class="topbar-btn-notice-num">
                0
              </span>
            </a>
          </div>
          <div class="hidden topbar-product topbar-left topbar-info-item">
            <div
              class="topbar-btn topbar-product-btn"
              @click="iframeRefresh"
            >
              <span><i class="by-icon by-loading" />刷新</span>
            </div>
          </div>
          <TopBarDropMenu
            :name="userInfo.mobile"
            :links="userDropMenus"
            @logout="logout"
          />
          <div class="topbar-product topbar-left topbar-info-item">
            <div
              class="topbar-btn topbar-product-btn"
              @click="toggleFullScreen"
            >
              <i
                title="全屏 F11"
                class="by-icon by-webtubiaoku10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="main-body"
      :class="{ 'main-sidebar-mini': isMiniMenu, 'main-sidebar-full': !isMiniMenu}"
    >
      <!--左边导航-->
      <div class="main-sidebar">
        <div class="sidebar-content main-sidebar">
          <div class="sidebar-inner">
            <div
              class="sidebar-fold"
              @click="toggleMiniMenu"
            >
              <span
                class="by-icon"
                :class="isMiniMenu ? 'by-fold' : 'by-santiaogang'"
              />
            </div>
            <div class="sidebar-nav-wrap">
              <SideBarNav
                v-for="(menu, index) in menuList"
                :key="menu.Id"
                :is-nav-active="activeNavIndex === index"
                :nav-menu="menu"
                :index="index"
                :nav-max-height="navMaxHeight"
                :active-index="activeNavMenuIndex"
                @NavOnClick="SideBarNavOnClick"
                @NavOnActive="SideBarNavOnActive"
              />
            </div>
          </div>
        </div>
      </div>
      <!--产品部分-->
      <div
        class="main-product"
        :class="{ 'main-product-col-1': isShowSecondMenu }"
      >
        <SecondNavBar
          v-if="secondMenuData"
          :is-show-second-menu="isShowSecondMenu"
          :menu="secondMenuData"
          @isShowSecondMenu="toggleSecondMenu"
        />
        <!--中间内容-->
        <div
          class="content-wrapper"
          :style="{left: isShowSecondMenu ? 180 + 'px' : '0'}"
        >
          <transition
            name="custom-classes-transition"
            enter-active-class="animated fadeIn"
          >
            <slot name="main-content" />
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
	import http from '../../assets/js/http'
	import SideBarNav from '../../components/common/SideBarNav'
	import SecondNavBar from '../../components/common/SecondNavBar'
	import TopBarDropMenu from '../../components/common/TopBarDropMenu'
	import _ from 'lodash'

	export default {
  name: 'MainHome',
  componentName: 'MainHome',
  components: { SideBarNav, SecondNavBar, TopBarDropMenu },
  mixins: [http],
  data () {
    return {
      isDropUserMenu: false,
      menuList: [],
      userInfo: {
        nickname: '',
        username: '',
        mobile: '',
        id: '',
        head: 0
      },
      platformInfo: {
        all: '',
        mini: 'BY'
      },
      isMiniMenu: false,
      isShowSecondMenu: false,
      activeNavIndex: false,
      activeNavMenuIndex: false,
      secondMenuData: false,
      userDropMenus: [
        //                    { 'name': '修改密码', url: '#/user/update_password' },
        //                    { 'name': '皮肤设置', url: '#/admin/skin' },
        { 'name': '安全退出', method: 'logout' }
      ]
    }
  },
  computed: {
    isLoading () {
      return this.$store.getters.userSessionData.loading
    },
    userSessionData () {
      return this.$store.getters.userSessionData
    },
    userAvatarUrl () {
      return window.tools.getAvatarUrl(this.userInfo.id)
    },
    navMaxHeight () {
      // const navNumber = this.menuList.length;
      // 顶部导航高度50 侧边导航切换按钮高度30 菜单头40
      return document.body.clientHeight - 40 * (2 + 2) - 50 - 30
    }
  },
  watch: {
    userSessionData: function (newValue) {
      console.debug('用戶數據', newValue)
      if (newValue.loading === 2) {
        console.debug('正在请求')
        return
      }
      if (newValue.code === 0) {
        let data = _.cloneDeep(newValue.data)
        console.debug('登录成功', data)
        this.loadMenu(data.menuList)
        this.loadUserInfo(data.userInfo)
        this.loadPlatformInfo(data.platformInfo)
        window.tools.alertClose()
      } else if (newValue.msg) {
        console.debug('登录失败', newValue)
        window.tools.alertWarn(newValue.msg)
        setTimeout(() => {
          this.$router.push('/login')
        }, 2500)
      } else {
        console.debug('登录失败', newValue)
        setTimeout(() => {
          this.$router.push('/login')
        }, 2500)
      }
    }
  },
  created () {
    this.getUserData()
  },
  mounted () {},
  methods: {
    getUserData () {
      window.tools.alertInfo('获取数据...')
      this.$store.dispatch('getUserSessionData')
    },
    // 切换迷你侧边导航
    toggleMiniMenu () {
      this.isMiniMenu = !this.isMiniMenu
    },
    // 切换显示二级菜单
    toggleSecondMenu () {
      this.isShowSecondMenu = !this.isShowSecondMenu
    },
    // 导航按钮被点击
    SideBarNavOnClick (index, menu) {
      this.activeNavMenuIndex = index
      this.secondMenuData = menu
      this.isShowSecondMenu = !!menu
    },
    // 导航激活点亮
    SideBarNavOnActive (index) {
      this.activeNavIndex = index
    },
    // 切换全屏
    toggleFullScreen () {
      window.screenfull.toggle()
    },
    // 刷新iframe
    iframeRefresh () {
      console.log(this.$route.fullPath)
    },
    // 退出
    logout () {
      console.log('logout')
      this.$router.push('logout')
    },
    // 链接点击
    userLinkClick (link) {
      window.tools.returnTop()
      setTimeout(() => { this.$store.dispatch('mainFrameJump', window.tools.getApiUrl(link)) }, 1)
    },
    queryChildMenu (data = [], action) {
      if (typeof action !== 'function') return
      let ret = []
      data.forEach(val => {
        if (action(val)) {
          val.IsFront = (parseInt(val.IsFront) === 1)
          ret.push(val)
        }
      })
      return ret
    },
    loadChildMenu (list = [], data = []) {
      list = list.map(val => {
        val.children = this.queryChildMenu(data, (v) => (v.ParentId === val.Id))
        val.AllowExpand = val.children.length > 0 && val.url !== '#'
        return val
      })
      return list
    },
    // 菜单数据处理
    loadMenu (menuList = []) {
      let newList = this.queryChildMenu(menuList, (v) => (v.ParentId === 0))
      newList = this.loadChildMenu(newList, menuList)
      newList = newList.map(val => {
        val.children = this.loadChildMenu(val.children, menuList)
        return val
      })
      console.log(newList)
      this.menuList = newList
    },
    getApiUrl (url) {
      return window.tools.getApiUrl(url)
    },
    // 加载用户信息
    loadUserInfo (userInfo) {
      this.userInfo.nickname = userInfo.nickname
      this.userInfo.id = userInfo.id
      this.userInfo.username = userInfo.username
      this.userInfo.head = userInfo.head
      this.userInfo.mobile = userInfo.mobile
    },
    // 加载平台信息
    loadPlatformInfo (PlatformInfo) {
      this.platformInfo.all = PlatformInfo
    }
  }
}
</script>
