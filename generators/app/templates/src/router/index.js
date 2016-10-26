import Vue from 'vue'
import Router from 'vue-router'
import store from 'store'
import routes from './routes'

Vue.use(Router)

const router = new Router({ routes })

router.beforeEach((to, from, next) => {
  store.dispatch('setProgress', 80)
  next()
})

router.afterEach(() => {
  if (document.activeElement && document.activeElement.nodeName !== 'BODY') {
    document.activeElement.blur()
  }
  store.dispatch('setProgress', 100)
})

export default router
