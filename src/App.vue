<style>
  *{
    box-sizing: border-box;
  }
  *{padding: 0;margin: 0;}
  .text-center{
    text-align: center;
  }
  .hidden {
    display: none !important;
  }
  .main-content .el-breadcrumb{
    margin-bottom: 15px;
  }
  .margin-sm-top{
    margin-top: 5px;
  }
  .margin-sm-bottom{
    margin-bottom: 5px;
  }
  .margin-sm-left{
    margin-left: 5px;
  }
  .margin-sm-right{
    margin-right: 5px;
  }
  .margin-sm{
    margin: 5px;
  }
  .margin-xs-top{
    margin-top: 2px;
  }
  .margin-xs-bottom{
    margin-bottom: 2px;
  }
  .margin-xs-left{
    margin-left: 2px;
  }
  .margin-xs-right{
    margin-right: 2px;
  }
  .margin-xs{
    margin: 2px;
  }
  .margin-md{
    margin: 15px;
  }
  .margin-md-top{
    margin-top: 15px;
  }
  .margin-md-bottom{
    margin-bottom: 15px;
  }
  .margin-md-left{
    margin-left: 15px;
  }
  .margin-md-right{
    margin-right: 15px;
  }
  .margin-lg-top{
    margin-top: 25px;
  }
  .margin-lg-bottom{
    margin-bottom: 25px;
  }
  .margin-lg-left{
    margin-left: 25px;
  }
  .margin-lg-right{
    margin-right: 25px;
  }
  .margin-lg{
    margin: 25px;
  }
  .padding-sm{
    padding: 5px;
  }
  .padding-sm-top{
    padding-top: 5px;
  }
  .padding-sm-bottom{
    padding-bottom: 5px;
  }
  .padding-sm-left{
    padding-left: 5px;
  }
  .padding-sm-right{
    padding-right: 5px;
  }
  .padding-xs{
    padding: 2px;
  }
  .padding-xs-top{
    padding-top: 2px;
  }
  .padding-xs-bottom{
    padding-bottom: 2px;
  }
  .padding-xs-left{
    padding-left: 2px;
  }
  .padding-xs-right{
    padding-right: 2px;
  }
  .padding-md{
    padding: 15px;
  }
  .padding-md-top{
    padding-top: 15px;
  }
  .padding-md-bottom{
    padding-bottom: 15px;
  }
  .padding-md-left{
    padding-left: 15px;
  }
  .padding-md-right{
    padding-right: 15px;
  }
  .padding-lg{
    padding: 25px;
  }
  .padding-lg-top{
    padding-top: 25px;
  }
  .padding-lg-bottom{
    padding-bottom: 25px;
  }
  .padding-lg-left{
    padding-left: 25px;
  }
  .padding-lg-right{
    padding-right: 25px;
  }

  /* 颜色 */
  .bg-blue-light{background-color:#58b7ff}
  .bg-blue,.bg-info{background-color:#20a0ff}
  .bg-blue-dark{background-color:#1d8ce0}
  .bg-success{background-color:#13ce66}
  .bg-warning{background-color:#f7ba2a}
  .bg-danger{background-color:#ff4949}
  .bg-black{background-color:#1f2d3d}
  .bg-black-light{background-color:#324057}
  .bg-black-lighter{background-color:#475669}
  .bg-silver{background-color:#8492a6}
  .bg-silver-light{background-color:#99a9bf}
  .bg-silver-lighter{background-color:#c0ccda}
  .bg-gray{background-color:#d3dce6}
  .bg-gray-light{background-color:#e5e9f2}
  .bg-gray-lighter{background-color:#eff2f7}
  .bg-white-dark{background-color:#f9fafc}
  .color-gray{color:#5e6d82}
  .color-blue-light{color:#58b7ff}
  .color-blue,.color-info{color:#20a0ff}
  .color-blue-dark{color:#1d8ce0}
  .color-success{color:#13ce66}
  .color-warning{color:#f7ba2a}
  .color-danger{color:#ff4949}
  .color-black{color:#1f2d3d}
  .color-black-light{color:#324057}
  .color-black-lighter{color:#475669}
  .color-silver{color:#8492a6}
  .color-silver-light{color:#99a9bf}
  .color-silver-lighter{color:#c0ccda}
  .color-gray{color:#d3dce6}
  .color-gray-light{color:#e5e9f2}
  .color-gray-lighter{color:#eff2f7}
  .color-white-dark{color:#f9fafc}
</style>
<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  components: {
  },
  mounted: function () {
    window.itboye.clientInfo.lang = window.tools.getBrowseLanguage()
    window.itboye.clientInfo.timezone = window.tools.getTimezone()
  }
}
</script>

<style>
  @import url(//at.alicdn.com/t/font_326734_h6sq6h2ecb8.css);

  span.by-icon,i.by-icon{
    font-family: 'boyefont';
    font-style: normal;
  }

</style>
