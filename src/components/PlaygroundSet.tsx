import type { Language } from 'src/utils/language';

import Playground, {
  type PlaygroundProps,
  type PlaygroundRef,
} from './Playground';
import {
  handleOptions,
  type PlaygroundSetOptions,
} from './PlaygroundSetOptions';

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

    return handleOptions({
      options,
      playgroundId,
      playgroundRefs,
      language,
      executorValue,
    });
  }

  return playgroundPropsArr.map((props, i) => (
    <Playground
      key={i}
      ref={(r) => (playgroundRefs[props.id] = r)}
      {...{ ...props, onBeforeRunCode }}
    ></Playground>
  ));
}
