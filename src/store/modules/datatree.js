/**
 * 数据字典 v1.0
 * @author hebidu 346551990@qq.com
 * @datetime 20170724
 **/
import datatreeApi from '../../api/datatreeApi';
import * as types from '../mutation-types';

// initial state
const state = {
  datatree_result: []
};

// getters
const getters = {
  datatree_result: state => state.datatree_result
};

// actions
const actions = {
  [types.ByDatatreeQuery] ({ commit }, queryData) {
    console.debug('[Vuex Action] query data ', queryData);
    commit(types.ByDatatreeQuery);
    datatreeApi.query(
      queryData,
      (res) => {
        commit(types.ByDatatreeQueryDone, res);
      },
      (res) => {
        commit(types.ByDatatreeQueryDone, res);
      }
    );
  }
};

// mutations
const mutations = {
  [types.ByDatatreeQueryDone] (state, data) {
    console.debug('ByDatatreeQueryDone', data);
    state.datatree_result = data;
  },
  [types.ByDatatreeQuery] (state) {
    console.debug('ByDatatreeQuery');
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
