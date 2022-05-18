import Vue from 'vue'
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
        Vue.cookie.set('appid',appid)
        let oldAppid = state.selectedAppid
        state.selectedAppid = appid
        if(oldAppid){//切换账号时刷新网页
          location.reload();
        }
      },
    }
  }
  