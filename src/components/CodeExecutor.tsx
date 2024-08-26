import { useId, useRef } from "react";
import styles from "./CodeExecutor.module.css";

type CodeExecutorProps = {
  script: string;
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

function CodeExecutor({ script }: CodeExecutorProps) {
  const listId = useId();
  const listRef = useRef<HTMLUListElement>(null);

  function runCode() {
    if (listRef.current) {
      listRef.current.innerHTML = "";
    }

    executeScript(script, listId);
  }

  return (
    <div className={styles.className}>
      <button onClick={runCode}>Run code</button>
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
    (m) => `${m}: (message) => _console._log("${m}", message, "${consoleMethodClassMap[m]}")`
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
      console[method](message);
    },
    ${consoleOverrides.join(",\n")}
  }
${replaceConsoleMethods(wrapInTryCatch(script), listId)}
})();
`;
}

export { CodeExecutor };
