import { useStore } from '@nanostores/react';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle, type ImperativePanelHandle } from 'react-resizable-panels';
import {
  CodeMirrorEditor,
  type EditorDocument,
  type EditorSettings,
  type OnChangeCallback as OnEditorChange,
  type OnSaveCallback as OnEditorSave,
  type OnScrollCallback as OnEditorScroll,
} from '@/components/editor/codemirror/CodeMirrorEditor';
import { PanelHeader } from '@/components/ui/PanelHeader';
import { PanelHeaderButton } from '@/components/ui/PanelHeaderButton';
import { shortcutEventEmitter } from '@/hooks';
import type { FileMap } from '@/lib/stores/files';
import { themeStore } from '@/lib/stores/theme';
import { workbenchStore } from '@/lib/stores/workbench';
import { WORK_DIR } from '@/utils/constants';
import { renderLogger } from '@/utils/logger';
import { isMobile } from '@/utils/mobile';
import { FileBreadcrumb } from './FileBreadcrumb';
import { FileTree } from './FileTree';
import React from 'react';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { CaretDown, ClockCounterClockwise, FloppyDisk, Plus, Terminal as TerminalIcon, TerminalWindow, TreeStructure } from '@phosphor-icons/react';
import { type TerminalRef } from './terminal/Terminal';

interface EditorPanelProps {
  files?: FileMap;
  unsavedFiles?: Set<string>;
  editorDocument?: EditorDocument;
  selectedFile?: string | undefined;
  isStreaming?: boolean;
  onEditorChange?: OnEditorChange;
  onEditorScroll?: OnEditorScroll;
  onFileSelect?: (value?: string) => void;
  onFileSave?: OnEditorSave;
  onFileReset?: () => void;
}

const MAX_TERMINALS = 3;
const DEFAULT_TERMINAL_SIZE = 25;
const DEFAULT_EDITOR_SIZE = 100 - DEFAULT_TERMINAL_SIZE;

const Terminal = dynamic(
  () =>
    import('./terminal/Terminal').then((mod) => ({ default: mod.Terminal })),
  {
    ssr: false,
  },
);

const editorSettings: EditorSettings = { tabSize: 2 };

export const EditorPanel = memo(
  ({
    files,
    unsavedFiles,
    editorDocument,
    selectedFile,
    isStreaming,
    onFileSelect,
    onEditorChange,
    onEditorScroll,
    onFileSave,
    onFileReset,
  }: EditorPanelProps) => {
    renderLogger.trace('EditorPanel');

    const theme = useStore(themeStore);
    const showTerminal = useStore(workbenchStore.showTerminal);

    const terminalRefs = useRef<Array<TerminalRef | null>>([]);
    const terminalPanelRef = useRef<ImperativePanelHandle>(null);
    const terminalToggledByShortcut = useRef(false);

    const [activeTerminal, setActiveTerminal] = useState(0);
    const [terminalCount, setTerminalCount] = useState(1);

    const activeFileSegments = useMemo(() => {
      if (!editorDocument) {
        return undefined;
      }

      return editorDocument.filePath.split('/');
    }, [editorDocument]);

    const activeFileUnsaved = useMemo(() => {
      return editorDocument !== undefined && unsavedFiles?.has(editorDocument.filePath);
    }, [editorDocument, unsavedFiles]);

    useEffect(() => {
      const unsubscribeFromEventEmitter = shortcutEventEmitter.on('toggleTerminal', () => {
        terminalToggledByShortcut.current = true;
      });

      const unsubscribeFromThemeStore = themeStore.subscribe(() => {
        for (const ref of Object.values(terminalRefs.current)) {
          ref?.reloadStyles();
        }
      });

      return () => {
        unsubscribeFromEventEmitter();
        unsubscribeFromThemeStore();
      };
    }, []);

    useEffect(() => {
      const { current: terminal } = terminalPanelRef;

      if (!terminal) {
        return;
      }

      const isCollapsed = terminal.isCollapsed();

      if (!showTerminal && !isCollapsed) {
        terminal.collapse();
      } else if (showTerminal && isCollapsed) {
        terminal.resize(DEFAULT_TERMINAL_SIZE);
      }

      terminalToggledByShortcut.current = false;
    }, [showTerminal]);

    const addTerminal = () => {
      if (terminalCount < MAX_TERMINALS) {
        setTerminalCount(terminalCount + 1);
        setActiveTerminal(terminalCount);
      }
    };

    return (
      <PanelGroup direction="vertical">
        <Panel defaultSize={showTerminal ? DEFAULT_EDITOR_SIZE : 100} minSize={20}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={20} minSize={10} collapsible>
              <div className="flex flex-col border-r h-full">
                <PanelHeader>
                  <TreeStructure/>
                  Files
                </PanelHeader>
                <FileTree
                  className="h-full"
                  files={files}
                  hideRoot
                  unsavedFiles={unsavedFiles}
                  rootFolder={WORK_DIR}
                  selectedFile={selectedFile}
                  onFileSelect={onFileSelect}
                />
              </div>
            </Panel>
            <PanelResizeHandle />
            <Panel className="flex flex-col" defaultSize={80} minSize={20}>
              <PanelHeader className="overflow-x-auto">
                {activeFileSegments?.length && (
                  <div className="flex items-center flex-1 text-sm">
                    <FileBreadcrumb pathSegments={activeFileSegments} files={files} onFileSelect={onFileSelect} />
                    {activeFileUnsaved && (
                      <div className="flex gap-1 ml-auto -mr-1.5">
                        <PanelHeaderButton onClick={onFileSave}>
                          <FloppyDisk />
                          Save
                        </PanelHeaderButton>
                        <PanelHeaderButton onClick={onFileReset}>
                          <ClockCounterClockwise />
                          Reset
                        </PanelHeaderButton>
                      </div>
                    )}
                  </div>
                )}
              </PanelHeader>
              <div className="h-full flex-1 overflow-hidden">
                <CodeMirrorEditor
                  theme={theme}
                  editable={!isStreaming && editorDocument !== undefined}
                  settings={editorSettings}
                  doc={editorDocument}
                  autoFocusOnDocumentChange={!isMobile()}
                  onScroll={onEditorScroll}
                  onChange={onEditorChange}
                  onSave={onFileSave}
                />
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle />
        <Panel
          ref={terminalPanelRef}
          defaultSize={showTerminal ? DEFAULT_TERMINAL_SIZE : 0}
          minSize={10}
          collapsible
          onExpand={() => {
            if (!terminalToggledByShortcut.current) {
              workbenchStore.toggleTerminal(true);
            }
          }}
          onCollapse={() => {
            if (!terminalToggledByShortcut.current) {
              workbenchStore.toggleTerminal(false);
            }
          }}
        >
          <div className="h-full">
            <div className=" h-full flex flex-col">
              <div className="flex items-center border-y gap-1.5 min-h-[var(--panel-header-height)] p-2">
              {Array.from({ length: terminalCount + 1 }, (_, index) => {
                  const isActive = activeTerminal === index;

                  return (
                    <React.Fragment key={index}>
                      {index == 0 ? (
                        <button
                          key={index}
                          className={cn(
                            'flex items-center gap-1.5 min-h-[var(--panel-header-height)] p-2',
                            {
                              'flex items-center text-sm cursor-pointer gap-1.5 px-3 py-2 h-full whitespace-nowrap rounded-full bg-secondary text-accent': isActive,
                              'flex items-center text-sm cursor-pointer gap-1.5 px-3 py-2 h-full whitespace-nowrap rounded-full bg-transparent text-muted hover:bg-accent':
                                !isActive,
                            },
                          )}
                          onClick={() => setActiveTerminal(index)}
                        >
                          <TerminalIcon className='text-lg'/>
                          BoltNext
                        </button>
                      ) : (
                        <React.Fragment>
                          <button
                            key={index}
                            className={cn(
                              'flex items-center gap-1.5 min-h-[var(--panel-header-height)] p-2',
                              {
                                'flex items-center text-sm cursor-pointer gap-1.5 px-3 py-2 h-full whitespace-nowrap rounded-full bg-secondary text-accent': isActive,
                                'flex items-center text-sm cursor-pointer gap-1.5 px-3 py-2 h-full whitespace-nowrap rounded-full bg-transparent text-muted hover:bg-accent':
                                  !isActive,
                              },
                            )}
                            onClick={() => setActiveTerminal(index)}
                          >
                            <TerminalWindow weight='duotone' className="text-lg" />
                            Terminal {terminalCount > 1 && index}
                          </button>
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  );
                })}
                {terminalCount < MAX_TERMINALS && <Plus className='cursor-pointer' onClick={addTerminal} />}
                <CaretDown
                  className="ml-auto cursor-pointer"
                  onClick={() => workbenchStore.toggleTerminal(false)}
                />
              </div>
              {Array.from({ length: terminalCount + 1 }, (_, index) => {
                const isActive = activeTerminal === index;

                return (
                  <Terminal
                    key={index}
                    className={cn('h-full overflow-hidden', {
                      hidden: !isActive,
                    })}
                    ref={(ref) => {
                      terminalRefs.current[index] = ref;
                    }}
                    onTerminalReady={(terminal) => {
                      if (index === 0) {
                        workbenchStore.attachBoltNextTerminal(terminal);
                      } else {
                        workbenchStore.attachTerminal(terminal);
                      }
                    }}
                    onTerminalResize={(cols, rows) => workbenchStore.onTerminalResize(cols, rows)}
                    theme={theme}
                  />
                );
              })}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    );
  },
);