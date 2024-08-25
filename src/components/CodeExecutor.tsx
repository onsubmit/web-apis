import { useId, useRef } from "react";
import styles from "./CodeExecutor.module.css";

type CodeExecutorProps = {
  script: string;
};

const consoleMethodClassMap: Record<string, string> = {
  log: "",
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
    const consoleClass = consoleMethodClassMap[method];
    return `
li = document.createElement("li");
li.textContent = ${message};
${consoleClass ? `li.classList.add("${consoleMethodClassMap[method]}");` : ""}
list.appendChild(li);
`;
  }

  return (
    `const list = document.getElementById('${listId}');\n` +
    `let li = null;\n` +
    script.replaceAll(/console.(?<METHOD>log|warn|error)\((?<LOG>.+?)\);/g, replacer)
  );
}

function wrapInTryCatch(script: string) {
  return `try { ${script} } catch (e) { console.error(e); }`;
}

function executeScript(script: string, listId: string) {
  const executableScript = getExecutableScript(script, listId);
  eval(executableScript);
}

function getExecutableScript(script: string, listId: string): string {
  return `(async () => { ${replaceConsoleMethods(wrapInTryCatch(script), listId)} })()`;
}

export { CodeExecutor };
