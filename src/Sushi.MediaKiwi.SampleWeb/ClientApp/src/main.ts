import App from './App.vue'

import { createApp } from 'vue'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { md3 } from 'vuetify/blueprints'

import { addRoutes } from '../src/mkroutes'

const app = createApp(App)
// load fonts
const webFontLoader = await import(
  /* webpackChunkName: "webfontloader" */ 'webfontloader'
)

webFontLoader.load({
  google: {
    families: ['Roboto:100,300,400,500,700,900&display=swap'],
  },
})

const vuetify = createVuetify({ blueprint: md3, components, directives })

app.use(vuetify)
// add routing
addRoutes(app)

app.mount('#app')
