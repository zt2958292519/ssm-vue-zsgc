import Vue from 'vue'
import App from './App.vue'

//导入elementui

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

//导入axios
import Axios from 'axios'


Axios.defaults.baseURL = "http://localhost:8080/ssm_vue_eui"
// 将baseURL绑定到全局
Vue.prototype.$axios = Axios

//use
Vue.use(ElementUI)

new Vue({
  el: '#app',
  render: h => h(App)
})
