"use client";

import { useState } from "react";
import Link from "next/link";
import type { Question } from "@/lib/types";
import { mediaUrl } from "@/lib/strapi";

const OPTION_KEYS = ["A", "B", "C", "D"] as const;

export function QuestionCard({
  question,
  nextId,
}: {
  question: Question;
  nextId: number | null;
}) {
  const [selected, setSelected] = useState<Question["answer"] | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const cover = mediaUrl(question.coverImage);
  const isCorrect = submitted && selected === question.answer;
  const options: { key: (typeof OPTION_KEYS)[number]; label: string }[] = [
    { key: "A", label: question.optionA },
    { key: "B", label: question.optionB },
    { key: "C", label: question.optionC },
    { key: "D", label: question.optionD },
  ];

  function handleSubmit() {
    if (!selected) return;
    setSubmitted(true);
  }

  function handleReset() {
    setSelected(null);
    setSubmitted(false);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt=""
          className="mb-5 w-full rounded-xl object-cover bg-slate-100 max-h-64"
        />
      )}

      <div className="mb-4 flex items-center gap-2">
        {question.category && (
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs text-indigo-600">
            {question.category}
          </span>
        )}
        <span className="text-xs text-slate-400">第 {question.id} 题</span>
      </div>

      <h1 className="text-lg sm:text-xl font-semibold text-slate-900 leading-relaxed mb-5">
        {question.title}
      </h1>

      <div className="space-y-3">
        {options.map((opt) => {
          const isSelected = selected === opt.key;
          const isAnswer = submitted && opt.key === question.answer;
          const isWrongPick = submitted && isSelected && opt.key !== question.answer;

          let stateClass =
            "border-slate-200 hover:border-brand hover:bg-indigo-50/40 cursor-pointer";
          if (submitted) {
            if (isAnswer) stateClass = "border-green-500 bg-green-50";
            else if (isWrongPick) stateClass = "border-red-500 bg-red-50";
            else stateClass = "border-slate-200 opacity-60";
          } else if (isSelected) {
            stateClass = "border-brand bg-indigo-50";
          }

          return (
            <button
              key={opt.key}
              type="button"
              disabled={submitted}
              onClick={() => setSelected(opt.key)}
              className={`w-full flex items-start gap-3 rounded-xl border p-3 sm:p-4 text-left transition ${stateClass}`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                  submitted && isAnswer
                    ? "border-green-500 bg-green-500 text-white"
                    : submitted && isWrongPick
                      ? "border-red-500 bg-red-500 text-white"
                      : isSelected
                        ? "border-brand bg-brand text-white"
                        : "border-slate-300 text-slate-500"
                }`}
              >
                {opt.key}
              </span>
              <span className="text-sm sm:text-base text-slate-700 pt-0.5">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selected}
          className="mt-6 w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          提交答案
        </button>
      ) : (
        <div className="mt-6 space-y-4">
          <div
            className={`rounded-xl p-4 ${
              isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}
          >
            <p className="font-semibold">
              {isCorrect ? "✓ 回答正确" : `✗ 回答错误，正确答案是 ${question.answer}`}
            </p>
          </div>

          {question.explanation && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500 mb-1">解析</p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              重新作答
            </button>
            {nextId != null ? (
              <Link
                href={`/quiz/${nextId}`}
                className="flex-1 rounded-xl bg-brand px-4 py-3 text-center text-sm font-semibold text-white hover:bg-brand-dark"
              >
                下一题 →
              </Link>
            ) : (
              <Link
                href="/"
                className="flex-1 rounded-xl bg-brand px-4 py-3 text-center text-sm font-semibold text-white hover:bg-brand-dark"
              >
                返回题库
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
