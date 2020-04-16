export default {
    namespaced: true,
    state: {
        tags:[]
    },
    mutations: {
      updateTags (state, tags) {
        state.tags = tags
      }
    }
  }
  