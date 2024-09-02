import type { LanguageState } from '@components/Playground';
import indentString from 'indent-string';

import type { Language } from './language';

export function getSnippet(language: Language, state: LanguageState): string {
  return state?.[language]?.getExecutorValue() ?? '';
}

export function getDocument(state: LanguageState): string {
  const template = `
<html>
{HEAD_AND_USER_CSS}
<body>
{USER_HTML}
{USER_SCRIPT}
</body>
</html>`.trim();

  let document = template;
  if (state.css) {
    document = document.replace(
      '{HEAD_AND_USER_CSS}',
      indentString(
        `
<head>
<style>
${indentString(getSnippet('css', state).trim(), 4)}
</style>
</head>`.trim(),
        2
      )
    );
  } else {
    document = document.replace(/[{]HEAD_AND_USER_CSS[}](\r?\n)/, '');
  }

  if (state.html) {
    document = document.replace(
      '{USER_HTML}',
      indentString(getSnippet('html', state).trim(), 4)
    );
  } else {
    document = document.replace(/[{]USER_HTML[}](\r?\n)/, '');
  }

  if (state.js) {
    document = document.replace(
      '{USER_SCRIPT}',
      indentString(
        `
<script>
(async () => {
${indentString(getSnippet('js', state).trim(), 4)}
})();
</script>`.trim(),
        4
      )
    );
  }

  return document;
}
