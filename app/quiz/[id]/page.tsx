import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchQuestion, fetchQuestions } from "@/lib/strapi";
import { QuestionCard } from "@/components/QuestionCard";

export const dynamic = "force-dynamic";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let question = null;
  let error: string | null = null;
  try {
    question = await fetchQuestion(id);
  } catch (e) {
    error = e instanceof Error ? e.message : "加载题目失败";
  }

  if (!question && !error) {
    notFound();
  }

  // 计算下一题 id，用于「下一题」跳转
  let nextId: number | null = null;
  if (question) {
    try {
      const all = await fetchQuestions();
      const idx = all.findIndex((q) => q.id === question!.id);
      if (idx >= 0 && idx < all.length - 1) {
        nextId = all[idx + 1].id;
      }
    } catch {
      // 忽略导航数据拉取失败
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-slate-500 hover:text-brand mb-4"
      >
        ← 返回题库
      </Link>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {question && (
        <QuestionCard
          question={question}
          nextId={nextId}
        />
      )}
    </div>
  );
}
