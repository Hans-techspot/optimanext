import { atom } from 'nanostores';

export type AnthropicModel = {
  id: 'claude-3-opus-20240229' | 'claude-3-5-sonnet-20241022' | 'claude-3-5-haiku-20241022';
  displayName: string;
};
export type GoogleModel = {
  id: 'gemini-2.0-flash-exp' | 'gemini-2.0-flash-thinking-exp-1219' | 'gemini-2.5-flash-preview-04-17';
  displayName: string;
};

export type TogetherAIModel = {
  id:
  | 'meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo'
  | 'meta-llama/Llama-3.3-70B-Instruct-Turbo'
  | 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo'
  | 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'
  | "Qwen/Qwen2.5-Coder-32B-Instruct"
  | "deepseek-ai/DeepSeek-V3"
  | "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8"
  | 'Qwen/QwQ-32B-Preview';
  displayName: string;
};

export type XAIModel = {
  id: 'grok-2-latest';
  displayName: string;
};

export enum ProviderType {
  ANTHROPIC = 'anthropic',
  GOOGLE = 'google',
  TOGETHER = 'together',
  XAI = 'xai',
}

export type Provider =
  | { type: ProviderType.ANTHROPIC; model: AnthropicModel }
  | { type: ProviderType.GOOGLE; model: GoogleModel }
  | { type: ProviderType.TOGETHER; model: TogetherAIModel }
  | { type: ProviderType.XAI; model: XAIModel };

export const providerStore = atom<Provider>({ type: ProviderType.GOOGLE, model: { id: 'gemini-2.0-flash-thinking-exp-1219', displayName: 'Gemini Flash Thinking' } });

export function setProvider(provider: Provider) {
  console.log('setProvider called with:', provider);
  providerStore.set(provider);
}

export const togetherModels: TogetherAIModel[] = [
  { id: 'meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo', displayName: 'Llama 3.2 90B Vision' },
  { id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', displayName: 'Llama 3.3 70B' },
  { id: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo', displayName: 'Meta Llama 3.1 405B' },
  { id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', displayName: 'Meta Llama 3.1 70B' },
  { id: "Qwen/Qwen2.5-Coder-32B-Instruct", displayName: "Qwen 2.5 Coder 32B" },
  { id: 'Qwen/QwQ-32B-Preview', displayName: 'QwQ 32B' },
];

export const anthropicModels: AnthropicModel[] = [
  { id: 'claude-3-opus-20240229', displayName: 'Claude Opus Latest' },
  { id: 'claude-3-5-sonnet-20241022', displayName: 'Claude Sonnet 3.5' },
  { id: 'claude-3-5-haiku-20241022', displayName: 'Claude Haiku Latest' },
];

export const googleModels: GoogleModel[] = [
  { id: 'gemini-2.0-flash-exp', displayName: 'Gemini 2.0 Flash' },
  { id: 'gemini-2.0-flash-thinking-exp-1219', displayName: 'Gemini 2.0 Flash Thinking' },
  { id: 'gemini-2.5-flash-preview-04-17', displayName: 'Gemini 2.5 Preview'},
];

export const xAIModels: XAIModel[] = [
  { id: 'grok-2-latest', displayName: 'Grok 2 Latest' },
];
