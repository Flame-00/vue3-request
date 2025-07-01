
import DefaultTheme from 'vitepress/theme'
// your demo component
import demo from 'vitepress-demoblock-xr/demo.vue'    
export default {
  ...DefaultTheme,
  async enhanceApp({ app, }) {
    app.component('demo', demo)
  },
}
