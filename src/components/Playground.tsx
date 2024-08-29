import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import classNames from "classnames";
import { useCallback, useMemo, useRef, useState } from "react";
import useStarlightTheme, {
  getInitialTheme,
  type StarlightTheme,
} from "src/hooks/useStarlightTheme";
import CodeEditor, { type Language } from "./CodeEditor";
import styles from "./Playground.module.css";
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';

type PlaygroundProps = {
  languages: Record<Language, string>;
};

type PlaygroundLanguageState = {
  header: string;
  initialEditorValue: string;
  executorValue: string;
};

type LanguageState = Record<Language, PlaygroundLanguageState>;

const languageNameMap: Record<Language, string> = {
  js: "JavaScript",
  html: "HTML",
  css: "CSS",
};

export default function Playground({ languages }: PlaygroundProps) {
  const initialState: LanguageState = useMemo(() => getInitialLanguageState(languages), []);

  const editorRefs = {
    js: useRef<ReactCodeMirrorRef>(null),
    html: useRef<ReactCodeMirrorRef>(null),
    css: useRef<ReactCodeMirrorRef>(null),
  };

  const [state, setState] = useState<LanguageState>(initialState);
  const [theme, setTheme] = useState<StarlightTheme>(getInitialTheme());

  function onResetEditor(language: Language) {
    const view = editorRefs[language].current?.view;
    view?.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.toString().length,
        insert: initialState[language].initialEditorValue,
      },
    });

    setState((s) => ({
      ...s,
      [language]: {
        executorValue: s[language].header + s[language].initialEditorValue,
      },
    }));
  }

  useStarlightTheme(setTheme);

  const onEditorChange = useCallback((language: Language, newEditorScript: string) => {
    setState((s) => ({
      ...s,
      [language]: {
        executorValue: (s[language].header + s[language].initialEditorValue).trim(),
      },
    }));
  }, []);

  function getEditors() {
    const languageNames = Object.keys(languages) as Array<Language>;
    const length = languageNames.length;
    if (length === 0) {
      throw new Error("At least one language is required.");
    }

    if (length === 1) {
      const language = languageNames[0];
      const script = languages[language];
      return (
        <CodeEditor
          ref={editorRefs[language]}
          language={language}
          theme={theme}
          script={script}
          onChange={() => (newValue: string) => onEditorChange(language, newValue)}
        />
      );
    }

    return (
      <Tabs size="lg">
        <TabList>
          {(Object.keys(languages) as Array<Language>).map(language => (
            <Tab>{languageNameMap[language]}</Tab>
          ))}
        </TabList>
        {(Object.entries(languages) as Array<[language: Language, script: string]>).map(
          ([language, script], index) => (
            <TabPanel value={index} keepMounted={true}>
              <CodeEditor
                key={language}
                ref={editorRefs[language]}
                language={language}
                theme={theme}
                script={script}
                onChange={() => (newValue: string) => onEditorChange(language, newValue)}
              />
            </TabPanel>
          )
        )}
      </Tabs>
    );
  }

  return (
    <div className={classNames("not-content", styles.className)}>
      {getEditors()}
      {/* <CodeExecutor script={executorValue} onResetEditor={onResetEditor} /> */}
    </div>
  );
}

function getInitialLanguageState(languages: PlaygroundProps["languages"]): LanguageState {
  return (Object.entries(languages) as Array<[Language, string]>).reduce<LanguageState>(
    (accumulator, [language, script]) => {
      const split = script.split("// ___Begin visible code snippet___");
      const header = split.length === 2 ? split[0].trim() : "";
      const initialEditorValue = (split.length === 2 ? split[1] : split[0]).trim();
      const executorValue = header + initialEditorValue;

      accumulator[language] = { header, initialEditorValue, executorValue };
      return accumulator;
    },
    {} as LanguageState
  );
}
