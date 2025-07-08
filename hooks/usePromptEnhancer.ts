import { useState } from 'react';
import { createScopedLogger } from '@/utils/logger';

const logger = createScopedLogger('usePromptEnhancement');

export function usePromptEnhancer() {
  const [enhancingPrompt, setEnhancingPrompt] = useState(false);
  const [promptEnhanced, setPromptEnhanced] = useState(false);

  const resetEnhancer = () => {
    setEnhancingPrompt(false);
    setPromptEnhanced(false);
  };

  const enhancePrompt = async (input: string, setInput: (value: string) => void) => {
    setEnhancingPrompt(true);
    setPromptEnhanced(false);

    const response = await fetch('/api/enhancer', {
      method: 'POST',
      body: JSON.stringify({
        message: input,
      }),
    });

    const reader = response.body?.getReader();
    const originalInput = input;

    if (reader) {
      const decoder = new TextDecoder();
      let _input = '';
      let _error;
      let received = false;

      try {
        // Only clear input if we actually get a non-empty chunk
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          const chunk = decoder.decode(value);
          if (chunk && chunk.trim()) {
            if (!received) {
              setInput('');
              received = true;
            }
            _input += chunk;
            logger.trace('Set input', _input);
            setInput(_input);
          }
        }
      } catch (error) {
        _error = error;
        setInput(originalInput);
      } finally {
        if (_error) {
          logger.error(_error);
        }
        setEnhancingPrompt(false);
        // Only set promptEnhanced if we actually enhanced something
        if (_input && _input.trim() && _input !== originalInput) {
          setPromptEnhanced(true);
        } else {
          setPromptEnhanced(false);
          // If nothing was received, restore original input
          if (!_input || !_input.trim()) {
            setInput(originalInput);
          }
        }
        // Ensure final input is set
        setTimeout(() => {
          setInput(_input && _input.trim() ? _input : originalInput);
        });
      }
    }
  };

  return { enhancingPrompt, promptEnhanced, enhancePrompt, resetEnhancer };
}
