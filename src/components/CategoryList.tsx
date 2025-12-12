import Link from "next/link";

import { getAllCategories } from "@/lib/posts";
import { getCategorySlug } from "@/lib/slugs";

export function CategoryList() {
  const categories = getAllCategories();

  // 未分類は表示しない
  const visibleCategories = categories.filter(({ category }) => category !== "未分類");

  if (visibleCategories.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border bg-card-background p-4">
      <h3 className="mb-3 font-bold text-text-primary">カテゴリ</h3>
      <ul className="space-y-1">
        {visibleCategories.map(({ category, count }) => (
          <li key={category}>
            <Link
              href={`/categories/${getCategorySlug(category)}`}
              className="flex items-center justify-between rounded px-2 py-1 text-sm text-text-secondary transition-colors hover:bg-content-background hover:text-text-primary"
            >
              <span>{category}</span>
              <span className="text-xs text-text-muted">{count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
