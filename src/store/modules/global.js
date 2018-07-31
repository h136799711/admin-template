const state = {
  mainFrameSrc: '',
  mainFrameLoading: true,
  routerReloadData: 'reload'
};

const getters = {
  mainFrameSrc: state => state.mainFrameSrc,
  mainFrameLoading: state => state.mainFrameLoading,
  routerReloadData: state => state.routerReloadData
};

const actions = {
  mainFrameJump: ({ commit }, status) => {
    commit('mainFrameJump', status);
  },
  mainFrameJumpEnd: ({ commit }) => {
    commit('mainFrameLoading', false);
  },
  routerReloadData: ({ commit }) => {
    console.log('routerReloadData action');
    commit('routerReloadData');
  }
};

const mutations = {
  mainFrameJump (state, status) {
    state.mainFrameSrc = status;
    state.mainFrameLoading = true;
  },
  mainFrameLoading (state, status) {
    state.mainFrameLoading = status;
  },
  routerReloadData (state, status) {
    state.routerReloadData = 'reload' + (new Date()).getTime();
    console.log('routerReloadData mutations');
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
