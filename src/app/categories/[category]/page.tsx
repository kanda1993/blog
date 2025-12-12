import Link from "next/link";
import { notFound } from "next/navigation";

import { Sidebar } from "@/components";
import { getAllCategoryPaths, getPostsByCategory } from "@/lib/posts";
import { getCategoryName, getCategorySlug, getTagSlug } from "@/lib/slugs";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export function generateStaticParams() {
  return getAllCategoryPaths();
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const categoryName = getCategoryName(slug);

  return {
    title: `${categoryName} の記事一覧 | Peak&Code`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const categoryName = getCategoryName(slug);
  const posts = getPostsByCategory(categoryName);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* モバイル用ナビリンク */}
      <div className="mb-6 flex gap-2 lg:hidden">
        <a
          href="#about"
          className="rounded-full bg-content-background px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-blue-500/10 hover:text-blue-400"
        >
          About
        </a>
        <a
          href="#categories"
          className="rounded-full bg-content-background px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-blue-500/10 hover:text-blue-400"
        >
          カテゴリ
        </a>
        <Link
          href="/tags"
          className="rounded-full bg-content-background px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-blue-500/10 hover:text-blue-400"
        >
          タグ
        </Link>
      </div>

      <div className="lg:flex lg:gap-8">
        {/* メインコンテンツ */}
        <main className="min-w-0 flex-1">
          <h1 className="mb-6 text-xl font-bold text-text-primary">
            {categoryName}
            <span className="ml-2 text-base font-normal text-text-secondary">の記事一覧</span>
          </h1>

          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={`${post.year}/${post.month}/${post.day}/${post.slug}`}>
                <article className="rounded-lg border border-border bg-card-background p-6 shadow-sm transition-shadow hover:shadow-md">
                  <Link href={`/posts/${post.year}/${post.month}/${post.day}/${post.slug}`}>
                    <h2 className="mb-2 text-xl font-semibold text-text-primary hover:text-blue-500">
                      {post.frontmatter.title}
                    </h2>
                  </Link>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                    <time dateTime={post.frontmatter.date}>
                      {post.year}/{post.month}/{post.day}
                    </time>
                    <Link
                      href={`/categories/${getCategorySlug(post.frontmatter.category)}`}
                      className="rounded bg-blue-500 px-2 py-1 text-white transition-colors hover:bg-blue-600"
                    >
                      {post.frontmatter.category}
                    </Link>
                  </div>
                  {post.frontmatter.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.frontmatter.tags.map((tag) => (
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
                </article>
              </li>
            ))}
          </ul>
        </main>

        {/* サイドバー - PC のみ表示 */}
        <div className="hidden w-64 flex-shrink-0 lg:block">
          <div className="sticky top-8">
            <Sidebar />
          </div>
        </div>
      </div>

      {/* モバイル用サイドバー - ページ下部に表示 */}
      <div className="mt-12 lg:hidden">
        <Sidebar showIds />
      </div>
    </div>
  );
}
