import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";

type CodeEditorProps = {
  script: string;
  theme: "light" | "dark";
};

export default function CodeEditor({ script, theme }: CodeEditorProps) {
  return (
    <CodeMirror
      theme={theme === "light" ? vscodeLight : vscodeDark}
      value={script.trim()}
      extensions={[javascript()]}
      basicSetup={{
        lineNumbers: false,
        foldGutter: false,
      }}
    />
  );
}
