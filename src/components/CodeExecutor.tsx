import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CssIcon from '@mui/icons-material/Css';
import HtmlIcon from '@mui/icons-material/Html';
import JavascriptIcon from '@mui/icons-material/Javascript';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import ReplayIcon from '@mui/icons-material/Replay';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import classNames from 'classnames';
import { useId, useRef, useState } from 'react';
import useStarlightTheme, {
  getInitialTheme,
  type Theme,
} from 'src/hooks/useStarlightTheme';
import type { Language } from 'src/utils/language';

import CodeActionSplitButton, {
  type CodeActionFn,
} from './CodeActionSplitButton';
import styles from './CodeExecutor.module.css';
import type { LanguageState } from './Playground';

const languageIconMap: Record<Language, React.ReactNode> = {
  js: <JavascriptIcon />,
  html: <HtmlIcon />,
  css: <CssIcon />,
};

type CodeExecutorProps = {
  state: Partial<LanguageState>;
  selectedLanguage: Language;
  onResetEditors: () => void;
  onCodeAction: CodeActionFn;
  preventRun?: boolean;
};

const supportedConsoleMethods = ['log', 'warn', 'error', 'debug'] as const;
type SupportedConsoleMethod = (typeof supportedConsoleMethods)[number];
const consoleMethodClassMap: Record<
  SupportedConsoleMethod,
  string | undefined
> = {
  log: '',
  warn: styles.warn,
  error: styles.error,
  debug: styles.debug,
};

const supportedConsoleMethodsRegExStr = supportedConsoleMethods.join('|');

function CodeExecutor({
  state: { js, html, css },
  selectedLanguage,
  onResetEditors,
  onCodeAction,
  preventRun,
}: CodeExecutorProps) {
  const listId = useId();
  const htmlAreaId = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const htmlAreaRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<Theme>(getInitialTheme());

  useStarlightTheme(setTheme);

  function resetConsole() {
    if (listRef.current) {
      listRef.current.innerHTML = '';
    }
  }

  function resetHtmlArea() {
    if (htmlAreaRef.current) {
      htmlAreaRef.current.innerHTML = '';
      htmlAreaRef.current.style.display = 'none';
    }
  }

  function runCode() {
    resetConsole();

    if (htmlAreaRef.current) {
      let innerHTML = '';
      if (html?.getExecutorValue()) {
        if (css?.getExecutorValue()) {
          // The @scope CSS at-rule doesn't work in Firefox yet.
          // https://bugzilla.mozilla.org/show_bug.cgi?id=1830512
          innerHTML += `<style>${scopeCss(css.getExecutorValue(), htmlAreaId)}</style>`;
        }

        innerHTML += html.getExecutorValue();
      }
      htmlAreaRef.current.innerHTML = innerHTML;
      htmlAreaRef.current.style.display = 'block';
    }

    const jsExecutorValue = js?.getExecutorValue();
    if (jsExecutorValue) {
      executeScript(jsExecutorValue, listId);
    }
  }

  function resetCode() {
    resetConsole();
    resetHtmlArea();
    onResetEditors();
  }

  return (
    <div
      className={classNames(
        styles.className,
        theme === 'dark' ? styles.dark : styles.light
      )}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          {preventRun ? null : (
            <Button onClick={runCode} startDecorator={<KeyboardArrowRight />}>
              Run
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <CodeActionSplitButton
            action="Copy"
            onCodeAction={onCodeAction}
            actionIcon={<ContentCopyIcon />}
            snippetIcon={languageIconMap[selectedLanguage]}
          />
          <IconButton
            onClick={resetCode}
            variant="soft"
            color="warning"
            aria-label="Reset code"
            title="Reset"
          >
            <ReplayIcon />
          </IconButton>
        </Box>
      </Box>
      <div ref={htmlAreaRef} id={htmlAreaId} className={styles.htmlArea}></div>
      <ul ref={listRef} id={listId}></ul>
    </div>
  );
}

function replaceConsoleMethods(script: string) {
  function replacer(_match: string, method: string, message: string) {
    return `_console.${method}(${message})`;
  }

  const regex = new RegExp(
    `console.(?<METHOD>${supportedConsoleMethodsRegExStr})[(](?<LOG>.+?)[)]`,
    'g'
  );
  return script.replaceAll(regex, replacer);
}

function wrapInTryCatch(script: string) {
  return `
try {
debugger;
${script}
} catch (e) {
 console.error(e);
}`;
}

function executeScript(script: string, listId: string) {
  const executableScript = getExecutableScript(script, listId);
  eval(executableScript);
}

function getExecutableScript(script: string, listId: string): string {
  const consoleOverrides = supportedConsoleMethods.map(
    (m) =>
      `    ${m}: (message) => _console._log("${m}", message, "${consoleMethodClassMap[m]}")`
  );

  return `
(async () => {
  const list = document.getElementById('${listId}');
  const _console = {
    _log: (method, message, className) => {
      const li = document.createElement("li");
      li.textContent = message;
      className && li.classList.add(className);
      list.appendChild(li);
      list.scrollTop = list.scrollHeight;
      console[method](message);
    },
${consoleOverrides.join(',\n')}
  }
${replaceConsoleMethods(wrapInTryCatch(script))}
})();
`;
}

function scopeCss(css: string, htmlAreaId: string) {
  // useId() generates ids with colons that need to be escaped for the CSS selector.
  const id = htmlAreaId.replaceAll(':', '\\:');
  return `#${id} { ${css} }`;
}

export { CodeExecutor };
