import Link from "next/link";

import { getCategorySlug, getTagSlug } from "@/lib/slugs";

interface PostHeaderProps {
  title: string;
  date: string;
  year: string;
  month: string;
  day: string;
  category: string;
  tags: string[];
  coverImage?: string;
}

export function PostHeader({
  title,
  date,
  year,
  month,
  day,
  category,
  tags,
  coverImage,
}: PostHeaderProps) {
  return (
    <>
      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-text-primary">{title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
          <time dateTime={date}>
            {year}/{month}/{day}
          </time>
          <Link
            href={`/categories/${getCategorySlug(category)}`}
            className="rounded bg-content-background px-2 py-1 transition-colors hover:bg-blue-500 hover:text-white"
          >
            {category}
          </Link>
        </div>
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${getTagSlug(tag)}`}
                className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400 transition-colors hover:bg-blue-500/20"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {coverImage && (
        <div className="mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element -- カバー画像は外部URLの可能性があるためimg要素を使用 */}
          <img src={coverImage} alt={title} className="w-full rounded-lg" />
        </div>
      )}
    </>
  );
}
