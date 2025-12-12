"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 初期状態をlocalStorageまたはシステム設定から取得（クライアントサイドでのみ実行）
    const stored = localStorage.getItem("theme");
    const shouldBeDark =
      stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (shouldBeDark) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR hydration時にクライアント側でテーマを同期するため必要
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card-background">
      <div className="px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xl font-bold text-text-primary hover:opacity-80"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- basePathの関係でnext/imageが使えないため */}
          <img
            src="/blog/header-icon.png"
            alt="Peak&Code"
            width={28}
            height={28}
            className="rounded"
          />
          Peak&Code
        </Link>
      </div>
      <div className="px-4 sm:px-6">
        <button
          onClick={toggleDarkMode}
          className="rounded-full p-2 text-text-secondary hover:bg-content-background"
          aria-label={isDark ? "ライトモードに切り替え" : "ダークモードに切り替え"}
        >
          {isDark ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
}
