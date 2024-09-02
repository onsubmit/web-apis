import Tab from '@mui/joy/Tab';
import TabList from '@mui/joy/TabList';
import TabPanel from '@mui/joy/TabPanel';
import Tabs from '@mui/joy/Tabs';
import type { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import classNames from 'classnames';
import { produce } from 'immer';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import useStarlightTheme, {
  getInitialTheme,
  type Theme,
} from 'src/hooks/useStarlightTheme';
import { getDocument, getSnippet } from 'src/utils/documentGenerator';
import { isLanguage, type Language } from 'src/utils/language';

import type { CodeAction, CodeActionContent } from './CodeActionSplitButton';
import CodeEditor from './CodeEditor';
import { CodeExecutor } from './CodeExecutor';
import JoyThemeProvider from './JoyThemeProvider';
import styles from './Playground.module.css';

type OnBeforeRunCode = (
  playgroundId: string,
  language: Language,
  executorValue: string
) => string;

export type PlaygroundProps = {
  id: string;
  languages: Record<Language, string>;
  isPartOfSet?: boolean;
  preventRun?: boolean;
  onBeforeRunCode?: OnBeforeRunCode;
};

type PlaygroundLanguageState = {
  header: string;
  initialEditorValue: string;
  getExecutorValue: () => string;
};

export type LanguageState = Record<Language, PlaygroundLanguageState>;

const languageNameMap: Record<Language, string> = {
  js: 'JavaScript',
  html: 'HTML',
  css: 'CSS',
};

export type PlaygroundRef = {
  getSnippet: (language: Language) => string;
  getDocument: () => string;
};

const Playground = forwardRef<PlaygroundRef, PlaygroundProps>(
  ({ id, languages, isPartOfSet, preventRun, onBeforeRunCode }, ref) => {
    const initialState: LanguageState = useMemo(
      () => getInitialLanguageState(id, languages, onBeforeRunCode),
      [id, languages, onBeforeRunCode]
    );
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(
      getFirstLanguage(languages)
    );

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
            const executorValue =
              s[language].header + s[language].initialEditorValue;

            s[language].getExecutorValue = () => {
              return onBeforeRunCode
                ? onBeforeRunCode(id, language, executorValue)
                : executorValue;
            };
          }
        })
      );
    }

    useStarlightTheme((newTheme: Theme) => {
      setTheme(newTheme);
    });

    const onEditorChange = useCallback(
      (language: Language, newEditorScript: string) => {
        setState(
          produce((s) => {
            const executorValue = (s[language].header + newEditorScript).trim();

            s[language].getExecutorValue = () =>
              onBeforeRunCode
                ? onBeforeRunCode(id, language, executorValue)
                : executorValue;
          })
        );
      },
      [id, onBeforeRunCode]
    );

    const getEditorOnChangeCallback =
      (language: Language) => (newValue: string) =>
        onEditorChange(language, newValue);

    function onCodeAction(action: CodeAction, content: CodeActionContent) {
      switch (action) {
        case 'Copy': {
          const code =
            content === 'Snippet'
              ? getSnippet(selectedLanguage, state)
              : getDocument(state);
          navigator.clipboard
            .writeText(code.trim())
            .catch((error) => console.error(error));
        }
      }
    }

    function onLanguageTabChange(newLanguage: Language) {
      setSelectedLanguage(newLanguage);
    }

    function getEditors() {
      const languageNames = Object.keys(languages) as Array<Language>;
      const length = languageNames.length;
      if (length === 0) {
        throw new Error('At least one language is required.');
      }

      if (length === 1) {
        const language = languageNames[0] ?? 'js';
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
          size={isPartOfSet ? 'sm' : 'lg'}
          defaultValue={selectedLanguage}
          onChange={(_event, newLanguage) => {
            if (!isLanguage(newLanguage)) {
              throw new Error('Unknown language');
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

    useImperativeHandle(
      ref,
      () => ({
        getSnippet: (language: Language) => getSnippet(language, state),
        getDocument: () => getDocument(state),
      }),
      [state]
    );

    return (
      <div
        className={classNames(
          'not-content',
          styles.className,
          isPartOfSet ? styles.noMargin : undefined
        )}
      >
        <JoyThemeProvider>
          {getEditors()}
          {preventRun ? null : (
            <CodeExecutor
              state={state}
              {...{ selectedLanguage, onResetEditors, onCodeAction }}
            />
          )}
        </JoyThemeProvider>
      </div>
    );
  }
);

function getFirstLanguage(languages: PlaygroundProps['languages']): Language {
  const languageNames = Object.keys(languages) as Array<Language>;
  const language = languageNames[0];
  if (!language) {
    throw new Error('At least one language is required.');
  }

  return language;
}

function getInitialLanguageState(
  id: string,
  languages: PlaygroundProps['languages'],
  onBeforeRunCode?: OnBeforeRunCode
): LanguageState {
  return (
    Object.entries(languages) as Array<[Language, string]>
  ).reduce<LanguageState>((accumulator, [language, script]) => {
    if (language === 'js') {
      // Remove triple-slash comments
      script = script.replaceAll(/^\s*\/{3}(.+?)(\r?\n)/gm, '');

      // Remove eslint-ignore comments
      script = script.replaceAll(
        /^\s*\/\/ eslint-disable-next-line(.+?)(\r?\n)/gm,
        ''
      );

      script = script.replaceAll(/^\/\* eslint-disable(.+?)\*\/(\r?\n)/gm, '');
    }

    const split = script.split('// ___Begin visible code snippet___');
    const header = split.length === 2 ? (split[0]?.trim() ?? '') : '';
    const initialEditorValue =
      (split.length === 2 ? split[1] : split[0])?.trim() ?? '';
    const executorValue = `${header}\n\n${initialEditorValue}`;

    accumulator[language] = {
      header,
      initialEditorValue,
      getExecutorValue: () =>
        onBeforeRunCode
          ? onBeforeRunCode(id, language, executorValue)
          : executorValue,
    };
    return accumulator;
  }, {} as LanguageState);
}

Playground.displayName = 'Playground';
export default Playground;
