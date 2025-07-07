"use client"
import { useStore } from '@nanostores/react';
import { AnimatePresence, motion } from 'framer-motion';
import { computed } from 'nanostores';
import { memo, useEffect, useRef, useState } from 'react';
import type { ActionState } from '@/lib/runtime/action-runner';
import { workbenchStore } from '@/lib/stores/workbench';
import { cubicEasingFn } from '@/utils/easings';
import { ShellCodeBlock } from './ShellCodeBlock';
import { cn } from '@/lib/utils';
import { Browsers, CaretDown, CaretUp, Check, Terminal, X } from '@phosphor-icons/react';
import { LoaderCircle } from 'lucide-react';


interface ArtifactProps {
  messageId: string;
}

export const Artifact = memo(({ messageId }: ArtifactProps) => {
  const userToggledActions = useRef(false);
  const [showActions, setShowActions] = useState(false);

  const artifacts = useStore(workbenchStore.artifacts);
  const artifact = artifacts[messageId];

  const actions = useStore(
    computed(artifact.runner.actions, (actions) => {
      return Object.values(actions);
    }),
  );

  const toggleActions = () => {
    userToggledActions.current = true;
    setShowActions(!showActions);
  };

  useEffect(() => {
    if (actions.length && !showActions && !userToggledActions.current) {
      setShowActions(true);
    }
  }, [actions]);

  return (
    <div className="artifact border flex flex-col overflow-hidden rounded-lg w-full transition-border duration-150">
      <div className="flex">
        <button
          className="flex items-stretch bg-secondary/20 backdrop-blur-sm hover:bg-secondary  w-full overflow-hidden"
          onClick={() => {
            const showWorkbench = workbenchStore.showWorkbench.get();
            workbenchStore.showWorkbench.set(!showWorkbench);
          }}
        >
          <div className="px-5 p-3.5 w-full text-left">
            <div className='flex items-center gap-1.5'>
              <Browsers className='text-lg' />
            <div className="w-full text-accent font-medium leading-5 text-sm">{artifact?.title}</div>
            </div>
            <div className="w-full text-muted-foreground text-xs mt-0.5">Click to open artifact</div>
          </div>
        </button>
        <AnimatePresence>
          {actions.length && (
            <motion.button
              initial={{ width: 0 }}
              animate={{ width: 'auto' }}
              exit={{ width: 0 }}
              transition={{ duration: 0.15, ease: cubicEasingFn }}
              className="border-l bg-secondary/20 backdrop-blur-sm hover:bg-secondary hover:text-accent"
              onClick={toggleActions}
            >
              <div className="p-4">
                {showActions ? <CaretUp/> : <CaretDown/>}
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {showActions && actions.length > 0 && (
          <motion.div
            className="actions"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: '0px' }}
            transition={{ duration: 0.15 }}
          >
            <div className="border-t p-5 text-left bg-secondary/20 backdrop-blur-sm">
              <ActionList actions={actions} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

interface ShellCodeBlockProps {
  classsName?: string;
  code: string;
}

interface ActionListProps {
  actions: ActionState[];
}

const actionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ActionList = memo(({ actions }: ActionListProps) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
      <ul className="list-none space-y-2.5">
        {actions.map((action, index) => {
          const { status, type, content } = action;
          const isLast = index === actions.length - 1;

          return (
            <motion.li
              key={index}
              variants={actionVariants}
              initial="hidden"
              animate="visible"
              transition={{
                duration: 0.2,
                ease: cubicEasingFn,
              }}
            >
              <div className="flex items-center gap-1.5 text-sm">
                <div className={cn('text-lg', getIconColor(action.status))}>
                  {status === 'running' ? (
                    <>
                    {type !== 'start' ? (
                      <LoaderCircle className='animate-spin'/>
                    ) : (
                      <Terminal weight='bold' className='text-primary'/>
                    )}
                  </>
                  ) : status === 'pending' ? (
                     <LoaderCircle className='animate-spin'/>
                  ) : status === 'complete' ? (
                    <Check className=''/>
                  ) : status === 'failed' || status === 'aborted' ? (
                    <X/>
                  ) : null}
                </div>
                {type === 'file' ? (
                  <div>
                    Create{' '}
                    <code className="bg-secondary text-accent px-1.5 py-1 rounded-md">
                      {action.filePath}
                    </code>
                  </div>
                ) : type === 'shell' ? (
                  <div className="flex items-center w-full min-h-[28px]">
                    <span className="flex-1">Run command</span>
                  </div>
                ) : type === 'start' ? (
                  <div className="flex items-center w-full min-h-[28px]">
                    <span className="flex-1">Start application</span>
                  </div>
                ) : null}
              </div>
              {(type === 'shell' || type === 'start') && (
                  <ShellCodeBlock
                    classsName={cn('mt-1', {
                      'mb-3.5': !isLast,
                    })}
                    code={content}
                  />
              )}
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
});

function getIconColor(status: ActionState['status']) {
  switch (status) {
    case 'pending': {
      return 'text-accent';
    }
    case 'running': {
      return 'text-accent';
    }
    case 'complete': {
      return 'text-primary';
    }
    case 'aborted': {
      return 'text-destructive';
    }
    case 'failed': {
      return 'text-destructive';
    }
    default: {
      return undefined;
    }
  }
}
