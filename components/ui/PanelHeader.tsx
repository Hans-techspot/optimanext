import { memo } from 'react';
import { cn } from '@/lib/utils';

interface PanelHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export const PanelHeader = memo(({ className, children }: PanelHeaderProps) => {
  return (
    <div
      className={cn(
        'flex items-center gap-2  text-foreground border-b border-white/10 px-4 py-1 min-h-[34px] text-sm',
        className,
      )}
    >
      {children}
    </div>
  );
});
