import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import Element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import routes from './routes'
import Mock from './mock'
import 'font-awesome/css/font-awesome.min.css'
import VueCodeMirror from 'vue-codemirror'


Mock.bootstrap();
Vue.use(VueCodeMirror)
Vue.use(Element)
Vue.use(VueRouter)
Vue.use(Vuex)

NProgress.configure({
  showSpinner: false
});

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    sessionStorage.removeItem('jwtToken')
  }
  let token = sessionStorage.getItem('jwtToken')
  let hasToken = token !== undefined && token !== null
  if (!hasToken && to.path != '/login') {
    next({
      path: '/login'
    })
  } else {
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
