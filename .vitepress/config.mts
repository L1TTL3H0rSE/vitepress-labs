import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/vitepress-labs/',
  title: "Тельпуховский Н.А.",
  description: "Лабораторные работы",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Главная', link: '/' },
    ],

    sidebar: [
      {
        text: 'Лабораторные работы',
        items: [
          { text: 'Лабораторная работа №1', link: '/lab1' },
          { text: 'Лабораторная работа №2', link: '/lab2' },
          { text: 'Лабораторная работа №3', link: '/lab3' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/L1TTL3H0rSE' }
    ]
  }
})
