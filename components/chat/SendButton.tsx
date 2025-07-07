import { ArrowBendDownRight, CircleNotch, PaperPlaneRight } from '@phosphor-icons/react';
import { AnimatePresence, cubicBezier, motion } from 'framer-motion';
import { Pickaxe } from 'lucide-react';

interface SendButtonProps {
  show: boolean;
  isStreaming?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const customEasingFn = cubicBezier(0.4, 0, 0.2, 1);

export function SendButton({ show, isStreaming, onClick }: SendButtonProps) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          className="flex justify-center items-center p-1 bg-accent-500 hover:brightness-94 color-white rounded-md w-[34px] h-[34px] transition-theme"
          transition={{ ease: customEasingFn, duration: 0.17 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          onClick={(event) => {
            event.preventDefault();
            onClick?.(event);
          }}
        >
          <div className="text-lg">
            {!isStreaming ? <PaperPlaneRight size={32} weight="fill" className='bg-accent rounded-lg p-1.5' /> : <CircleNotch className='animate-spin text-accent text-lg'/>}
          </div>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
