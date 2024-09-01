const languages = ['js', 'html', 'css'] as const;
export type Language = (typeof languages)[number];

export function isLanguage(value: unknown): value is Language {
  if (typeof value !== 'string') {
    return false;
  }

  return languages.includes(value as Language);
}
