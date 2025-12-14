import Link from "next/link";
import { notFound } from "next/navigation";

import { MermaidRenderer } from "@/components/MermaidRenderer";
import { TableOfContents } from "@/components/TableOfContents";
import { getAiLog, getAllPostPaths, getPostBySlug, hasAiLog } from "@/lib/posts";

interface LogPageProps {
  params: Promise<{
    year: string;
    month: string;
    day: string;
    slug: string;
  }>;
}

// Static Generation 用のパス生成（log.md が存在する記事のみ）
export function generateStaticParams() {
  const posts = getAllPostPaths();
  return posts.filter(({ year, month, day, slug }) => hasAiLog(year, month, day, slug));
}

export async function generateMetadata({ params }: LogPageProps) {
  const { year, month, day, slug } = await params;
  const post = await getPostBySlug(year, month, day, slug);

  if (!post) {
    return { title: "Not Found" };
  }

  return {
    title: `AI会話ログ - ${post.frontmatter.title} | Peak&Code`,
    description: `${post.frontmatter.title}のAI会話ログ`,
  };
}

export default async function LogPage({ params }: LogPageProps) {
  const { year, month, day, slug } = await params;

  const [post, aiLog] = await Promise.all([
    getPostBySlug(year, month, day, slug),
    getAiLog(year, month, day, slug),
  ]);

  if (!post || !aiLog) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex gap-4">
          <Link href="/" className="text-blue-500 hover:underline">
            &larr; 記事一覧
          </Link>
          <Link
            href={`/posts/${year}/${month}/${day}/${slug}`}
            className="text-blue-500 hover:underline"
          >
            &larr; 記事に戻る
          </Link>
        </div>

        <div className="lg:flex lg:gap-6">
          <article className="min-w-0 flex-1 rounded-lg bg-card-background p-6 shadow-sm lg:p-8">
            <header className="mb-8">
              <div className="mb-2 text-sm text-text-secondary">AI会話ログ</div>
              <h1 className="mb-4 text-3xl font-bold text-text-primary">
                {post.frontmatter.title}
              </h1>
              <time dateTime={post.frontmatter.date} className="text-sm text-text-secondary">
                {year}/{month}/{day}
              </time>
            </header>

            <div
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: aiLog.htmlContent }}
            />
            <MermaidRenderer />
          </article>

          {aiLog.toc.length > 0 && (
            <aside className="hidden w-64 flex-shrink-0 lg:block">
              <div className="sticky top-8 rounded-lg bg-card-background p-4 shadow-sm">
                <TableOfContents items={aiLog.toc} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
