import type { Language } from 'src/utils/language';
import updateIframeSrcDocFromSnippet from 'src/utils/updateIframeSrcDocFromSnippet';

import Playground, {
  type PlaygroundProps,
  type PlaygroundRef,
} from './Playground';

type PlaygroundSetOptions = {
  type: 'replaceIframe';
  config: {
    sourceId: string;
    targetId: string;
    iframeSrc: string;
  };
};

type PlaygroundSetProps = {
  playgroundPropsArr: Array<PlaygroundProps>;
  options?: PlaygroundSetOptions;
};

export default function PlaygroundSet({
  playgroundPropsArr,
  options,
}: PlaygroundSetProps) {
  const playgroundRefs: Record<string, PlaygroundRef | null> = {};

  function onBeforeRunCode(
    playgroundId: string,
    language: Language,
    executorValue: string
  ): string {
    if (!options) {
      return executorValue;
    }

    switch (options.type) {
      case 'replaceIframe': {
        if (language === 'html' && playgroundId === options.config.targetId) {
          const playground = playgroundRefs[options.config.sourceId];
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

          return updateIframeSrcDocFromSnippet({
            inputHtml: executorValue,
            iframeSrc: options.config.iframeSrc,
            iframeSrcDoc,
          });
        }
      }
    }

    return executorValue;
  }

  // TODO: Get these Playgrounds to talk to eachother
  return playgroundPropsArr.map((props, i) => (
    <Playground
      key={i}
      ref={(r) => (playgroundRefs[props.id] = r)}
      {...{ ...props, onBeforeRunCode }}
    ></Playground>
  ));
}
