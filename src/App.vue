<style>
    @import url(//at.alicdn.com/t/font_326734_6h3wa1i6etk.css);
    @import "./assets/css/global.css";
    @import './assets/css/animate.css';
</style>
<template>
    <div id="app">
        <router-view/>
    </div>
</template>
<script>
    import { dbhTool } from '@peter_xiter/dbh-js-tools/index'

    export default {
        name: 'App',
        components: {},
        mounted: function () {
            this.initialize()
        },
        methods: {
            initialize () {
                let timezone = dbh.clientInfo.timezone = dbhTool.getTimezone()
                dbh.clientInfo.lang = this.$i18n.locale = dbhTool.getBrowseLanguage()
                if (timezone > 0) timezone = '+' + timezone.toString()
                dbhTool.debug('Environment', process.env.NODE_ENV)
                dbhTool.debug('Language', dbh.clientInfo.lang)
                dbhTool.debug('Timezone', 'GMT' + timezone)
                dbhTool.debug('Build Version', process.env.APP_VERSION)
            }
        }
    }
</script>
