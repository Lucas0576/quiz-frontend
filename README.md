# 题库中心 Quiz Hub（Next.js 15）

基于 **Next.js 15 App Router** 的刷题前端，部署到 **Cloudflare Workers**（OpenNext）。

- 首页：题库列表，点击进入答题
- 答题页：题干 + 4 选项 → 提交 → 对错反馈 + 解析 → 下一题
- 响应式 UI（Tailwind CSS），手机 / 电脑自适应
- 数据在服务端组件中读取，无需浏览器跨域

## 数据来源

题目的数据层在 `lib/strapi.ts`，按优先级读取：

1. **Cloudflare D1 数据库**：当 `wrangler.jsonc` 中绑定了名为 `DB` 的 D1 database 时自动启用；
2. **仓库内置 `data/questions.json`**：默认来源，零配置即可运行。

> 读不到 D1 时自动回退到内置 JSON，因此**不做任何后端配置也能正常显示题目**。

题目字段：`title`、`coverImage`（可为字符串 URL 或 `{ url }`）、`optionA/B/C/D`、`answer`（`A`/`B`/`C`/`D`）、`explanation`、`locale`、`category`。

## 项目结构

```
quiz-next/
├── app/
│   ├── layout.tsx              # 根布局 + Header
│   ├── page.tsx                # 首页：题库列表（服务端读取）
│   ├── globals.css             # Tailwind 全局样式
│   └── quiz/[id]/page.tsx      # 答题页（服务端取题，交互下沉客户端）
├── components/
│   ├── SiteHeader.tsx
│   ├── QuestionListItem.tsx
│   └── QuestionCard.tsx        # "use client" 选项选择与提交反馈
├── data/
│   └── questions.json          # 内置题库（可直接编辑）
├── lib/
│   ├── strapi.ts               # 数据层：D1 优先，回退内置 JSON
│   └── types.ts                # 题目类型定义
├── .env.example
├── next.config.ts
├── open-next.config.ts
├── wrangler.jsonc
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

## 本地开发

```bash
npm install
npm run dev          # http://localhost:3000
```

## 构建与部署

```bash
npm run build:opennext   # 生成 .open-next/worker.js
npx wrangler deploy      # 部署到 Cloudflare Workers
```

Cloudflare 连接 Git 仓库后的构建设置：

| 配置项 | 值 |
|---|---|
| Build command | `npm run build:opennext` |
| Deploy command | `npx wrangler deploy` |

## 可选：迁移到 Cloudflare D1

1. Cloudflare 控制台 → **Workers & Pages → D1 → Create database**，记下 Database ID。
2. 在 `wrangler.jsonc` 加入绑定：

   ```jsonc
   "d1_databases": [
     { "binding": "DB", "database_name": "quiz-db", "database_id": "<你的 Database ID>" }
   ]
   ```

3. 在 D1 控制台执行建表与插入 SQL（见 `.env.example` 注释）。
4. 重新部署即可；D1 有数据时优先使用，否则回退到 `data/questions.json`。

## 常见问题

- **首页题目为空**：检查 `data/questions.json` 是否有内容。
- **封面图不显示**：`next.config.ts` 已允许所有 https 域名的远程图片，确认图片 URL 可公开访问。
