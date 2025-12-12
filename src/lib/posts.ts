import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { getCategorySlug, getTagSlug } from "./slugs";

// 目次アイテム型定義
export interface TocItem {
  id: string;
  text: string;
  level: number;
}

// 記事のフロントマター型定義
export interface PostFrontmatter {
  title: string;
  date: string;
  tags: string[];
  category: string;
  coverImage?: string;
}

// 記事データ型定義
export interface Post {
  slug: string;
  year: string;
  month: string;
  day: string;
  frontmatter: PostFrontmatter;
  content: string;
  htmlContent?: string;
  toc?: TocItem[];
}

// 記事一覧用の簡易型
export interface PostListItem {
  slug: string;
  year: string;
  month: string;
  day: string;
  frontmatter: PostFrontmatter;
}

const postsDirectory = path.join(process.cwd(), "content/posts");

/**
 * オブジェクトかどうかを判定する型ガード
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * 文字列配列かどうかを判定する型ガード
 */
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

/**
 * Frontmatter のバリデーション
 */
function validateFrontmatter(data: unknown): PostFrontmatter {
  if (!isRecord(data)) {
    throw new Error("Invalid frontmatter: expected object");
  }

  return {
    title: typeof data.title === "string" ? data.title : "Untitled",
    date: typeof data.date === "string" ? data.date : "",
    tags: isStringArray(data.tags) ? data.tags : [],
    category: typeof data.category === "string" ? data.category : "未分類",
    coverImage: typeof data.coverImage === "string" ? data.coverImage : undefined,
  };
}

/**
 * Markdown から見出しを抽出して目次を生成
 */
export function extractToc(markdown: string): TocItem[] {
  const headingRegex = /^(?<hashes>#{1,6})\s+(?<heading>.+)$/gm;
  const toc: TocItem[] = [];

  for (const match of markdown.matchAll(headingRegex)) {
    const { hashes, heading } = match.groups ?? {};
    if (!hashes || !heading) continue;

    const { length: level } = hashes;
    const text = heading.trim();
    // rehype-slug と同じ方式で ID を生成
    const id = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\p{L}\p{N}-]/gu, "");

    toc.push({ id, text, level });
  }

  return toc;
}

/**
 * Markdown を HTML に変換
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}

/**
 * 全記事を取得（日付降順）
 */
export function getAllPosts(): PostListItem[] {
  const posts: PostListItem[] = [];

  // content/posts ディレクトリが存在しない場合は空配列を返す
  if (!fs.existsSync(postsDirectory)) {
    return posts;
  }

  // year ディレクトリを走査
  const years = fs.readdirSync(postsDirectory);

  for (const year of years) {
    const yearPath = path.join(postsDirectory, year);
    if (!fs.statSync(yearPath).isDirectory()) continue;

    // month ディレクトリを走査
    const months = fs.readdirSync(yearPath);

    for (const month of months) {
      const monthPath = path.join(yearPath, month);
      if (!fs.statSync(monthPath).isDirectory()) continue;

      // day ディレクトリを走査
      const days = fs.readdirSync(monthPath);

      for (const day of days) {
        const dayPath = path.join(monthPath, day);
        if (!fs.statSync(dayPath).isDirectory()) continue;

        // Markdown ファイルを走査
        const files = fs.readdirSync(dayPath).filter((file) => file.endsWith(".md"));

        for (const file of files) {
          const filePath = path.join(dayPath, file);
          const fileContents = fs.readFileSync(filePath, "utf8");
          const { data } = matter(fileContents);
          const slug = file.replace(/\.md$/, "");

          posts.push({
            slug,
            year,
            month,
            day,
            frontmatter: validateFrontmatter(data),
          });
        }
      }
    }
  }

  // 日付降順でソート
  return posts.sort((a, b) => {
    const dateA = `${a.year}${a.month}${a.day}${a.slug}`;
    const dateB = `${b.year}${b.month}${b.day}${b.slug}`;
    return dateB.localeCompare(dateA);
  });
}

/**
 * 特定の記事を取得
 */
export async function getPostBySlug(
  year: string,
  month: string,
  day: string,
  slug: string
): Promise<Post | null> {
  const filePath = path.join(postsDirectory, year, month, day, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const htmlContent = await markdownToHtml(content);
  const toc = extractToc(content);

  return {
    slug,
    year,
    month,
    day,
    frontmatter: validateFrontmatter(data),
    content,
    htmlContent,
    toc,
  };
}

/**
 * 全記事のパスを取得（Static Generation 用）
 */
export function getAllPostPaths(): Array<{
  year: string;
  month: string;
  day: string;
  slug: string;
}> {
  const posts = getAllPosts();
  return posts.map((post) => ({
    year: post.year,
    month: post.month,
    day: post.day,
    slug: post.slug,
  }));
}

/**
 * 全タグを取得（記事数付き）
 */
export function getAllTags(): Array<{ tag: string; count: number }> {
  const posts = getAllPosts();
  const tagCounts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.frontmatter.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * 全カテゴリを取得（記事数付き）
 */
export function getAllCategories(): Array<{ category: string; count: number }> {
  const posts = getAllPosts();
  const categoryCounts = new Map<string, number>();

  for (const post of posts) {
    const { category } = post.frontmatter;
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
  }

  return Array.from(categoryCounts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * タグ（スラッグまたはタグ名）で記事をフィルタリング
 */
export function getPostsByTag(tagOrSlug: string): PostListItem[] {
  const posts = getAllPosts();
  // まず元のタグ名を取得
  const originalTag = getOriginalTagName(tagOrSlug);
  // 元のタグ名で完全一致検索
  return posts.filter((post) => post.frontmatter.tags.includes(originalTag));
}

/**
 * スラッグから元のタグ名を取得（記事から検索）
 */
export function getOriginalTagName(slug: string): string {
  const posts = getAllPosts();
  const lowerSlug = slug.toLowerCase();

  for (const post of posts) {
    for (const tag of post.frontmatter.tags) {
      // スラッグ化して比較
      const tagSlug = getTagSlug(tag);
      if (tagSlug === lowerSlug) {
        return tag;
      }
    }
  }

  return slug;
}

/**
 * カテゴリで記事をフィルタリング
 */
export function getPostsByCategory(category: string): PostListItem[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.frontmatter.category === category);
}

/**
 * 全タグのパスを取得（Static Generation 用）
 */
export function getAllTagPaths(): Array<{ tag: string }> {
  const tags = getAllTags();
  return tags.map(({ tag }) => ({ tag: getTagSlug(tag) }));
}

/**
 * 全カテゴリのパスを取得（Static Generation 用）
 */
export function getAllCategoryPaths(): Array<{ category: string }> {
  const categories = getAllCategories();
  return categories.map(({ category }) => ({ category: getCategorySlug(category) }));
}
