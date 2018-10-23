// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import Vue2Filters from 'vue2-filters'
import api from "./api";
import 'vuetify/dist/vuetify.min.css'
const moment = require('moment')
require('moment/locale/es')
Vue.use(Vuetify)
Vue.use(Vue2Filters)
Vue.mixin(api);
Vue.use(require('vue-moment'), {
  moment
})

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
