/**
 * タグの日本語名 → 英語スラッグのマッピング
 * 英語のタグは定義不要（そのまま小文字化して使用）
 */
export const TAG_SLUGS: Record<string, string> = {
  プログラミング: "programming",
  日記: "diary",
  登山: "climbing",
};

/**
 * カテゴリの日本語名 → 英語スラッグのマッピング
 */
export const CATEGORY_SLUGS: Record<string, string> = {
  日記: "diary",
  技術: "tech",
  登山: "climbing",
  未分類: "uncategorized",
};

/**
 * タグ名からスラッグを取得（マッピングがなければ小文字化して返す）
 */
export function getTagSlug(tagName: string): string {
  return TAG_SLUGS[tagName] ?? tagName.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "");
}

/**
 * スラッグからタグ名を取得
 * マッピングにあれば日本語名を返し、なければスラッグをそのまま返す
 */
export function getTagName(slug: string): string {
  // マッピングから逆引き
  const entry = Object.entries(TAG_SLUGS).find(([, s]) => s === slug);
  if (entry) return entry[0];

  // マッピングにない場合はスラッグをそのまま返す（英語タグ用）
  return slug;
}

/**
 * カテゴリ名からスラッグを取得（マッピングがなければ小文字化して返す）
 */
export function getCategorySlug(categoryName: string): string {
  return CATEGORY_SLUGS[categoryName] ?? categoryName.toLowerCase().replace(/\s+/g, "-");
}

/**
 * スラッグからカテゴリ名を取得
 * マッピングにあれば日本語名を返し、なければスラッグをそのまま返す
 */
export function getCategoryName(slug: string): string {
  // マッピングから逆引き
  const entry = Object.entries(CATEGORY_SLUGS).find(([, s]) => s === slug);
  if (entry) return entry[0];

  // マッピングにない場合はスラッグをそのまま返す
  return slug;
}
