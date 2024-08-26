import { useId, useRef } from "react";
import styles from "./CodeExecutor.module.css";

type CodeExecutorProps = {
  script: string;
};

const consoleMethodClassMap: Record<string, string> = {
  warn: styles.warn,
  error: styles.error,
};

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

  return script.replaceAll(/console.(?<METHOD>log|warn|error)\((?<LOG>.+?)\);/g, replacer);
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
    log: (message) => _console._log("log", message),
    warn: (message) => _console._log("warn", message, "${consoleMethodClassMap.warn}"),
    error: (message) => _console._log("error", message, "${consoleMethodClassMap.error}"),
  }
${replaceConsoleMethods(wrapInTryCatch(script), listId)}
})()
`;
}

export { CodeExecutor };
