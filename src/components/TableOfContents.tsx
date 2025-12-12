"use client";

import { useEffect, useState } from "react";

import type { TocItem } from "@/lib/posts";

interface TableOfContentsProps {
  items: TocItem[];
}

const HEADING_LEVEL_2 = 2;
const HEADING_LEVEL_3 = 3;

// スクロール検出用の定数
const SCROLL_OFFSET = 120;
const BOTTOM_THRESHOLD = 50;
const VERY_BOTTOM_THRESHOLD = 5;
const BOTTOM_DETECTION_RATIO = 0.3;

function getDotStyle(level: number, isActive: boolean): string {
  if (isActive) {
    // アクティブ時：リングで線と繋がって見える
    return "h-2 w-2 bg-blue-500 ring-4 ring-blue-500/20";
  }
  if (level === HEADING_LEVEL_2) {
    // h2: 薄い青ドット
    return "h-2 w-2 bg-blue-400/40";
  }
  if (level === HEADING_LEVEL_3) {
    // h3: さらに薄い青ドット
    return "h-1.5 w-1.5 bg-blue-400/30";
  }
  // h4以降: 小さいグレードット
  return "h-1.5 w-1.5 bg-text-muted/30";
}

function getTextStyle(level: number, isActive: boolean): string {
  if (isActive) {
    return "text-blue-500 font-semibold";
  }
  if (level === HEADING_LEVEL_2) {
    return "text-text-primary font-medium";
  }
  if (level === HEADING_LEVEL_3) {
    return "text-text-secondary";
  }
  return "text-text-muted";
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headingElements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingElements.length === 0) return;

    // 画面上部を通過した最後の見出しを見つける
    const findActiveHeading = () => {
      const { innerHeight: windowHeight, scrollY: scrollTop } = window;
      const { scrollHeight: documentHeight } = document.documentElement;

      // ページ末尾かどうか判定
      const isAtBottom = scrollTop + windowHeight >= documentHeight - BOTTOM_THRESHOLD;

      let activeHeading: HTMLElement | null = null;

      // 完全に末尾に到達したかどうか（スクロールできない状態）
      const isAtVeryBottom = scrollTop + windowHeight >= documentHeight - VERY_BOTTOM_THRESHOLD;

      if (isAtVeryBottom) {
        // 完全に末尾の場合：最後の見出しをハイライト
        activeHeading = headingElements.at(-1) ?? null;
      } else if (isAtBottom) {
        // 末尾付近の場合：検出ラインを下げて、上部30%に入った見出しをアクティブに
        const bottomOffset = windowHeight * BOTTOM_DETECTION_RATIO;
        for (const element of headingElements) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= bottomOffset) {
            activeHeading = element;
          }
        }
      } else {
        // 通常時：上部を通過した最後の見出しを探す
        for (const element of headingElements) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= SCROLL_OFFSET) {
            activeHeading = element;
          }
        }
      }

      // 見つかった場合はその見出しを、見つからない場合は最初の見出しをアクティブに
      if (activeHeading) {
        setActiveId(activeHeading.id);
      } else {
        const [firstHeading] = headingElements;
        // headingElements は空でないことが保証されているため firstHeading は必ず存在
        setActiveId(firstHeading.id);
      }
    };

    // スクロール時に実行
    const handleScroll = () => {
      findActiveHeading();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // 初期状態でも実行
    findActiveHeading();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="py-4">
      <h2 className="mb-3 text-sm font-bold text-text-primary">目次</h2>
      <ul className="relative space-y-1.5">
        {/* 縦線 - ドットコンテナの中央に配置 */}
        <div className="absolute bottom-1 left-[5px] top-1 w-px bg-border" />
        {items.map((item, index) => {
          const isActive = activeId === item.id;
          return (
            <li key={`${item.id}-${String(index)}`} className="relative flex items-center gap-2">
              {/* ドットコンテナ - 白背景で線を隠し、隙間を作る */}
              <span className="relative z-10 flex h-3 w-3 flex-shrink-0 items-center justify-center bg-card-background">
                <span
                  className={`rounded-full transition-all ${getDotStyle(item.level, isActive)}`}
                />
              </span>
              <a
                href={`#${item.id}`}
                className={`text-sm leading-relaxed transition-colors hover:text-blue-500 ${getTextStyle(item.level, isActive)}`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
