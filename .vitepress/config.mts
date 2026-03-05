import { execSync } from "child_process";
import { defineConfig } from "vitepress";

function getGitInfo() {
  try {
    const branch =
      process.env.GITHUB_REF_NAME ||
      execSync("git symbolic-ref --short HEAD").toString().trim();
    const hash = execSync("git rev-parse --short HEAD").toString().trim();
    const timeStr = execSync("git show -s --format=%ct").toString().trim();
    const date = new Date(Number(timeStr) * 1000);
    const formattedDate = new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);

    return `${branch}:${hash} (${formattedDate})`;
  } catch (e) {
    return "Dev build (no git info)";
  }
}

const gitVersion = getGitInfo();

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/vitepress-labs/",
  title: "Лабораторные работы",
  description: "Лабораторные работы по разным предметам",
  cleanUrls: true,
  head: [
    ["link", { rel: "icon", href: "/vitepress-labs/favicon.ico" }],
    ["meta", { name: "theme-color", content: "#5f67ee" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "Мои Лабораторные | LeetCode" }],
    [
      "meta",
      {
        property: "og:description",
        content: "Интерактивные решения алгоритмических задач.",
      },
    ],
    [
      "script",
      {},
      `
      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
      })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=107147208', 'ym');

      ym(107147208, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
      `,
    ],
    [
      "noscript",
      {},
      '<div><img src="https://mc.yandex.ru/watch/107147208" style="position:absolute; left:-9999px;" alt="" /></div>',
    ],
    //['meta', { property: 'og:image', content: 'https://l1ttl3h0rse.github.io/vitepress-labs/cover.png' }],
  ],
  sitemap: {
    hostname: "https://l1ttl3h0rse.github.io/vitepress-labs",
  },
  themeConfig: {
    logo: "/favicon.ico",
    search: {
      provider: "local",
    },
    nav: [{ text: "Главная", link: "/" }],
    sidebar: [
      {
        text: "Математическая логика и теория алгоритмов",
        link: "/mathlogic",
        items: [
          { text: "Лабораторная работа №1", link: "/labs/mathlogic/lab1" },
          { text: "Лабораторная работа №2", link: "/labs/mathlogic/lab2" },
          { text: "Лабораторная работа №3", link: "/labs/mathlogic/lab3" },
        ],
      },
      {
        text: "Дискретная математика",
        link: "/discrete",
        items: [
          { text: "Лабораторная работа №1", link: "/labs/discrete/lab1" },
          { text: "Лабораторная работа №2", link: "/labs/discrete/lab2" },
          { text: "Лабораторная работа №3", link: "/labs/discrete/lab3" },
          { text: "Лабораторная работа №4", link: "/labs/discrete/lab4" },
          { text: "Лабораторная работа №5", link: "/labs/discrete/lab5" },
          { text: "Лабораторная работа №6", link: "/labs/discrete/lab6" },
        ],
      },
      {
        text: "Информационная безопасность и защита информации",
        link: "/infosec",
      },
      {
        text: "Лингвистическое обеспечение систем автоматизированного проектирования",
        link: "/lingo",
        items: [
          { text: "Лабораторная работа №1", link: "/labs/lingo/lab1" },
          { text: "Лабораторная работа №2", link: "/labs/lingo/lab2" },
          { text: "Лабораторная работа №3", link: "/labs/lingo/lab3" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/L1TTL3H0rSE" },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path d="M9.78 18.65l.28-4.23l7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3L3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" fill="currentColor"/></svg>',
        },
        link: "https://t.me/lolyakis",
      },
    ],
    footer: {
      message: `Версия: ${gitVersion}`,
      copyright: "Copyright © 2026 - l1ttl3h0rse",
    },
  },
  vite: {
    build: {
      minify: false,
    },
  },
});
