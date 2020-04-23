import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLazyLoad from 'vue-lazyload'
import FastClick from 'fastclick'
import 'common/stylus/index.styl'
FastClick.attach(document.body)
Vue.use(VueLazyLoad,{
    loading: require('common/image/default.png')
})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
