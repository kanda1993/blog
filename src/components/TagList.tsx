import Link from "next/link";

export function TagList() {
  return (
    <div className="rounded-lg border border-border bg-card-background p-4">
      <Link
        href="/tags"
        className="font-bold text-text-primary transition-colors hover:text-blue-400"
      >
        タグ一覧
      </Link>
    </div>
  );
}
