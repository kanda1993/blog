import Link from "next/link";
import { notFound } from "next/navigation";

import { MermaidRenderer } from "@/components/MermaidRenderer";
import { TableOfContents } from "@/components/TableOfContents";
import { getAllPostPaths, getPostBySlug } from "@/lib/posts";
import { getCategorySlug, getTagSlug } from "@/lib/slugs";

interface PostPageProps {
  params: Promise<{
    year: string;
    month: string;
    day: string;
    slug: string;
  }>;
}

// Static Generation 用のパス生成
export function generateStaticParams() {
  return getAllPostPaths();
}

export async function generateMetadata({ params }: PostPageProps) {
  const { year, month, day, slug } = await params;
  const post = await getPostBySlug(year, month, day, slug);

  if (!post) {
    return { title: "Not Found" };
  }

  return {
    title: `${post.frontmatter.title} | Peak&Code`,
    description: post.frontmatter.title,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { year, month, day, slug } = await params;
  const post = await getPostBySlug(year, month, day, slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-500 hover:underline">
            &larr; 記事一覧に戻る
          </Link>
        </div>

        <div className="lg:flex lg:gap-6">
          {/* メインコンテンツ */}
          <article className="min-w-0 flex-1 rounded-lg bg-card-background p-6 shadow-sm lg:p-8">
            <header className="mb-8">
              <h1 className="mb-4 text-3xl font-bold text-text-primary">
                {post.frontmatter.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                <time dateTime={post.frontmatter.date}>
                  {year}/{month}/{day}
                </time>
                <Link
                  href={`/categories/${getCategorySlug(post.frontmatter.category)}`}
                  className="rounded bg-content-background px-2 py-1 transition-colors hover:bg-blue-500 hover:text-white"
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
            </header>

            {post.frontmatter.coverImage && (
              <div className="mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element -- カバー画像は外部URLの可能性があるためimg要素を使用 */}
                <img
                  src={post.frontmatter.coverImage}
                  alt={post.frontmatter.title}
                  className="w-full rounded-lg"
                />
              </div>
            )}

            <div
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: post.htmlContent ?? "" }}
            />
            <MermaidRenderer />
          </article>

          {/* サイドバー（目次） - PC のみ表示 */}
          {post.toc && post.toc.length > 0 && (
            <aside className="hidden w-64 flex-shrink-0 lg:block">
              <div className="sticky top-8 rounded-lg bg-card-background p-4 shadow-sm">
                <TableOfContents items={post.toc} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
