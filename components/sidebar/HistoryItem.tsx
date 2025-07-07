import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useRef, useState } from 'react';
import { type ChatHistoryItem } from '@/persistance';
import { Trash } from '@phosphor-icons/react';

interface HistoryItemProps {
  item: ChatHistoryItem;
  onDelete?: (event: React.UIEvent) => void;
}

export function HistoryItem({ item, onDelete }: HistoryItemProps) {
  const [hovering, setHovering] = useState(false);
  const hoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;

    function mouseEnter() {
      setHovering(true);

      if (timeout) {
        clearTimeout(timeout);
      }
    }

    function mouseLeave() {
      setHovering(false);
    }

    hoverRef.current?.addEventListener('mouseenter', mouseEnter);
    hoverRef.current?.addEventListener('mouseleave', mouseLeave);

    return () => {
      hoverRef.current?.removeEventListener('mouseenter', mouseEnter);
      hoverRef.current?.removeEventListener('mouseleave', mouseLeave);
    };
  }, []);

  return (
    <div
      ref={hoverRef}
      className="group rounded-md w-full flex justify-between items-center px-2 py-1"
    >
      <a href={`/chat/${item.urlId}`} className="text-foreground/70 hover:text-foreground relative w-full truncate flex items-center justify-between">
        <span className="truncate flex-1">{item.description}</span>
          <div className="flex items-center p-1 text-muted hover:text-destructive">
              <Dialog.Trigger asChild>
                <Trash
                  className="scale-110"
                  onClick={(event) => {
                    // we prevent the default so we don't trigger the anchor above
                    event.preventDefault();
                    onDelete?.(event);
                  }}
                />
              </Dialog.Trigger>
            </div>
      </a>
    </div>
  );
}