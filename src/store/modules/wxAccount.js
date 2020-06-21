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
        if(!list.length)return
        if(!state.selectedAppid){
          let appidCookie  = Vue.cookie.get('appid')
          let selectedAppid = appidCookie?appidCookie:list[0].appid
          this.commit('wxAccount/selectAccount',selectedAppid)
        }
      },
      selectAccount (state, appid) {
        state.selectedAppid = appid
        Vue.cookie.set('appid',appid)
      },
    }
  }
  