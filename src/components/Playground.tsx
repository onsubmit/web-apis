import classNames from "classnames";
import CodeEditor from "./CodeEditor";
import { CodeExecutor } from "./CodeExecutor";
import styles from "./Playground.module.css";

type PlaygroundProps = {
  script: string;
  theme: "light" | "dark";
};

export default function Playground({ script, theme }: PlaygroundProps) {
  return (
    <div className={classNames("not-content", styles.className)}>
      <CodeEditor theme={theme} script={script} />
      <CodeExecutor script={script} />
    </div>
  );
}
