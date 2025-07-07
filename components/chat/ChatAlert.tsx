import { AnimatePresence, motion } from 'framer-motion';
import type { ActionAlert } from '@/types/actions';
import { cn } from '@/lib/utils';
import { CaretDown, CaretUp, Warning } from '@phosphor-icons/react';
import { useState } from 'react';
interface Props {
  alert: ActionAlert;
  clearAlert: () => void;
  postMessage: (message: string) => void;
}
export default function ChatAlert({ alert, clearAlert, postMessage }: Props) {
  const { description, content, source } = alert;
  const [isExpanded, setIsExpanded] = useState(false)
  const toggleExpand = () => setIsExpanded(!isExpanded)
  console.log("alert", alert)
  const isPreview = source === 'preview';
  const title = isPreview ? 'Preview Error' : 'Terminal Error';
  const message = isPreview
    ? 'We encountered an error while running the preview. Would you like BoltNext to analyze and help resolve this issue?'
    : 'We encountered an error while running terminal commands. Would you like BoltNext to analyze and help resolve this issue?';
  return (
    <AnimatePresence>
      <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg border glass  p-4"
    >
      <div className="flex flex-col items-start">
        <motion.div
          className="flex-shrink-0"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex gap-2 text-xl text-red-500">
            <Warning  />
            <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-medium text-foreground"
          >
            {title}
          </motion.h3>
          </div>
        </motion.div>
        <div className=" flex-1 w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-sm text-foreground/80"
          >
            <div className="bg-foreground/5 border border-foreground/5 px-2 rounded-lg">
              <div 
                className={cn(
                  "flex items-center justify-between cursor-pointer py-2",
                  isExpanded && "border-b border-foreground/20"
                )}
                onClick={toggleExpand}
              >
                <h3 className="text-sm font-medium flex items-center">
                  {isExpanded ? 'Hide' : 'Show'} problems
                </h3>
                {isExpanded ? <span><CaretDown/></span> : <span><CaretUp/></span>}
              </div>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-2 text-sm"
                >
                  <p>{message}</p>
                  {description && (
                    <div className="text-md font-normal tracking-wider p-2 border border-foreground/10 text-red-500 rounded-md mt-4 mb-4">
                      Error: {description}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    postMessage(
                      `*Fix this ${isPreview ? 'preview' : 'terminal'} error* \n\`\`\`${isPreview ? 'js' : 'sh'}\n${content}\n\`\`\`\n`
                    )
                  }
                  className={cn(
                    "px-2 py-1.5 rounded-md text-sm font-medium",
                    "bg-accent",
                    "hover:bg-muted",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bolt-elements-button-danger-background",
                    "text-white",
                    "flex items-center gap-1.5"
                  )}
                >
                  <div className="i-ph:chat-circle-duotone" />
                  Ask BoltNext
                </button>
                <button
                  onClick={clearAlert}
                  className={cn(
                    "px-2 py-1.5 rounded-md text-sm font-medium text-secondary-foreground hover:text-secondary",
                    "bg-secondary",
                    "hover:bg-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bolt-elements-button-secondary-background"
                  )}
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
    </AnimatePresence>
    
  );
}