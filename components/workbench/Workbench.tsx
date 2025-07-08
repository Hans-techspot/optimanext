import { useStore } from '@nanostores/react';
import { motion, type HTMLMotionProps, type Variants } from 'framer-motion';
import { computed } from 'nanostores';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useGitHubAuth } from '@/hooks/useGitHubAuth';
import { toast } from '@/hooks/use-toast';
import {
  type OnChangeCallback as OnEditorChange,
  type OnScrollCallback as OnEditorScroll,
} from '@/components/editor/codemirror/CodeMirrorEditor';
import { IconButton } from '@/components/ui/IconButton';
import { PanelHeaderButton } from '@/components/ui/PanelHeaderButton';
import { Slider, type SliderOptions } from '@/components/ui/OldSlider';
import { workbenchStore, type WorkbenchViewType } from '@/lib/stores/workbench';
import { cn } from '@/lib/utils';
import { cubicEasingFn } from '@/utils/easings';
import { renderLogger } from '@/utils/logger';
import { EditorPanel } from './EditorPanel';
import { Preview } from './Preview';
import { GitHubVersionControlMenu } from '@/components/ui/GitHubVersionControlMenu';
import { RepoSelectModal } from '@/components/ui/RepoSelectModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { chatStore } from '@/lib/stores/chat';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useSidebar } from '../ui/sidebar';
import { XCircle } from '@phosphor-icons/react';

interface WorkspaceProps {
  chatStarted?: boolean;
  isStreaming?: boolean;
  className?: string;
}

const viewTransition = { ease: cubicEasingFn };

const sliderOptions: SliderOptions<WorkbenchViewType> = {
  left: {
    value: 'editor',
    text: 'Editor',
  },
  right: {
    value: 'preview',
    text: 'Preview',
  },
};

const workbenchVariants = {
  closed: {
    width: 0,
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
  open: {
    width: 'var(--workbench-width)',
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
} satisfies Variants;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export const Workbench = memo(({ chatStarted, isStreaming, className }: WorkspaceProps) => {

  renderLogger.trace('Workbench');

  // --- GitHub Version Control State/Handlers ---
  const [repoModalOpen, setRepoModalOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<any>(null);
  const {
    authenticated,
    username,
    token: githubToken,
    loading: authLoading,
    error: authError,
    login: handleGitHubSignIn,
    logout: handleGitHubLogout,
    refresh: refreshGitHubAuth,
  } = useGitHubAuth();
  // useStore hooks for unsavedFiles and files (declare only once at the top)

  const handleRepoSelect = useCallback((repo: any) => {
    setSelectedRepo(repo);
    setRepoModalOpen(false);
  }, []);

  const handleRepoCreate = useCallback((repo: any) => {
    setSelectedRepo(repo);
    setRepoModalOpen(false);
  }, []);

  const handlePushChanges = useCallback(() => {
    if (!authenticated) return handleGitHubSignIn(window.location.href);
    if (!selectedRepo) {
      toast({ title: 'No repository selected', description: 'Please select a GitHub repository first.' });
      return;
    }
    const unsavedFiles = workbenchStore.unsavedFiles.get();
    if (!unsavedFiles || unsavedFiles.size === 0) {
      toast({ title: 'No changes to push', description: 'There are no unsaved files to commit.' });
      return;
    }
    if (!githubToken) {
      toast({ title: 'No GitHub token', description: 'You must be authenticated to push changes.' });
      return;
    }
    const files = workbenchStore.files.get();
    const filesArr = Array.isArray(files) ? files : [];
    (async () => {
      try {
        const { pushChanges } = await import('@/lib/github');
        const filesToPush = Array.from(workbenchStore.unsavedFiles.get())
          .map((filePath) => {
            const file = filesArr.find((f: any) => f.path === filePath);
            return file ? { path: file.path, content: file.content } : null;
          })
          .filter((f): f is { path: string; content: string } => Boolean(f));
        await pushChanges({
          token: githubToken,
          owner: selectedRepo.owner.login || selectedRepo.owner,
          repo: selectedRepo.name,
          branch: selectedRepo.default_branch || 'main',
          files: filesToPush,
          commitMessage: `Commit from OptimaNext at ${new Date().toISOString()}`,
        });
        toast({ title: 'Push successful', description: 'Your changes have been pushed to GitHub.' });
        workbenchStore.unsavedFiles.set(new Set());
      } catch (err: any) {
        toast({ title: 'Push failed', description: err.message || String(err) });
      }
    })();
  }, [authenticated, handleGitHubSignIn, selectedRepo, githubToken, toast]);

  const handleViewCommits = useCallback(() => {
    if (!authenticated) return handleGitHubSignIn(window.location.href);
    if (!selectedRepo) {
      toast({ title: 'No repository selected', description: 'Please select a GitHub repository first.' });
      return;
    }
    if (!githubToken) {
      toast({ title: 'No GitHub token', description: 'You must be authenticated to view commits.' });
      return;
    }
    (async () => {
      try {
        const { fetchCommits } = await import('@/lib/github');
        const commits = await fetchCommits({
          token: githubToken,
          owner: selectedRepo.owner.login || selectedRepo.owner,
          repo: selectedRepo.name,
          branch: selectedRepo.default_branch || 'main',
          perPage: 10,
        });
        toast({
          title: 'Recent Commits',
          description: commits.map((c: any) => `${c.commit.message} (${c.sha.slice(0, 7)})`).join('\n'),
          duration: 10000,
        });
      } catch (err: any) {
        toast({ title: 'Failed to fetch commits', description: err.message || String(err) });
      }
    })();
  }, [authenticated, handleGitHubSignIn, selectedRepo, githubToken, toast]);

  const isMobile = useIsMobile();
  const hasPreview = useStore(computed(workbenchStore.previews, (previews) => previews.length > 0));
  const showWorkbench = useStore(workbenchStore.showWorkbench);
  const selectedFile = useStore(workbenchStore.selectedFile);
  const currentDocument = useStore(workbenchStore.currentDocument);
  const selectedView = useStore(workbenchStore.currentView);
  const { showChat } = useStore(chatStore);
  const { state } = useSidebar();

  const canHideChat = showWorkbench || !showChat;

  const setSelectedView = (view: WorkbenchViewType) => {
    workbenchStore.currentView.set(view);
  };

  useEffect(() => {
    if (isStreaming) {
      setSelectedView('editor');
    } else if (hasPreview) {
      setSelectedView('preview');
    }
  }, [hasPreview, isStreaming]);

  useEffect(() => {
    const files = workbenchStore.files.get();
    if (files) {
      workbenchStore.setDocuments(files);
    }
  }, [workbenchStore.files]);

  const onEditorChange = useCallback<OnEditorChange>((update) => {
    workbenchStore.setCurrentDocumentContent(update.content);
  }, []);

  const onEditorScroll = useCallback<OnEditorScroll>((position) => {
    workbenchStore.setCurrentDocumentScrollPosition(position);
  }, []);

  const onFileSelect = useCallback((filePath: string | undefined) => {
    workbenchStore.setSelectedFile(filePath);
  }, []);

  const onFileSave = useCallback(async () => {
    try {
      await workbenchStore.saveCurrentDocument();
      toast({
        title: "File saved",
        description: "Changes should be reflected in the preview",
      })
    } catch (error) {
      console.error('Failed to save file or update version:', error);
      toast({
        title: "Failed to update file content or version",
      })
    }
  }, []);

  const onFileReset = useCallback(() => {
    workbenchStore.resetCurrentDocument();
  }, []);

  const innerWorkbench = (
    <div
      className={
        !isMobile
          ? cn(
            `h-full w-full max-w-full z-0 transition-[left,width] duration-200 boltnext-ease-cubic-bezier `,
          )
          : 'w-full h-full max-w-full '
      }
    >
      <div className={cn(
        'flex inset-0 h-full w-full max-w-full',
      )}>
        {!isMobile && <div className="h-full flex">
          <button
            className='w-8 h-20 my-auto bg-transparent text-foreground z-50'
            onClick={() => {
              if (canHideChat) {
                chatStore.setKey('showChat', !showChat);
              }
            }}
          >
            {showChat ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>}

        <div className={`w-full h-full flex flex-col bg-white/5  backdrop-blur-sm border  shadow-sm rounded-${isMobile ? 'none rounded-t-lg' : 'lg'} overflow-hidden`}>
          <div className="flex items-center px-3 py-2 border-b ">
            <Slider selected={selectedView} options={sliderOptions} setSelected={setSelectedView} />
            {/* GitHub Version Control UI for Editor tab */}
            {/* GitHub Version Control UI for Editor and Preview tabs */}
            <GitHubVersionControlMenu
              isAuthenticated={authenticated}
              repoName={selectedRepo?.name}
              onSignIn={handleGitHubSignIn}
              onSelectRepo={() => setRepoModalOpen(true)}
              onPushChanges={handlePushChanges}
              onViewCommits={handleViewCommits}
            />
            <RepoSelectModal
              open={repoModalOpen}
              onClose={() => setRepoModalOpen(false)}
              onSelect={handleRepoSelect}
              onCreate={handleRepoCreate}
              token={githubToken || ''}
            />

            <div className="ml-auto" />
            <XCircle
              className="-mr-1 cursor-pointer text-lg"
              onClick={() => {
                workbenchStore.showWorkbench.set(false);
              }}
            />
          </div>
          <div className="relative flex-1 overflow-hidden h-full">
            <View
              initial={{ x: selectedView === 'editor' ? 0 : '-100%' }}
              animate={{ x: selectedView === 'editor' ? 0 : '-100%' }}
            >
              <EditorPanel
                editorDocument={currentDocument}
                isStreaming={isStreaming}
                selectedFile={selectedFile}
                files={workbenchStore.files.get()}
                unsavedFiles={workbenchStore.unsavedFiles.get()}
                onFileSelect={onFileSelect}
                onEditorScroll={onEditorScroll}
                onEditorChange={onEditorChange}
                onFileSave={onFileSave}
                onFileReset={onFileReset}
              />
            </View>
            <View
              initial={{ x: selectedView === 'preview' ? 0 : '100%' }}
              animate={{ x: selectedView === 'preview' ? 0 : '100%' }}
            >
              <Preview />
            </View>
          </div>
        </div>
      </div>
    </div>
  );

  // Create a single workbench instance that's shared between mobile/desktop
  const workbenchInstance = useMemo(() => (
    <motion.div
      initial="closed"
      animate={showWorkbench ? 'open' : 'closed'}
      variants={isMobile ? undefined : workbenchVariants}
      className={cn("z-workbench w-full h-full", className)}
    >
      {innerWorkbench}
    </motion.div>
  ), [showWorkbench, isMobile, innerWorkbench, className]);

  if (!chatStarted) {
    return null;
  }

  if (isMobile) {
    return (
      <Drawer
        open={showWorkbench}
        onOpenChange={(open) => workbenchStore.showWorkbench.set(open)}
      >
        <DrawerContent tabClassName='hidden' className="h-full outline-none ring-0 focus:outline-none focus:ring-0 ring-transparent border-transparent ">
          {workbenchInstance}
        </DrawerContent>
      </Drawer>
    );
  }

  return workbenchInstance;
});

interface ViewProps extends HTMLMotionProps<'div'> {
  children: JSX.Element;
}


const View = memo(({ children, ...props }: ViewProps) => {
  return (
    <motion.div className="absolute inset-0" transition={viewTransition} {...props}>
      {children}
    </motion.div>
  );
});