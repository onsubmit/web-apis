import Tab from "@mui/joy/Tab";
import TabList from "@mui/joy/TabList";
import TabPanel from "@mui/joy/TabPanel";
import Tabs from "@mui/joy/Tabs";
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import classNames from "classnames";
import { produce } from "immer";
import { useCallback, useMemo, useRef, useState } from "react";
import useStarlightTheme, {
  getInitialTheme,
  type StarlightTheme,
} from "src/hooks/useStarlightTheme";
import CodeEditor, { type Language } from "./CodeEditor";
import { CodeExecutor } from "./CodeExecutor";
import styles from "./Playground.module.css";

type PlaygroundProps = {
  languages: Record<Language, string>;
};

type PlaygroundLanguageState = {
  header: string;
  initialEditorValue: string;
  executorValue: string;
};

export type LanguageState = Record<Language, PlaygroundLanguageState>;

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

  function onResetEditors() {
    const languageNames = Object.keys(languages) as Array<Language>;
    for (const language of languageNames) {
      const view = editorRefs[language].current?.view;
      view?.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.toString().length,
          insert: initialState[language].initialEditorValue,
        },
      });
    }

    setState(
      produce((s) => {
        for (const language of languageNames) {
          s[language].executorValue = s[language].header + s[language].initialEditorValue;
        }
      })
    );
  }

  useStarlightTheme(setTheme);

  const onEditorChange = useCallback((language: Language, newEditorScript: string) => {
    setState(
      produce((s) => {
        s[language].executorValue = (s[language].header + newEditorScript).trim();
      })
    );
  }, []);

  const getEditorOnChangeCallback = (language: Language) => (newValue: string) =>
    onEditorChange(language, newValue);

  function getEditors() {
    const languageNames = Object.keys(languages) as Array<Language>;
    const length = languageNames.length;
    if (length === 0) {
      throw new Error("At least one language is required.");
    }

    if (length === 1) {
      const language = languageNames[0];
      const script = initialState[language].initialEditorValue;
      return (
        <CodeEditor
          ref={editorRefs[language]}
          language={language}
          theme={theme}
          script={script}
          onChange={getEditorOnChangeCallback(language)}
        />
      );
    }

    return (
      <Tabs size="lg">
        <TabList>
          {(Object.keys(languages) as Array<Language>).map((language) => (
            <Tab key={language}>{languageNameMap[language]}</Tab>
          ))}
        </TabList>
        {(Object.keys(languages) as Array<Language>).map((language, index) => (
          <TabPanel key={language} value={index} keepMounted={true}>
            <CodeEditor
              key={language}
              ref={editorRefs[language]}
              language={language}
              theme={theme}
              script={initialState[language].initialEditorValue}
              onChange={getEditorOnChangeCallback(language)}
            />
          </TabPanel>
        ))}
      </Tabs>
    );
  }

  return (
    <div className={classNames("not-content", styles.className)}>
      {getEditors()}
      <CodeExecutor state={state} onResetEditors={onResetEditors} />
    </div>
  );
}

function getInitialLanguageState(languages: PlaygroundProps["languages"]): LanguageState {
  return (Object.entries(languages) as Array<[Language, string]>).reduce<LanguageState>(
    (accumulator, [language, script]) => {
      if (language === "js") {
        // Remove triple-slash comments
        script = script.replaceAll(/^\s*\/{3}(.+?)(\r?\n)/gm, "");
      }

      const split = script.split("// ___Begin visible code snippet___");
      const header = split.length === 2 ? split[0].trim() : "";
      const initialEditorValue = (split.length === 2 ? split[1] : split[0]).trim();
      const executorValue = `${header}\n\n${initialEditorValue}`;

      accumulator[language] = { header, initialEditorValue, executorValue };
      return accumulator;
    },
    {} as LanguageState
  );
}
