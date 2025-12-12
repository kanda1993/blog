"use client";

import mermaid from "mermaid";
import { useEffect } from "react";

const MERMAID_ID_PREFIX = "mermaid-";

export function MermaidRenderer() {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      securityLevel: "loose",
      themeVariables: {
        background: "#f9fafb",
        primaryColor: "#e0e7ff",
        primaryTextColor: "#1f2937",
        primaryBorderColor: "#6366f1",
        lineColor: "#6b7280",
        secondaryColor: "#fef3c7",
        tertiaryColor: "#d1fae5",
      },
    });

    const renderMermaidDiagrams = async () => {
      const mermaidBlocks = document.querySelectorAll("code.language-mermaid");
      const blocks = Array.from(mermaidBlocks);

      const renderPromises = blocks.map(async (block, index) => {
        const { textContent: code } = block;
        if (!code) return;

        const { parentElement: container } = block;
        if (!container) return;

        try {
          const { svg } = await mermaid.render(`${MERMAID_ID_PREFIX}${String(index)}`, code);
          container.innerHTML = svg;
          container.classList.add("mermaid-diagram");
          container.classList.remove("hljs");
        } catch {
          // Mermaid render errors are silently ignored
        }
      });

      await Promise.all(renderPromises);
    };

    void renderMermaidDiagrams();
  }, []);

  return null;
}
