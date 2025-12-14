import Link from "next/link";

interface AiLogLinkProps {
  year: string;
  month: string;
  day: string;
  slug: string;
}

export function AiLogLink({ year, month, day, slug }: AiLogLinkProps) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-bold text-text-primary">AI会話ログ</h2>
      <Link
        href={`/posts/${year}/${month}/${day}/${slug}/log`}
        className="flex items-center gap-2 text-sm text-blue-500 hover:underline"
      >
        <span>会話ログを見る</span>
        <span>&rarr;</span>
      </Link>
    </div>
  );
}
