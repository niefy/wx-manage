<template>
  <div class="mod-home">
    <h3>欢迎使用微信CMS管理系统</h3>
  </div>
</template>

<script>

export default {
  data() {
    return {
      countData: {},
      visitInfo: [],
    };
  },
  mounted() {
      this.getAccessToken()
  },
  methods: {
      getAccessToken(){
          this.$http({
              url: this.$http.adornUrl('/manage/wxAccessToken/getAccessToken'),
              method: 'get'
            })
      }
  }
};
</script>

<style>
.mod-home {
  line-height: 2.5;
  text-align: center;
}
</style>

