"use client"
import type { Message } from 'ai';
import React from 'react';
import { cn } from '@/lib/utils';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DotsThreeOutline } from '@phosphor-icons/react';

interface MessagesProps {
  id?: string;
  className?: string;
  isStreaming?: boolean;
  messages?: Message[];
}

export const Messages = React.forwardRef<HTMLDivElement, MessagesProps>((props: MessagesProps, ref) => {
  const { id, isStreaming = false, messages = [] } = props;

  return (
    <div id={id} ref={ref} className={props.className}>
      {messages.length > 0
        ? messages.map((message, index) => {
            const { role, content, data } = message;
            const isUserMessage = role === 'user';
            const isFirst = index === 0;
            const isLast = index === messages.length - 1;

            return (
              <div
                key={index}
                className={cn('flex gap-4 p-6 w-full rounded-[calc(0.75rem-1px)]', {
                  'bg-white/5  backdrop-blur-sm border border-white/10': isUserMessage || !isStreaming || (isStreaming && !isLast),
                  'bg-gradient-to-b from-white/5 from-30% to-transparent':
                    isStreaming && isLast,
                  'mt-4': !isFirst,
                })}
              >
                {isUserMessage && (
                  <div className="flex items-center justify-center w-[34px] h-[34px] overflow-hidden rounded-full shrink-0 self-start">
                    <Avatar className="h-full w-full ">
                        <AvatarImage src={""} alt={""} />
                        <AvatarFallback className="">BN</AvatarFallback>
                    </Avatar>
                  </div>
                )}
                <div className="grid grid-col-1 w-full">
                  {isUserMessage ? <UserMessage content={content} data={data} /> : <AssistantMessage content={content} />}
                </div>
              </div>
            );
          })
        : null}
      {isStreaming && (
        <svg xmlns="http://www.w3.org/2000/svg" className='mx-auto' width={48} height={48} viewBox="0 0 24 24"><circle cx={4} cy={12} r={3} fill="currentColor"><animate id="svgSpinners3DotsFade0" fill="freeze" attributeName="opacity" begin="0;svgSpinners3DotsFade1.end-0.25s" dur="0.75s" values="1;0.2"></animate></circle><circle cx={12} cy={12} r={3} fill="currentColor" opacity={0.4}><animate fill="freeze" attributeName="opacity" begin="svgSpinners3DotsFade0.begin+0.15s" dur="0.75s" values="1;0.2"></animate></circle><circle cx={20} cy={12} r={3} fill="currentColor" opacity={0.3}><animate id="svgSpinners3DotsFade1" fill="freeze" attributeName="opacity" begin="svgSpinners3DotsFade0.begin+0.3s" dur="0.75s" values="1;0.2"></animate></circle></svg>
      )}
    </div>
  );
});