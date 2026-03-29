"use client";

import React from "react";
import LazyMarkdownRenderer from "@/components/LazyMarkdownRenderer";
import { sanitizeMarkdownDomProps } from "@/lib/runtime-helpers";

function flattenText(children: React.ReactNode): string {
  return Array.isArray(children)
    ? children.map((child) => flattenText(child)).join("")
    : typeof children === "string" || typeof children === "number"
      ? String(children)
      : children && typeof children === "object" && "props" in children
        ? flattenText((children as { props?: { children?: React.ReactNode } }).props?.children)
        : "";
}

export function GuideMarkdown({ content }: { content: string }) {
  return (
    <LazyMarkdownRenderer
      content={content}
      className="prose prose-lg max-w-none"
      components={{
        h1: () => null,
        h2: ({ children, ...props }: { children: React.ReactNode }) => {
          const title = flattenText(children);
          const id = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
          const safeProps = sanitizeMarkdownDomProps(props as Record<string, unknown>);

          return (
            <h2
              id={id}
              className="scroll-mt-28 text-theme-2xl font-theme-heading font-semibold text-primary mb-theme-md mt-theme-lg"
              {...safeProps}
            >
              {children}
            </h2>
          );
        },
      }}
    />
  );
}
