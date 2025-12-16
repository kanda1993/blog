#!/usr/bin/env bun
/**
 * Claude Code の JSONL ログファイルを Markdown に変換するCLIツール
 *
 * 使用方法:
 *   bun run convert-log <input.jsonl> <output_dir>
 *   bun run convert-log .ai_agent_logs/claude/20251214_144120.jsonl content/posts/2025/12/14/001
 */

import fs from "node:fs";
import path from "node:path";

interface ContentBlock {
  type: "text" | "thinking";
  text?: string;
  thinking?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string | ContentBlock[];
}

interface LogEntry {
  type: "user" | "assistant" | "summary" | "file-history-snapshot";
  message?: Message;
  uuid?: string;
  timestamp?: string;
}

function parseJsonl(filePath: string): LogEntry[] {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.trim().split("\n");
  const entries: LogEntry[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line) as LogEntry;
      entries.push(entry);
    } catch {
      console.warn("Failed to parse line:", line.slice(0, 100));
    }
  }

  return entries;
}

function extractTextContent(content: string | ContentBlock[]): string {
  if (typeof content === "string") {
    return content;
  }

  // ContentBlock[] の場合、text タイプのみを抽出（thinking は除外）
  return content
    .filter(
      (block): block is ContentBlock & { type: "text"; text: string } =>
        block.type === "text" && typeof block.text === "string"
    )
    .map((block) => block.text)
    .join("\n\n");
}

function formatUserMessage(text: string): string {
  // 複数行のユーザー発言を引用ブロックにする
  const formattedLines = text
    .split("\n")
    .map((line, index) => {
      if (index === 0) {
        return `> **User:** ${line}`;
      }
      return `> ${line}`;
    })
    .join("\n");
  return formattedLines;
}

function convertToMarkdown(entries: LogEntry[]): string {
  const lines: string[] = [];
  lines.push("# AI会話ログ");
  lines.push("");

  for (const entry of entries) {
    // user または assistant タイプのみ処理
    if (entry.type !== "user" && entry.type !== "assistant") continue;
    if (!entry.message) continue;

    const { role, content } = entry.message;
    const text = extractTextContent(content);

    // 空のメッセージはスキップ
    if (!text.trim()) continue;

    if (role === "user") {
      // Userの発言は引用ブロックで表示
      lines.push(formatUserMessage(text));
    } else {
      // Assistantの発言は通常のテキストとして表示
      lines.push(text);
    }
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  // 最後の区切り線を削除
  if (lines[lines.length - 1] === "" && lines[lines.length - 2] === "---") {
    lines.pop();
    lines.pop();
  }

  return lines.join("\n");
}

function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error("Usage: bun run convert-log <input.jsonl> <output_dir>");
    console.error(
      "Example: bun run convert-log .ai_agent_logs/claude/20251214_144120.jsonl content/posts/2025/12/14/001"
    );
    process.exit(1);
  }

  const [inputFile, outputDir] = args;
  const outputPath = path.join(outputDir, "log.md");

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file not found: ${inputFile}`);
    process.exit(1);
  }

  if (!fs.existsSync(outputDir)) {
    console.error(`Error: Output directory not found: ${outputDir}`);
    process.exit(1);
  }

  const entries = parseJsonl(inputFile);
  const conversationEntries = entries.filter((e) => e.type === "user" || e.type === "assistant");

  if (conversationEntries.length === 0) {
    console.error("Error: No conversation entries found in the log file");
    process.exit(1);
  }

  const markdown = convertToMarkdown(entries);

  fs.writeFileSync(outputPath, markdown, "utf8");
  console.log(`Converted ${conversationEntries.length} messages to ${outputPath}`);
}

main();
