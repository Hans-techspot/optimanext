import { AnimatePresence, motion } from 'framer-motion';
import type { ActionAlert } from '@/types/actions';
import { cn } from '@/lib/utils';
import { CaretDown, CaretUp, Warning } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';
interface Props {
  alert: ActionAlert;
  clearAlert: () => void;
  postMessage: (message: string) => void;
}
export default function ChatAlert({ alert, clearAlert, postMessage }: Props) {
  const { description, content, source, type, timestamp } = alert;
  const [isExpanded, setIsExpanded] = useState(false);
  const [errorHistory, setErrorHistory] = useState<ActionAlert[]>([]);
  
  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  // Add current error to history when alert changes
  useEffect(() => {
    setErrorHistory(prev => [alert, ...prev].slice(0, 5)); // Keep last 5 errors
  }, [alert]);
  
  const clearHistory = () => setErrorHistory([]);
  
  const isPreview = source === 'preview';
  
  const errorTypeMap = {
    command_not_found: 'Command Not Found',
    permission_denied: 'Permission Denied',
    file_not_found: 'File Not Found',
    syntax_error: 'Syntax Error',
    runtime_error: 'Runtime Error',
    network_error: 'Network Error',
    unknown_error: 'Error'
  };
  
  const title = isPreview ? 'Preview Error' : `${errorTypeMap[type as keyof typeof errorTypeMap] || 'Terminal Error'}`;
  
  const getErrorMessage = () => {
    if (isPreview) {
      return 'We encountered an error while running the preview. Would you like BoltNext to analyze and help resolve this issue?';
    }
    
    const baseMessage = 'We encountered an error while running terminal commands.';
    const timestampStr = new Date(timestamp).toLocaleTimeString();
    
    switch (type) {
      case 'command_not_found':
        return `${baseMessage} The command might be misspelled or not installed. (${timestampStr})`;
      case 'permission_denied':
        return `${baseMessage} You might need elevated permissions to perform this action. (${timestampStr})`;
      case 'file_not_found':
        return `${baseMessage} The specified file or directory doesn't exist. (${timestampStr})`;
      case 'syntax_error':
        return `${baseMessage} There might be a mistake in the command syntax. (${timestampStr})`;
      default:
        return `${baseMessage} Would you like BoltNext to analyze and help resolve this issue? (${timestampStr})`;
    }
  };
  
  const message = getErrorMessage();
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
                    <div className="space-y-2">
                      <div className="text-md font-normal tracking-wider p-2 border border-foreground/10 text-red-500 rounded-md">
                        Error: {description}
                      </div>
                      
                      {type === 'command_not_found' && (
                        <div className="p-2 bg-foreground/5 rounded-md">
                          <p className="text-sm mb-2">Try these suggestions:</p>
                          <ul className="space-y-1">
                            {['Check if the command is installed',
                              'Verify the command spelling',
                              "Use 'which [command]' to check availability"].map((suggestion, index) => (
                              <li key={index} className="flex items-center justify-between">
                                <span>• {suggestion}</span>
                                <button
                                  onClick={() => navigator.clipboard.writeText(suggestion)}
                                  className="p-1 rounded hover:bg-foreground/10"
                                  title="Copy suggestion"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                  </svg>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {type === 'permission_denied' && (
                        <div className="p-2 bg-foreground/5 rounded-md">
                          <p className="text-sm mb-2">Try these suggestions:</p>
                          <ul className="space-y-1">
                            <li>• Use 'sudo' for elevated permissions</li>
                            <li>• Check file permissions with 'ls -l'</li>
                            <li>• Verify ownership with 'ls -n'</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {errorHistory.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium">Recent Errors</h3>
                        <button
                          onClick={clearHistory}
                          className="text-xs text-foreground/50 hover:text-foreground/80"
                        >
                          Clear History
                        </button>
                      </div>
                      <div className="space-y-1">
                        {errorHistory.map((error, index) => (
                          <div
                            key={index}
                            className="p-2 text-sm bg-foreground/5 rounded-md cursor-pointer hover:bg-foreground/10"
                            onClick={() => setErrorHistory([error, ...errorHistory.filter((_, i) => i !== index)])}
                          >
                            <div className="flex items-center justify-between">
                              <span className="truncate">{error.description}</span>
                              <span className="text-xs text-foreground/50 ml-2">
                                {new Date(error.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {type === 'command_not_found' && (
                        <div className="mt-4 space-x-2">
                          <button
                            onClick={() => postMessage(`Install missing package: \`sudo apt install ${content.split(' ')[0]}\``)}
                            className="px-2 py-1 text-sm bg-foreground/5 rounded-md hover:bg-foreground/10"
                          >
                            Install Package
                          </button>
                          <button
                            onClick={() => postMessage(`Check command availability: \`which ${content.split(' ')[0]}\``)}
                            className="px-2 py-1 text-sm bg-foreground/5 rounded-md hover:bg-foreground/10"
                          >
                            Check Availability
                          </button>
                        </div>
                      )}
                      
                      {type === 'permission_denied' && (
                        <div className="mt-4 space-x-2">
                          <button
                            onClick={() => postMessage(`Run with elevated permissions: \`sudo ${content}\``)}
                            className="px-2 py-1 text-sm bg-foreground/5 rounded-md hover:bg-foreground/10"
                          >
                            Run as Admin
                          </button>
                          <button
                            onClick={() => postMessage(`Check permissions: \`ls -l ${content.split(' ')[1] || '.'}\``)}
                            className="px-2 py-1 text-sm bg-foreground/5 rounded-md hover:bg-foreground/10"
                          >
                            Check Permissions
                          </button>
                        </div>
                      )}
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