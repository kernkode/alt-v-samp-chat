import { createApp } from 'vue'
import App from './App.vue'

import { createMemoryHistory, createRouter } from 'vue-router'

import Chat from './components/ChatServer.vue'

const routes = [
  { path: '/', component: Chat }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
//createApp(App).mount('#app')
