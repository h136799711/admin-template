const routeLoad = {
  computed: {
    routerReloadData () {
      return this.$store.state.routerReloadData
    }
  },
  watch: {
    routerReloadData () {
      if (typeof this.loadData === 'function') this.loadData()
    }
  }
}

export default routeLoad
