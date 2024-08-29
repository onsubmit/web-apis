import classNames from "classnames";
import { useId, useRef, useState } from "react";
import useStarlightTheme, {
  getInitialTheme,
  type StarlightTheme,
} from "src/hooks/useStarlightTheme";
import styles from "./CodeExecutor.module.css";
import type { LanguageState } from "./Playground";

type CodeExecutorProps = {
  state: LanguageState;
  onResetEditors: () => void;
};

const supportedConsoleMethods = ["log", "warn", "error", "debug"] as const;
type SupportedConsoleMethod = (typeof supportedConsoleMethods)[number];
const consoleMethodClassMap: Record<SupportedConsoleMethod, string> = {
  log: "",
  warn: styles.warn,
  error: styles.error,
  debug: styles.debug,
};

const supportedConsoleMethodsRegExStr = supportedConsoleMethods.join("|");

function CodeExecutor({ state, onResetEditors }: CodeExecutorProps) {
  const listId = useId();
  const htmlAreaId = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const htmlAreaRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<StarlightTheme>(getInitialTheme());

  useStarlightTheme(setTheme);

  function resetConsole() {
    if (listRef.current) {
      listRef.current.innerHTML = "";
    }
  }

  function resetHtmlArea() {
    if (htmlAreaRef.current) {
      htmlAreaRef.current.innerHTML = "";
    }
  }

  function runCode() {
    resetConsole();

    if (htmlAreaRef.current) {
      htmlAreaRef.current.innerHTML = `<style>${state.css.executorValue!}</style>${state.html.executorValue!}`;
    }

    executeScript(state.js.executorValue!, listId);
  }

  function resetCode() {
    resetConsole();
    resetHtmlArea();
    onResetEditors();
  }

  return (
    <div className={classNames(styles.className, theme === "dark" ? styles.dark : styles.light)}>
      <div className={styles.buttons}>
        <button onClick={runCode}>Run code</button>
        <button onClick={resetCode}>Reset code</button>
      </div>
      <div ref={htmlAreaRef} id={htmlAreaId}></div>
      <ul ref={listRef} id={listId}></ul>
    </div>
  );
}

function replaceConsoleMethods(script: string, listId: string) {
  function replacer(_match: string, method: string, message: string) {
    return `_console.${method}(${message})`;
  }

  const regex = new RegExp(
    `console.(?<METHOD>${supportedConsoleMethodsRegExStr})\((?<LOG>.+?)\);`,
    "g"
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
    (m) => `    ${m}: (message) => _console._log("${m}", message, "${consoleMethodClassMap[m]}")`
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
${consoleOverrides.join(",\n")}
  }
${replaceConsoleMethods(wrapInTryCatch(script), listId)}
})();
`;
}

export { CodeExecutor };
