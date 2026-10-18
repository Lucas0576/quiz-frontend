import { fetchQuestions, mediaUrl } from "@/lib/strapi";
import type { Question } from "@/lib/types";
import { QuestionListItem } from "@/components/QuestionListItem";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let questions: Question[] = [];
  let error: string | null = null;

  try {
    questions = await fetchQuestions();
  } catch (e) {
    error = e instanceof Error ? e.message : "加载题库失败";
  }

  return (
    <div>
      <section className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">全部题目</h1>
        <p className="mt-2 text-sm text-slate-500">
          点击任一题目开始答题，提交后可查看正确答案与解析。
        </p>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!error && questions.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          题库为空，请先在 Strapi Cloud 管理后台录入题目。
        </div>
      )}

      {questions.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {questions.map((q) => (
            <QuestionListItem key={q.id} question={q} />
          ))}
        </ul>
      )}
    </div>
  );
}
