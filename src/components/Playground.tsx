import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import classNames from "classnames";
import { useCallback, useRef, useState } from "react";
import useStarlightTheme, {
  getInitialTheme,
  type StarlightTheme,
} from "src/hooks/useStarlightTheme";
import CodeEditor from "./CodeEditor";
import { CodeExecutor } from "./CodeExecutor";
import styles from "./Playground.module.css";

type PlaygroundProps = {
  script: string;
};

export default function Playground({ script }: PlaygroundProps) {
  const split = script.split("// ___Begin visible code snippet___");
  const header = split.length === 2 ? split[0].trim() : "";
  const editorScript = (split.length === 2 ? split[1] : split[0]).trim();

  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const [executorValue, setExecutorValue] = useState(header + editorScript);
  const [theme, setTheme] = useState<StarlightTheme>(getInitialTheme());

  function onResetEditor() {
    const view = editorRef.current?.view;
    view?.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.toString().length,
        insert: editorScript,
      },
    });
    setExecutorValue(header + editorScript);
  }

  useStarlightTheme(setTheme);

  const onEditorChange = useCallback((newEditorScript: string) => {
    setExecutorValue((header + newEditorScript).trim());
  }, []);

  return (
    <div className={classNames("not-content", styles.className)}>
      <CodeEditor ref={editorRef} theme={theme} script={editorScript} onChange={onEditorChange} />
      <CodeExecutor script={executorValue} onResetEditor={onResetEditor} />
    </div>
  );
}
