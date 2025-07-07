import { atom } from 'nanostores';

export type Theme = 'dark' | 'light';

export const kTheme = 'boltnext_theme';

export function themeIsDark() {
  return themeStore.get() === 'dark';
}

export const DEFAULT_THEME = 'light';

export const themeStore = atom<Theme>(initStore());

function initStore() {
  if (typeof window !== 'undefined') {
    const persistedTheme = localStorage.getItem(kTheme) as Theme | undefined;
    const themeAttribute = document.querySelector('html')?.getAttribute('data-theme');

    return persistedTheme ?? (themeAttribute as Theme) ?? DEFAULT_THEME;
  }

  return DEFAULT_THEME;
}

export function toggleTheme() {
  const currentTheme = themeStore.get();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  themeStore.set(newTheme);

  if (typeof window !== 'undefined') {
    localStorage.setItem(kTheme, newTheme);
    document.querySelector('html')?.setAttribute('data-theme', newTheme);
  }
}