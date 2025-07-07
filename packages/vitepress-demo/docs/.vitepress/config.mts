import { defineConfig } from 'vitepress'
import { demoblockPlugin, demoblockVitePlugin } from 'vitepress-theme-demoblock'
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
      { text: '演示', link: '/demo/basic' },
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
          { text: '取消请求', link: '/demo/cancel-request' },
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
  }
})
