import Tab from '@mui/joy/Tab';
import TabList from '@mui/joy/TabList';
import TabPanel from '@mui/joy/TabPanel';
import Tabs from '@mui/joy/Tabs';
import classNames from 'classnames';
import type { Language } from 'src/utils/language';

import Playground, { type PlaygroundProps, type PlaygroundRef } from './Playground';
import styles from './PlaygroundSet.module.css';
import { handleOptions, type PlaygroundSetOptions } from './PlaygroundSetOptions';

type PlaygroundSetProps = {
  playgroundPropsArr: Array<PlaygroundProps>;
  options?: PlaygroundSetOptions;
};

export default function PlaygroundSet({ playgroundPropsArr, options }: PlaygroundSetProps) {
  const playgroundRefs: Record<string, PlaygroundRef | null> = {};

  function onBeforeRunCode(playgroundId: string, language: Language, executorValue: string): string {
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

  return (
    <div className={classNames('not-content', styles.className)}>
      <Tabs size="lg">
        <TabList>
          {playgroundPropsArr.map((props, i) => (
            <Tab key={props.id} value={i} color="primary">
              {props.id}
            </Tab>
          ))}
        </TabList>
        {playgroundPropsArr.map((props, i) => (
          <TabPanel key={props.id} value={i} keepMounted={true}>
            <Playground
              key={i}
              ref={(r) => (playgroundRefs[props.id] = r)}
              {...{ ...props, onBeforeRunCode }}
              isPartOfSet
            ></Playground>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}
