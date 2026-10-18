// 题库题目类型（与 Strapi 扁平响应契约对齐）
export interface Question {
  id: number;
  title: string;
  coverImage?: { url: string } | null;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: "A" | "B" | "C" | "D";
  explanation?: string | null;
  locale?: "zh" | "en";
  category?: string | null;
}

// Strapi 列表响应：{ data: [...], meta: {...} }
export interface StrapiListResponse<T> {
  data: T[];
  meta: { pagination?: { page: number; pageSize: number; pageCount: number; total: number } };
}

// Strapi 单条响应：{ data: {...} }
export interface StrapiItemResponse<T> {
  data: T | null;
}
