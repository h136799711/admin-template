import user from './modules/user'
import datatree from './modules/datatree'
import {createStore} from 'vuex'

const debug = process.env.NODE_ENV !== 'production'

const store = createStore({
  modules: {
    user,
    datatree
  },
  strict: debug
})
export default  store
