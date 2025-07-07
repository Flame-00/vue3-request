// Don't remove this file, because it registers the demo components.
import Demo from 'vitepress-theme-demoblock/dist/client/components/Demo.vue'
import DemoBlock from 'vitepress-theme-demoblock/dist/client/components/DemoBlock.vue'
import Loading from '../../components/Loading.vue'
import Button from '../../components/Button.vue'

export function useComponents(app) {
  app.component('Demo', Demo)
  app.component('DemoBlock', DemoBlock) 
  app.component('Loading', Loading)
  app.component('CustomButton', Button)
}
