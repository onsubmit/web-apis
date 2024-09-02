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
    if (css) {
      iframeSrcDoc += `<style>${css}</style>`;
    }

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

  return executorValue.replace(
    `<iframe src="${config.iframeSrc}"`,
    `<iframe srcdoc="${iframeSrcDoc.trim()}"`
  );
}
