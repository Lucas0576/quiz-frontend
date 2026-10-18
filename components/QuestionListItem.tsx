import Link from "next/link";
import type { Question } from "@/lib/types";
import { mediaUrl } from "@/lib/strapi";

export function QuestionListItem({ question }: { question: Question }) {
  const cover = mediaUrl(question.coverImage);
  return (
    <li>
      <Link
        href={`/quiz/${question.id}`}
        className="group block h-full rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand hover:shadow-md"
      >
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            className="mb-3 h-32 w-full rounded-lg object-cover bg-slate-100"
          />
        )}
        <div className="flex items-center gap-2 mb-1">
          {question.category && (
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600">
              {question.category}
            </span>
          )}
          {question.locale && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
              {question.locale === "zh" ? "中文" : "English"}
            </span>
          )}
        </div>
        <h3 className="font-medium text-slate-800 group-hover:text-brand line-clamp-2">
          {question.title}
        </h3>
        <p className="mt-2 text-xs text-slate-400">点击开始答题 →</p>
      </Link>
    </li>
  );
}
