import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { SendButton } from './SendButton';
import { IconButton } from '@/components/ui/IconButton';
import { ProviderSelector } from './ProviderSelector';
import { CircleNotch, Image, MagicWand, Microphone, Sparkle, Paperclip, X } from '@phosphor-icons/react';

interface ChatInputProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement> | undefined;
  input?: string;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  sendMessage?: (event: React.UIEvent, imagePreview?: { imageUrl?: string | null, imageName?: string | null, imageSize?: number | null } | null | undefined) => void;
  isStreaming?: boolean;
  handleStop?: () => void;
  enhancingPrompt?: boolean;
  promptEnhanced?: boolean;
  enhancePrompt?: () => void;
  onVoiceInput?: () => void;
  isListening?: boolean;
}

const TEXTAREA_MIN_HEIGHT = 76;
const TEXTAREA_MAX_HEIGHT = 400;

export const ChatInput: React.FC<ChatInputProps> = ({
  textareaRef,
  input = '',
  handleInputChange,
  sendMessage,
  isStreaming,
  handleStop,
  enhancingPrompt,
  promptEnhanced,
  enhancePrompt,
  onVoiceInput,
  isListening,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isImageDragging, setIsImageDragging] = useState(false);

  const handleImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64 = base64String;
      setImagePreview(base64);
      setImageName(file.name);
      setImageSize(file.size);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleImage(file);
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = Array.from(event.clipboardData.items);
    const imageItem = items.find((item) => item.type.startsWith('image/'));
    if (!imageItem) return;
    event.preventDefault();
    const file = imageItem.getAsFile();
    if (!file) return;
    handleImage(file);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    setIsImageDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    handleImage(file);
  };

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
    if (event.dataTransfer.types.includes('Files')) {
      const file = event.dataTransfer.files?.[0];
       if (file && file.type.startsWith('image/')) {
        setIsImageDragging(true);
      }
    }
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    setIsImageDragging(false);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes'
  
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  
    const i = Math.floor(Math.log(bytes) / Math.log(k))
  
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  const handleSendMessage = (event: React.UIEvent) => {
    sendMessage?.(event, {
      imageUrl: imagePreview,
      imageName: imageName,
      imageSize: imageSize,
    });
    setImagePreview(null);
    setImageName(null);
    setImageSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className={cn(
        'shadow-sm glass gradBorder relative',
        'rounded-lg overflow-hidden'
      )}
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
    >
      {isImageDragging && (
        <div className="flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <span className="text-lg text-white">Drag and drop your image here to include it in the prompt</span>
        </div>
      )}
      {imagePreview && (
        <div className=" w-full bg-black/10 backdrop-blur-sm border-b m-0.5 p-1">
        <div className="relative max-w-44 bg-background/70 rounded-lg p-2 flex items-center gap-2 overflow-hidden">
          <div className="relative min-w-12 h-12">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="absolute inset-0 w-full h-full object-cover rounded-md"
            />
          </div>
          <div className='flex flex-col gap-1 items-start justify-center'>
            {imageName && <span className="text-xs text-accent truncate">{imageName}</span>}
            {imageSize && <span className="text-xs text-muted truncate">{formatBytes(imageSize)}</span>}
          </div>
          <button
            onClick={() => setImagePreview(null)}
            className="absolute top-1 right-1 p-1 rounded-full hover:bg-gray-700/50 transition-colors"
            aria-label="Remove image"
          >
            <X className="h-4 w-4 text-gray-200" />
          </button>
        </div>
      </div>
      )}
     
      <div className='flex items-start justify-between w-full px-3 pt-4 '>
        <textarea
          ref={textareaRef}
          className="w-full pr-12 sm:pr-16 focus:outline-none resize-none 
                                text-sm sm:text-md text-foreground
                                placeholder-muted bg-transparent"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              if (event.shiftKey) {
                return;
              }
              event.preventDefault();
              handleSendMessage(event);
            }
          }}
          value={input}
          onChange={(event) => {
            handleInputChange?.(event);
          }}
          style={{
            minHeight: TEXTAREA_MIN_HEIGHT,
            maxHeight: TEXTAREA_MAX_HEIGHT,
          }}
          placeholder="What will boltnext help you build today?"
          translate="no"
        />
        <SendButton
          show={!!(input.length > 0 || isStreaming || imagePreview)}
          isStreaming={isStreaming}
          onClick={(event) => {
            if (isStreaming) {
              handleStop?.();
              return;
            }
            handleSendMessage(event);
          }}
        />
      </div>
      <div className="flex justify-between text-xs sm:text-sm p-2 sm:p-4 pt-2">
      
        <div className="flex gap-0 items-center">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageUpload}
          />
          <IconButton
            title="Attach an image"
            className="flex items-center gap-1.5  text-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image className='text-lg' />
          </IconButton>
          <IconButton
            title="Voice input"
            className="flex items-center gap-1.5  text-sm"
            onClick={() => onVoiceInput?.()}
          >
            {isListening ? (
              <>
                <CircleNotch className='animate-spin text-lg' />
                < span>Listening...</span>
              </>
            ) : (
              <Microphone className='text-lg' />
            )}
          </IconButton>
          <IconButton
            title="Enhance prompt"
            disabled={input.length === 0 || enhancingPrompt}
            className={cn('scale-90 sm:scale-100', {
              'opacity-100!': enhancingPrompt,
              'text-foreground! pr-1.5 enabled:hover:bg-accent!':
                promptEnhanced,
            })}
            onClick={() => enhancePrompt?.()}
          >
            {enhancingPrompt ? (
              <>
                <CircleNotch className='animate-spin text-lg' />
                <div className="ml-1.5">Enhancing prompt...</div>
              </>
            ) : (
              <>
                <MagicWand className='text-lg' />
                {promptEnhanced && <div className="ml-1.5">Prompt enhanced</div>}
              </>
            )}
          </IconButton>
          <ProviderSelector />
        </div>
        {input.length > 3 ? (
          <div className="hidden sm:block text-xs text-muted">
            Use <kbd className="kdb">Shift</kbd> + <kbd className="kdb">Return</kbd> for a new
            line
          </div>
        ) : null}
      </div>
    </div>
  );
};