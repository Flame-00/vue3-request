import { defineConfig } from 'vitepress'
import { demoblockPlugin, demoblockVitePlugin } from 'vitepress-theme-demoblock'
import { fileURLToPath } from 'node:url'
export default defineConfig({
  title: "Vue3AsyncHandler",
  description: "A Vue3 asynchronous request processing library, designed to simplify your asynchronous operations and API calls.",
  base: '/vue3-async-handler',
  head: [
    ['link', { rel: 'icon', href: '/vue3-async-handler/logo.svg' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '指南', link: '/introduce/' },
      { text: 'Demo', link: '/demo/basic' },
      {
        text: '在线沙盒示例',
        link: 'https://codesandbox.io/p/sandbox/admiring-ride-4sz9l7'
      },
      { text: 'API', link: '/API/' },
    ],
  docFooter: {
  prev: '上一页',
  next: '下一页'
},
  editLink: {
  pattern: 'https://github.com/fslflame/vue3-async-handler',
  text: '在 GitHub 上编辑此页面'
},
  externalLinkIcon: true,
  search: {
  provider: 'local',
},
  lastUpdated: {
  text: '最后更改',
  formatOptions: {
    dateStyle: 'medium',
    timeStyle: 'short'
  }
},
  outline: {
  level: 'deep',
  label: '目录'
},
  sidebar: [
  {
    text: '指南',
    items: [
      { text: '介绍', link: '/introduce/' },
      { text: '起步', link: '/starting/' },
    ]
  },
  {
    text: '演示',
    items: [
      { text: '基本使用', link: '/demo/basic' },
      { text: '参数管理', link: '/demo/parameter-management' },
      { text: '生命周期', link: '/demo/lifecycle' },
      { text: '刷新（重复上一次请求）', link: '/demo/refresh' },
      { text: '取消响应', link: '/demo/cancel-response' },
      { text: '中止请求', link: '/demo/abort-request' },
      { text: '轮询', link: '/demo/polling' },
      { text: '缓存 & SWR', link: '/demo/cache' },
      { text: '请求重试', link: '/demo/retry' },
    ]
  },

  {
    text: 'API',
    items: [
      { text: 'API', link: '/API/' },
    ]
  },
  {
    text: 'FAQ',
    items: [
      { text: 'FAQ', link: '/FAQ/' },
    ]
  }
],

  socialLinks: [
  { icon: 'github', link: 'https://github.com/fslflame/vue3-async-handler' }
]
  },
  markdown: {
  config: (md) => {
    md.use(demoblockPlugin)
  }
},
  vite: {
  // @ts-ignore
  plugins: [demoblockVitePlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('../../docs', import.meta.url))
    }
  }
}
})
