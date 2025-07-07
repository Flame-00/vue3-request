import DefaultTheme from 'vitepress/theme'
import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import { useComponents } from './useComponents'
import './style.css'
// 通用字体
import 'vfonts/Lato.css'
export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)
    useComponents(ctx.app)
  }
}