"use client";
import { memo, useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';
import { cn } from '@/lib/utils';

interface ShellCodeBlockProps {
  classsName?: string;
  code: string;
}

const highlighterOptions = {
  langs: ['shell'],
  themes: ['light-plus', 'dark-plus'],
};

export const ShellCodeBlock = memo(({ classsName, code }: ShellCodeBlockProps) => {
  const [highlightedCode, setHighlightedCode] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function highlight() {
      const html = await codeToHtml(code, {
        lang: 'shell',
        theme: "laserwave",
      });
      setHighlightedCode(html);
    }

    highlight();
  }, [code]);

  return (
    <div
      className={cn('text-xs', classsName)}
      dangerouslySetInnerHTML={{ __html: highlightedCode ?? '' }}
    />
  );
});