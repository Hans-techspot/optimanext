import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { Terminal as XTerm } from '@xterm/xterm';
import { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { Theme } from '@/lib/stores/theme';
import { createScopedLogger } from '@/utils/logger';
import { getTerminalTheme } from './theme';

const logger = createScopedLogger('Terminal');

export interface TerminalRef {
  reloadStyles: () => void;
}

export interface TerminalProps {
  className?: string;
  theme: Theme;
  readonly?: boolean;
  onTerminalReady?: (terminal: XTerm) => void;
  onTerminalResize?: (cols: number, rows: number) => void;
}

export const Terminal = memo(
  forwardRef<TerminalRef, TerminalProps>(({ className, theme, readonly, onTerminalReady, onTerminalResize }, ref) => {
    const terminalElementRef = useRef<HTMLDivElement>(null);
    const [term, setTerm] = useState<XTerm | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const webLinksAddonRef = useRef<WebLinksAddon | null>(null);
    const [showTerminal, setShowTerminal] = useState<boolean>(() => {
      const stored = localStorage.getItem('showTerminal');
      return stored !== null ? stored === 'true' : true;
    });

    useEffect(() => {
      localStorage.setItem('showTerminal', String(showTerminal));
    }, [showTerminal]);

    useEffect(() => {
      const terminal = new XTerm({
        cursorBlink: true,
        convertEol: true,
        disableStdin: readonly,
        theme: getTerminalTheme(readonly ? { cursor: '#00000000' } : {}),
        fontSize: 12,
        fontFamily: 'Menlo, courier-new, courier, monospace',
      });
      const fitAddon = new FitAddon();
      const webLinksAddon = new WebLinksAddon();

      fitAddonRef.current = fitAddon;
      webLinksAddonRef.current = webLinksAddon;

      terminal.loadAddon(fitAddon);
      terminal.loadAddon(webLinksAddon);

      setTerm(terminal);

      return () => {
        if (terminal) {
          terminal.dispose();
        }
      };
    }, []);

    useEffect(() => {
      const element = terminalElementRef.current;
      if (term && element) {
        term.open(element);
        setTimeout(() => {
          fitAddonRef.current?.fit();
          onTerminalResize?.(term.cols, term.rows);
        }, 50);

        const resizeObserver = new ResizeObserver(() => {
          fitAddonRef.current?.fit();
          onTerminalResize?.(term.cols, term.rows);
        });

        resizeObserver.observe(element);

        logger.info('Attach terminal');

        onTerminalReady?.(term);

        return () => {
          resizeObserver.disconnect();
        };
      }
    }, [term]);

    useEffect(() => {
      if (term) {
        term.options.theme = getTerminalTheme(readonly ? { cursor: '#00000000' } : {});
        term.options.disableStdin = readonly;
      }
    }, [theme, readonly, term]);

    useImperativeHandle(ref, () => {
      return {
        reloadStyles: () => {
          if (term) {
            term.options.theme = getTerminalTheme(readonly ? { cursor: '#00000000' } : {});
          } else {
            logger.warn('Terminal instance not found');
          }
        },
      };
    }, [readonly, term]);

    return (
      <div className="w-full border-t border-gray-700 bg-black">
        <button
          onClick={() => setShowTerminal((prev) => !prev)}
          className="text-white text-sm px-4 py-2 bg-gray-800 hover:bg-gray-700 border-b border-gray-600 w-full text-left"
        >
          {showTerminal ? 'Hide Terminal' : 'Show Terminal'}
        </button>

        <div
          className={`transition-all duration-300 overflow-hidden ${
            showTerminal ? 'h-[300px]' : 'h-0'
          }`}
        >
          <div className={className} ref={terminalElementRef} />
        </div>
      </div>
    );
  })
);
