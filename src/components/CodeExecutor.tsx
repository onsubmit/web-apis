import { useId, useRef, useState } from "react";
import styles from "./CodeExecutor.module.css";

type CodeExecutorProps = {
  script: string;
};

function CodeExecutor({ script }: CodeExecutorProps) {
  const listId = useId();
  const listRef = useRef<HTMLUListElement>(null);

  function runCode() {
    if (listRef.current) {
      listRef.current.innerHTML = '';
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

function replaceConsoleLogs(script: string, listId: string) {
  return (
    `const list = document.getElementById('${listId}');\n` +
    `let li = null;\n` +
    script.replaceAll(
      /console.log\((?<LOG>.+?)\);/g,
      `
li = document.createElement("li");
li.textContent = $<LOG>;
list.appendChild(li);
`
    )
  );
}

function wrapInTryCatch(script: string) {
  return `try { ${script} } catch (e) { console.log(e); }`;
}

function executeScript(script: string, listId: string) {
  eval(getExecutableScript(script, listId));
}

function getExecutableScript(script: string, listId: string): string {
  return `(async () => { ${replaceConsoleLogs(wrapInTryCatch(script), listId)} })()`;
}

export { CodeExecutor };
