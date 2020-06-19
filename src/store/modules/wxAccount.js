export default {
    namespaced: true,
    state: {
        ACCOUNT_TYPES:{
            1:'订阅号',
            2:'服务号'
        },
        accountList:[],
        selectedAppid:''
    },
    mutations: {
      updateAccountList (state, list) {
        state.accountList = list
      },
      selectAccount (state, appid) {
        state.selectedAppid = appid
      },
    }
  }
  