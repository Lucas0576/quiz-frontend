# 题库中心 Quiz Hub（Next.js 15）

基于 **Next.js 15 App Router** 的刷题前端，对接 **Strapi Cloud** 的 REST API，部署到 **Cloudflare Pages**。

- 首页：题库列表，点击进入答题
- 答题页：题干 + 4 选项 → 提交 → 对错反馈 + 解析 → 下一题
- 响应式 UI（Tailwind CSS），手机 / 电脑自适应
- 数据由服务端组件从 Strapi 拉取，无 CORS 问题

## 项目结构

```
quiz-next/
├── app/
│   ├── layout.tsx              # 根布局 + Header
│   ├── page.tsx                # 首页：题库列表（服务端拉取 Strapi）
│   ├── globals.css             # Tailwind 全局样式
│   └── quiz/[id]/page.tsx      # 答题页（服务端拉取单题，交互下沉客户端）
├── components/
│   ├── SiteHeader.tsx
│   ├── QuestionListItem.tsx
│   └── QuestionCard.tsx        # "use client" 选项选择与提交反馈
├── lib/
│   ├── strapi.ts               # Strapi REST 请求封装
│   └── types.ts                # 题目类型定义
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

## 本地开发

```bash
npm install
cp .env.example .env.local
# 编辑 .env.local：NEXT_PUBLIC_STRAPI_API=https://your-project.strapi.io
npm run dev          # http://localhost:3000
```

## 环境变量

| 变量 | 说明 |
|---|---|
| `NEXT_PUBLIC_STRAPI_URL` | Strapi Cloud 站点地址，如 `https://your-project.strapi.io`（无尾斜杠）。`NEXT_PUBLIC_` 前缀表示同时在服务端与客户端可用 |

## Strapi 接口契约

本项目假设 Strapi 控制器返回**扁平结构**（无 `attributes` 嵌套）：

```
GET /api/questions            → { data: [ { id, title, optionA..D, answer, explanation, ... } ] }
GET /api/questions/:id        → { data: { ... } }
```

题目字段：`title`、`coverImage`(媒体)、`optionA/B/C/D`、`answer`(枚举 A/B/C/D)、`explanation`、`locale`、`category`。

## 部署到 Cloudflare Pages

1. 将本目录推送到 GitHub。
2. Cloudflare 控制台 → Workers & Pages → Create → Pages → Connect to Git，选择仓库。
3. **Build settings**：
   - Framework preset: **Next.js**
   - Build command: `npm run build`
   - Build output directory: 留空（Next.js 预设自动处理）
4. **Environment variables** 添加：
   - `NEXT_PUBLIC_STRAPI_URL` = `https://your-project.strapi.io`
5. 部署完成后，在 Strapi Cloud 的 CORS 设置中把 Pages 域名加入 `FRONTEND_URL`。

> Cloudflare Pages 的 Next.js 框架预设会自动使用 `@cloudflare/next-on-pages` 构建，无需额外配置。

## 常见问题

- **页面报错「NEXT_PUBLIC_STRAPI_URL 未配置」**：检查 Pages 环境变量是否设置且已重新部署。
- **跨域 / CORS**：本项目数据在服务端组件中拉取，不走浏览器跨域；若改用客户端 fetch，请在 Strapi 配置 `FRONTEND_URL` 放行 Pages 域名。
- **图片不显示**：`next.config.ts` 已允许所有 https 域名的远程图片；确保 Strapi 媒体 URL 可公开访问。
