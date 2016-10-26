import Vue from 'vue'
import I18n from 'plugins/i18n'
import Validator from 'plugins/validator'
import tap from 'directives/tap'
import App from 'app'
import store from 'store'
import router from 'router'

if (module.hot) {
  module.hot.accept()
}

// 国际化，如果未使用，请移除
Vue.use(I18n, {
  // 翻译资源库
  data () {
    return store.getters.i18n
  }
})

// (表单)验证，如果未使用，请移除
Vue.use(Validator)

// tap event
Vue.directive('tap', tap)

new Vue(Vue.util.extend({ router, store }, App)).$mount('#app')
