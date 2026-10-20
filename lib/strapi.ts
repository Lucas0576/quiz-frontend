import type { Question } from "./types";
import seedData from "@/data/questions.json";

// 题目数据层（Cloudflare 原生方案，已移除对 Strapi 的依赖）
//
// 数据来源按优先级：
//   1) Cloudflare D1 数据库 —— 当 wrangler.jsonc 中绑定了名为 DB 的 D1 database 时自动启用
//   2) 仓库内置的 data/questions.json —— 默认来源，零配置即可运行
//
// 页面（Server Component）继续调用 fetchQuestions / fetchQuestion，导出签名保持不变。

const SEED = seedData as unknown as Question[];

// 仅用到的 D1 能力，避免依赖未生成的环境类型声明
type D1PreparedStatementLike = {
  all: <T>() => Promise<{ results?: T[] }>;
};
type D1Like = {
  prepare: (sql: string) => D1PreparedStatementLike;
};

// 从 D1 读取；未绑定数据库或不在 Worker 运行时中时返回 null
async function readFromD1(): Promise<Question[] | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as unknown as { DB?: D1Like } | undefined)?.DB;
    if (!db) return null;
    const { results } = await db
      .prepare("SELECT * FROM questions ORDER BY id ASC")
      .all<Question>();
    return results && results.length > 0 ? results : null;
  } catch {
    // 未配置 D1 或不在 Worker 运行时，回退到内置数据
    return null;
  }
}

// 获取全部题目
export async function fetchQuestions(): Promise<Question[]> {
  const rows = await readFromD1();
  return rows ?? SEED;
}

// 按 ID 获取单题
export async function fetchQuestion(id: string | number): Promise<Question | null> {
  const all = await fetchQuestions();
  return all.find((q) => String(q.id) === String(id)) ?? null;
}

// 把封面字段统一为可直接使用的图片 URL（支持字符串或 { url }）
export function mediaUrl(media: { url?: string } | string | null | undefined): string {
  if (!media) return "";
  const raw = typeof media === "string" ? media : media.url || "";
  return raw || "";
}
