"use client"
import type { Message } from 'ai';
import React, { type RefCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Messages } from './Messages';
import { ChatInput } from './ChatInput';
import { ChatIntro } from './ChatIntro';
import { ChatExamples } from './ChatExamples';
import { Workbench } from '@/components/workbench/Workbench';
import { CaretDown } from '@phosphor-icons/react';
import ChatAlert from './ChatAlert';
import { ActionAlert } from '@/types/actions';

interface BaseChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement> | undefined;
  messageRef?: RefCallback<HTMLDivElement> | undefined;
  scrollRef?: RefCallback<HTMLDivElement> | undefined;
  showChat?: boolean;
  chatStarted?: boolean;
  isStreaming?: boolean;
  messages?: any;
  enhancingPrompt?: boolean;
  promptEnhanced?: boolean;
  input?: string;
  handleStop?: () => void;
  sendMessage?: (event: React.UIEvent, messageInput?: string, imagePreview?: { imageUrl?: string | null, imageName?: string | null, imageSize?: number | null } | null | undefined) => void;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  enhancePrompt?: () => void;
  onVoiceInput?: () => void;
  isListening?: boolean;
  actionAlert?: ActionAlert;
  clearAlert?: () => void;
}

export const BaseChat = React.forwardRef<HTMLDivElement, BaseChatProps>(
  (
    {
      textareaRef,
      messageRef,
      scrollRef,
      showChat = true,
      chatStarted = false,
      isStreaming = false,
      enhancingPrompt = false,
      promptEnhanced = false,
      messages,
      input = '',
      sendMessage,
      handleInputChange,
      enhancePrompt,
      handleStop,
      onVoiceInput,
      isListening,
      actionAlert,
      clearAlert,
    },
    ref,
  ) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  
    useEffect(() => {
      if (isStreaming) { // Only scroll to bottom if isStreaming is true
        scrollToBottom();
      }
    }, [messages, isStreaming]);

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex h-full min-h-full w-full overflow-hidden max-w-full'
        )}
        data-chat-visible={showChat}
      >
        <div className="flex flex-1 w-full h-full">
          {showChat ? (
            <div
              ref={scrollRef}
              className="flex flex-1 overflow-y-auto w-full h-full justify-center hide-scrollbar"
            >
              <div
                className={cn(
                  'flex flex-col flex-grow h-full w-full',
                )}
              >
                {!chatStarted && <ChatIntro />}
                <div
                  className={cn('', {
                    'h-full flex flex-col ': chatStarted,
                  })}
                >
                  {chatStarted ? (
                    <Messages
                      ref={messageRef}
                      className="flex flex-col w-full flex-1 max-w-2xl px-2 sm:px-4 pb-4 sm:pb-6 mx-auto z-1"
                      messages={(messages || []).map((message: { role: string; content: any; data: any; }) => {
                        if (message.role === 'user' && typeof message.content !== 'string' && typeof message.data !== 'string') {
                          return {
                            ...message,
                            content: (message.content as any)?.props?.children?.[0] || '',
                            data: (message.data as any) || '',
                          };
                        }
                        return message;
                      })}
                      isStreaming={isStreaming}
                    />
                  ) : null}
                  <div
                    className={cn(
                      'relative w-full max-w-2xl mx-auto z-prompt',
                      ' sm:px-0',
                      { 'sticky bottom-0': chatStarted }
                    )}
                  >
                    <div className=" mb-2">
                      {actionAlert && (
                        <ChatAlert
                          alert={actionAlert}
                          clearAlert={() => clearAlert?.()}
                          postMessage={(message) => {
                            sendMessage?.({} as any, message);
                            clearAlert?.();
                          }}
                        />
                      )}
                    </div>
                    <ChatInput
                      textareaRef={textareaRef}
                      input={input}
                      handleInputChange={handleInputChange}
                      sendMessage={(event: React.UIEvent<Element, UIEvent>, imagePreview: { imageUrl?: string | null, imageName?: string | null, imageSize?: number | null } | null | undefined) => sendMessage?.(event, input, imagePreview)}
                      isStreaming={isStreaming}
                      handleStop={handleStop}
                      enhancingPrompt={enhancingPrompt}
                      promptEnhanced={promptEnhanced}
                      enhancePrompt={enhancePrompt}
                      onVoiceInput={onVoiceInput}
                      isListening={isListening}
                    />
                    <div ref={messagesEndRef}/>
                  </div>
                </div>
                {!chatStarted &&
                <div className="flex flex-col items-center justify-center mt-10">
                 <CaretDown className="text-5xl text-muted text-center animate-bounce " />
                 <ChatExamples sendMessage={sendMessage} />
                 </div>
                 }
              </div>
            </div>
          ) : null}
          <Workbench chatStarted={chatStarted} isStreaming={isStreaming} className={cn("h-full", {
            'w-full flex-grow': !showChat,
          })} />
        </div>
      </div>
    );
  },
);