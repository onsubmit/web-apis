import { useEffect } from 'react';

export type Theme = 'dark' | 'light';

export default function useStarlightTheme(
  onThemeChange: (newTheme: Theme) => void
) {
  return useEffect(() => {
    const handleThemeChange = (e: Event) => {
      if (e.currentTarget instanceof HTMLSelectElement) {
        onThemeChange(parseTheme(e.currentTarget.value));
      }
    };

    const themeChangeAbortController = new AbortController();
    document
      .querySelectorAll<HTMLSelectElement>('starlight-theme-select select')
      .forEach((select) => {
        select.addEventListener('change', handleThemeChange, {
          signal: themeChangeAbortController.signal,
        });
      });

    return () => themeChangeAbortController.abort();
  }, [onThemeChange]);
}

export function getInitialTheme(): Theme {
  const storedTheme =
    document.documentElement.dataset.theme ||
    localStorage?.getItem('starlight-theme');

  return parseTheme(storedTheme);
}

function parseTheme(theme: unknown): Theme {
  if (theme === 'dark' || theme === 'light') {
    return theme;
  }

  return getPreferredColorScheme();
}

function getPreferredColorScheme(): Theme {
  return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
