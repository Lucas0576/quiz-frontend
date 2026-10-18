import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-brand hover:text-brand-dark">
          题库中心
        </Link>
        <Link
          href="/"
          className="text-sm text-slate-500 hover:text-brand"
        >
          返回首页
        </Link>
      </div>
    </header>
  );
}
