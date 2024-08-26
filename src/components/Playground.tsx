import classNames from "classnames";
import { useCallback, useState } from "react";
import CodeEditor from "./CodeEditor";
import { CodeExecutor } from "./CodeExecutor";
import styles from "./Playground.module.css";

type PlaygroundProps = {
  script: string;
  theme: "light" | "dark";
};

export default function Playground({ script, theme }: PlaygroundProps) {
  const [value, setValue] = useState(script.trim());

  const onScriptChange = useCallback((newValue: string) => {
    setValue(newValue.trim());
  }, []);

  return (
    <div className={classNames("not-content", styles.className)}>
      <CodeEditor theme={theme} script={script} onChange={onScriptChange} />
      <CodeExecutor script={value} />
    </div>
  );
}
