import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import installElementPlus from './plugins/element'
import * as ELIconModules from '@element-plus/icons-vue'
import Axios from 'axios'

// Axios.defaults.baseURL = '  http://127.0.0.1:8888/api/private/v1 '

const app = createApp(App)
app.config.globalProperties.$axios = Axios
for (const iconName in ELIconModules) {
  app.component(iconName, ELIconModules[iconName])
}
installElementPlus(app)
app.use(router).mount('#app')
