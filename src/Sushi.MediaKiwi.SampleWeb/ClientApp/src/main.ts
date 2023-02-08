import App from './App.vue'

import { createApp } from 'vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { md3 } from 'vuetify/blueprints'

const app = createApp(App)

const vuetify = createVuetify({blueprint: md3, components, directives})

app.use(vuetify)

app.mount('#app')
