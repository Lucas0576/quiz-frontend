import type { Question, StrapiItemResponse, StrapiListResponse } from "./types";

// Strapi 主机地址：NEXT_PUBLIC_ 前缀表示同时在服务端与客户端可用
const STRAPI_URL = (process.env.NEXT_PUBLIC_STRAPI_URL || "").replace(/\/$/, "");

// 统一请求方法。Strapi 控制器已强制 publicationState=live，无需再带该参数。
async function strapiGet<T>(path: string): Promise<T> {
  if (!STRAPI_URL) {
    throw new Error(
      "NEXT_PUBLIC_STRAPI_URL 未配置。请在 .env 中设置 Strapi Cloud 地址后重试。"
    );
  }
  const url = `${STRAPI_URL}/api${path}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    // 服务端渲染时关闭缓存，保证题目变化实时生效
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Strapi 请求失败 ${url}: HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

// 获取全部题目（已发布）
export async function fetchQuestions(): Promise<Question[]> {
  const json = await strapiGet<StrapiListResponse<Question>>("/questions?sort=id:asc");
  return Array.isArray(json.data) ? json.data : [];
}

// 按 ID 获取单题
export async function fetchQuestion(id: string | number): Promise<Question | null> {
  const json = await strapiGet<StrapiItemResponse<Question>>(`/questions/${id}`);
  return json.data || null;
}

// 把 Strapi 媒体字段统一为可直接使用的图片 URL
export function mediaUrl(media: { url?: string } | string | null | undefined): string {
  if (!media) return "";
  const raw = typeof media === "string" ? media : media.url || "";
  if (!raw) return "";
  return /^https?:\/\//i.test(raw) ? raw : `${STRAPI_URL}${raw}`;
}
