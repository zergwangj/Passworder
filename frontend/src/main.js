import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import './assets/global.less';
import components from './components/global';
import Router from './router/index';

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const app = createApp(App)
app.use(ElementPlus)
app.config.productionTip = false

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// components
for (const i in components) {
  app.component(i, components[i])
}

app.use(Router).mount('#app')
