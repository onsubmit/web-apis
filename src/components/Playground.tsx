import CodeEditor from "./CodeEditor";
import { CodeExecutor } from "./CodeExecutor";

type PlaygroundProps = {
  script: string;
  theme: "light" | "dark";
};

export default function Playground({ script, theme }: PlaygroundProps) {
  return (
    <>
      <CodeEditor theme={theme} script={script} />
      <CodeExecutor script={script} />
    </>
  );
}
