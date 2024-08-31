import Tab from "@mui/joy/Tab";
import TabList from "@mui/joy/TabList";
import TabPanel from "@mui/joy/TabPanel";
import Tabs from "@mui/joy/Tabs";
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import classNames from "classnames";
import { produce } from "immer";
import indentString from "indent-string";
import { useCallback, useMemo, useRef, useState } from "react";
import useStarlightTheme, { getInitialTheme, type Theme } from "src/hooks/useStarlightTheme";
import type { CodeAction, CodeActionContent } from "./CodeActionSplitButton";
import CodeEditor, { isLanguage, type Language } from "./CodeEditor";
import { CodeExecutor } from "./CodeExecutor";
import JoyThemeProvider from "./JoyThemeProvider";
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
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(getFirstLanguage(languages));

  const editorRefs = {
    js: useRef<ReactCodeMirrorRef>(null),
    html: useRef<ReactCodeMirrorRef>(null),
    css: useRef<ReactCodeMirrorRef>(null),
  };

  const [state, setState] = useState<LanguageState>(initialState);
  const [theme, setTheme] = useState<Theme>(getInitialTheme());

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

  useStarlightTheme((newTheme: Theme) => {
    setTheme(newTheme);
  });

  const onEditorChange = useCallback((language: Language, newEditorScript: string) => {
    setState(
      produce((s) => {
        s[language].executorValue = (s[language].header + newEditorScript).trim();
      })
    );
  }, []);

  const getEditorOnChangeCallback = (language: Language) => (newValue: string) =>
    onEditorChange(language, newValue);

  function onCodeAction(action: CodeAction, content: CodeActionContent) {
    switch (action) {
      case "Copy": {
        const code = content === "Snippet" ? getSnippet() : getDocument();
        navigator.clipboard.writeText(code.trim()).catch((error) => console.error(error));
      }
    }

    function getSnippet(): string {
      return state[selectedLanguage].executorValue;
    }

    function getDocument(): string {
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
          "{HEAD_AND_USER_CSS}",
          indentString(
            `
<head>
  <style>
${indentString(state.css.executorValue.trim(), 4)}
  </style>
</head>`.trim(),
            2
          )
        );
      }

      if (state.html) {
        document = document.replace(
          "{USER_HTML}",
          indentString(state.html.executorValue.trim(), 4)
        );
      }

      if (state.js) {
        document = document.replace(
          "{USER_SCRIPT}",
          indentString(
            `
<script>
  (async () => {
${indentString(state.js.executorValue.trim(), 4)}
  })();
</script>`.trim(),
            4
          )
        );
      }

      return document;
    }
  }

  function onLanguageTabChange(newLanguage: Language) {
    setSelectedLanguage(newLanguage);
  }

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
      <Tabs
        size="lg"
        defaultValue={selectedLanguage}
        onChange={(_event, newLanguage) => {
          if (!isLanguage(newLanguage)) {
            throw new Error("Unknown language");
          }

          onLanguageTabChange(newLanguage);
        }}
      >
        <TabList>
          {(Object.keys(languages) as Array<Language>).map((language) => (
            <Tab key={language} value={language}>
              {languageNameMap[language]}
            </Tab>
          ))}
        </TabList>
        {(Object.keys(languages) as Array<Language>).map((language) => (
          <TabPanel key={language} value={language} keepMounted={true}>
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
      <JoyThemeProvider>
        {getEditors()}
        <CodeExecutor state={state} {...{ selectedLanguage, onResetEditors, onCodeAction }} />
      </JoyThemeProvider>
    </div>
  );
}

function getFirstLanguage(languages: PlaygroundProps["languages"]): Language {
  const languageNames = Object.keys(languages) as Array<Language>;
  if (languageNames.length === 0) {
    throw new Error("At least one language is required.");
  }

  return languageNames[0];
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
