import { useId, useState } from "react";
import styles from "./CodeExecutor.module.css";

type CodeExecutorProps = {
  script: string;
};

function CodeExecutor({ script }: CodeExecutorProps) {
  const listId = useId();
  const [codeExecuted, setCodeExecuted] = useState(false);

  function handleClick() {
    executeScript(script, listId);
    setCodeExecuted(true);
  }

  return (
    <div className={styles.className}>
      {codeExecuted ? null : <button onClick={handleClick}>Run code</button>}
      <ul id={listId}></ul>
    </div>
  );
}

function replaceConsoleLogs(script: string, listId: string) {
  return (
    `const list = document.getElementById('${listId}');\n` +
    script.replaceAll(
      /console.log\((?<LOG>.+?)\);/g,
      `
const li = document.createElement("li");
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
