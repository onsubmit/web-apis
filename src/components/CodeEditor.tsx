import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useCodeMirror, type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

type CodeEditorProps = {
  script: string;
  theme: "light" | "dark";
  onChange: (newValue: string) => void;
};
const CodeEditor = forwardRef<ReactCodeMirrorRef, CodeEditorProps>(
  ({ script, theme, onChange }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);

    const { state, container, setContainer, view } = useCodeMirror({
      container: editorRef.current,
      theme: theme === "light" ? vscodeLight : vscodeDark,
      extensions: [javascript(), EditorView.lineWrapping],
      value: script.trim(),
      onChange,
      basicSetup: {
        lineNumbers: false,
        foldGutter: false,
        highlightSelectionMatches: true,
      },
    });

    useImperativeHandle(ref, () => ({ editor: editorRef.current, state, view }), [
      editorRef,
      container,
      state,
      view,
    ]);

    useEffect(() => {
      if (editorRef.current) {
        setContainer(editorRef.current);
      }
    }, [editorRef.current]);

    return <div ref={editorRef} />;
  }
);

export default CodeEditor;
