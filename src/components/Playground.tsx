import classNames from "classnames";
import { useCallback, useState } from "react";
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
  const header = split.length === 2 ? split[0] : "";
  const editorScript = split.length === 2 ? split[1] : split[0];

  const [value, setValue] = useState(header + editorScript.trim());
  const [theme, setTheme] = useState<StarlightTheme>(getInitialTheme());

  useStarlightTheme(setTheme);

  const onEditorChange = useCallback((newEditorScript: string) => {
    setValue((header + newEditorScript).trim());
  }, []);

  return (
    <div className={classNames("not-content", styles.className)}>
      <CodeEditor theme={theme} script={editorScript} onChange={onEditorChange} />
      <CodeExecutor script={value} />
    </div>
  );
}
