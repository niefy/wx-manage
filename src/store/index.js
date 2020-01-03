import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import user from './modules/user'
import article from './modules/article'
import message from './modules/message'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    user,
    article,
    message
  },
  mutations: {
  },
  strict: process.env.NODE_ENV !== 'production'
})
