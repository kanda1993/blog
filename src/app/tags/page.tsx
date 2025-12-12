import Link from "next/link";

import { getAllTags } from "@/lib/posts";
import { getTagSlug } from "@/lib/slugs";

export const metadata = {
  title: "タグ一覧 | Peak&Code",
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-text-primary">タグ一覧</h1>

      {tags.length === 0 ? (
        <p className="text-text-secondary">タグがありません。</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map(({ tag }) => (
            <Link
              key={tag}
              href={`/tags/${getTagSlug(tag)}`}
              className="rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-400 transition-colors hover:bg-blue-500/20"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
