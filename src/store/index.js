import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import datatree from './modules/datatree'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    user,
    datatree
  },
  strict: debug
})
