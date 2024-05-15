import { createApp } from 'vue';
import pinia from '/@/stores/index';
import App from '/@/App.vue';
import router from '/@/router';
import ElementPlus from 'element-plus';
import '/@/theme/index.scss';
import 'animate.css';
import { Local } from '/@/utils/storage.ts';
import axios from 'axios';

let token = Local.get('token')
const app = createApp(App);
app.use(pinia).use(router).use(ElementPlus)
if (!token) {
    axios.post('/api/v1/user/_login', {
        "passwd": "admin",
        "username": "admin"
    })
        .then((res) => {
            Local.set('token', res?.data?.token)
            app.mount('#app');
        })

}
