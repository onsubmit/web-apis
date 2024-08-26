import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";

type CodeEditorProps = {
  script: string;
  theme: "light" | "dark";
  onChange: (newValue: string) => void;
};

export default function CodeEditor({ script, theme, onChange }: CodeEditorProps) {
  return (
    <CodeMirror
      theme={theme === "light" ? vscodeLight : vscodeDark}
      value={script.trim()}
      onChange={onChange}
      extensions={[javascript()]}
      basicSetup={{
        lineNumbers: false,
        foldGutter: false,
      }}
    />
  );
}
