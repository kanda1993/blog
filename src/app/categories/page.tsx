import Link from "next/link";

import { getAllCategories } from "@/lib/posts";
import { getCategorySlug } from "@/lib/slugs";

export const metadata = {
  title: "カテゴリ一覧 | Peak&Code",
};

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-text-primary">カテゴリ一覧</h1>

      {categories.length === 0 ? (
        <p className="text-text-secondary">カテゴリがありません。</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {categories.map(({ category }) => (
            <Link
              key={category}
              href={`/categories/${getCategorySlug(category)}`}
              className="rounded-lg border border-border bg-card-background px-4 py-2 text-text-primary transition-shadow hover:shadow-md"
            >
              {category}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
