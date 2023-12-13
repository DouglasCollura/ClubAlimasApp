import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { IonicVue } from '@ionic/vue';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import TextareaAutosize from 'vue-textarea-autosize';
/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
//import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
//import '@ionic/vue/css/display.css';

/* Theme variables */
//import './theme/variables.css';
import './theme/grid.css';
import './theme/template.css';
import './theme/custom.css';
import "animate.css";
import "./icons/style.css";
import './theme/chart.css';

import Base from './views/Layouts/Base.vue';
import store from './store'



const app = createApp(App).use(store)
  .use(IonicVue)
  .use(TextareaAutosize)
  .use(router);
app.use(VueSweetalert2);
app.component('base-layout', Base);
router.isReady().then(() => {
  app.mount('#app');
});
defineCustomElements(window);  