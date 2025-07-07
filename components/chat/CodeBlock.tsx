"use client"
import { memo, useEffect, useState } from 'react';
import { bundledLanguages, codeToHtml, isSpecialLang, type BundledLanguage, type SpecialLanguage } from 'shiki';
import { cn } from '@/lib/utils';
import { createScopedLogger } from '@/utils/logger';

import { ClipboardText } from '@phosphor-icons/react';

const logger = createScopedLogger('CodeBlock');

interface CodeBlockProps {
  className?: string;
  code: string;
  language?: BundledLanguage | SpecialLanguage;
  theme?: 'light-plus' | 'dark-plus';
  disableCopy?: boolean;
}

export const CodeBlock = memo(
  ({ className, code, language = 'plaintext', theme = 'dark-plus', disableCopy = false }: CodeBlockProps) => {
    const [html, setHTML] = useState<string | undefined>(undefined);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
      if (copied) {
        return;
      }

      navigator.clipboard.writeText(code);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    };

    useEffect(() => {
         if (language && !isSpecialLang(language) && !(language in bundledLanguages)) {
              logger.warn(`Unsupported language '${language}'`);
            }
      
            logger.trace(`Language = ${language}`);
      
            const processCode = () => {
              codeToHtml(code, { lang: language, theme })
                .then((html) => {
                  setHTML(html);
                })
                .catch((error) => {
                  logger.error('Error processing code:', error);
                });
            };
      
            processCode();
          }, [code, language, theme]);

    return (
      <div className={cn('relative group text-left', className)}>
        <div
          className={cn(
            'bg-white absolute top-[10px] right-[10px] rounded-md z-10 text-lg flex items-center justify-center opacity-0 group-hover:opacity-100',
            {
              'rounded-l-0 opacity-100': copied,
            },
          )}
        >
          {!disableCopy && (
            <button
              className={cn(
                'flex items-center bg-transparent p-[6px] justify-center before:bg-white before:rounded-l-md before:text-gray-500 before:border-r before:border-gray-300',
                {
                  'before:opacity-0': !copied,
                  'before:opacity-100': copied,
                },
              )}
              title="Copy Code"
              onClick={() => copyToClipboard()}
            >
              <ClipboardText/>
            </button>
          )}
        </div>
        <div dangerouslySetInnerHTML={{ __html: html ?? '' }}></div>
      </div>
    );
  },
);
