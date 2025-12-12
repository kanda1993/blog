export function Footer() {
  return (
    <footer className="border-t border-border bg-card-background">
      <div className="mx-auto max-w-4xl px-4 py-6 text-center text-sm text-text-secondary">
        <p>&copy; {new Date().getFullYear()} kanda</p>
        <p className="mt-1 text-xs text-text-muted">
          本サイトの内容は個人の見解であり、所属組織とは関係ありません。
        </p>
      </div>
    </footer>
  );
}
