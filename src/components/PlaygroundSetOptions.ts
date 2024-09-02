import { getInitialTheme } from 'src/hooks/useStarlightTheme';
import type { Language } from 'src/utils/language';

import type { PlaygroundRef } from './Playground';

export type PlaygroundSetOptions = {
  type: 'replaceIframe';
  config: {
    sourceId: string;
    targetId: string;
    iframeSrc: string;
  };
};

type PlaygroundSetOptionsType = PlaygroundSetOptions['type'];

type OptionHandlerArgs = {
  options: PlaygroundSetOptions;
  playgroundId: string;
  playgroundRefs: Record<string, PlaygroundRef | null>;
  language: Language;
  executorValue: string;
};

export function handleOptions({
  options,
  playgroundId,
  playgroundRefs,
  language,
  executorValue,
}: OptionHandlerArgs) {
  return optionHandlers[options.type]({
    options,
    playgroundId,
    playgroundRefs,
    language,
    executorValue,
  });
}

const optionHandlers: Record<
  PlaygroundSetOptionsType,
  (args: OptionHandlerArgs) => string
> = {
  replaceIframe: replaceIframeHandler,
};

function replaceIframeHandler({
  options: { type, config },
  playgroundId,
  playgroundRefs,
  language,
  executorValue,
}: OptionHandlerArgs) {
  if (
    type !== 'replaceIframe' ||
    language !== 'html' ||
    playgroundId !== config.targetId
  ) {
    return executorValue;
  }

  const playground = playgroundRefs[config.sourceId];
  if (!playground) {
    return executorValue;
  }

  let iframeSrcDoc = '';
  const html = playground.getSnippet('html');
  const js = playground.getSnippet('js');
  const css = playground.getSnippet('css');

  if (html) {
    iframeSrcDoc += `<html class='theme-${getInitialTheme()}'><head><meta name='color-scheme' content='light dark'>`;
    if (css) {
      iframeSrcDoc += `
<style>
  :root.theme-dark { color-scheme: dark }
  :root.theme-light { color-scheme: light }
  ${css}
</style>`;
    }

    iframeSrcDoc += '</head><body>';
    iframeSrcDoc += html.trim();
  }

  if (js) {
    iframeSrcDoc += `
<script>
(async () => {
  debugger;
  ${js.trim()}
})();
</script>`;
  }

  iframeSrcDoc += '</body></html>';

  // TODO: Fix quote handling
  return executorValue.replace(
    `<iframe src="${config.iframeSrc}"`,
    `<iframe srcdoc="${iframeSrcDoc.trim()}"`
  );
}
