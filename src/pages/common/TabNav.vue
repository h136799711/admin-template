<template>
</template>

<script>
    export default {
        name: 'TabNav',
        componentName: 'TabNav',
        props: {
            tabOptions: Array,
            currentTab: '',
        },
        data () {
            return {}
        },
        mounted () {
        },
        methods: {
            removeTab (targetName) {
                console.debug('remove tab')
                let tabs = this.tabOptions
                let activeName = this.currentTab
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1]
                            if (nextTab) {
                                activeName = nextTab.name
                            }
                        }
                    })
                }

                this.currentTab = activeName
                this.tabOptions = tabs.filter(tab => tab.name !== targetName)
            },
            clickTab () {
                console.debug('click tab')
            },
        }
    }
</script>
