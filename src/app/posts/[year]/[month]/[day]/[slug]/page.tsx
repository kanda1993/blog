import Link from "next/link";
import { notFound } from "next/navigation";

import { AiLogLink } from "@/components/AiLogLink";
import { MermaidRenderer } from "@/components/MermaidRenderer";
import { PostHeader } from "@/components/PostHeader";
import { TableOfContents } from "@/components/TableOfContents";
import { getAllPostPaths, getPostBySlug, hasAiLog } from "@/lib/posts";

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

  const showAiLog = hasAiLog(year, month, day, slug);
  const hasToc = post.toc && post.toc.length > 0;
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- boolean の論理和には || が適切
  const showSidebar = hasToc || showAiLog;

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
            <PostHeader
              title={post.frontmatter.title}
              date={post.frontmatter.date}
              year={year}
              month={month}
              day={day}
              category={post.frontmatter.category}
              tags={post.frontmatter.tags}
              coverImage={post.frontmatter.coverImage}
            />

            <div
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: post.htmlContent ?? "" }}
            />
            <MermaidRenderer />

            {/* AI会話ログ - モバイル用（記事の下に表示） */}
            {showAiLog && (
              <div className="mt-8 rounded-lg bg-card-background p-4 shadow-sm lg:hidden">
                <AiLogLink year={year} month={month} day={day} slug={slug} />
              </div>
            )}
          </article>

          {/* サイドバー（目次・AI会話ログ） - PC のみ表示 */}
          {showSidebar && (
            <aside className="hidden w-64 flex-shrink-0 lg:block">
              <div className="sticky top-8 space-y-4">
                {hasToc && (
                  <div className="rounded-lg bg-card-background p-4 shadow-sm">
                    <TableOfContents items={post.toc} />
                  </div>
                )}
                {showAiLog && (
                  <div className="rounded-lg bg-card-background p-4 shadow-sm">
                    <AiLogLink year={year} month={month} day={day} slug={slug} />
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
