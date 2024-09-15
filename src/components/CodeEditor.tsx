import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { LanguageSupport } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
import { type ReactCodeMirrorRef, useCodeMirror } from '@uiw/react-codemirror';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { Language } from 'src/utils/language';

type CodeEditorProps = {
  script: string;
  theme: 'light' | 'dark';
  language: Language;
  onChange: (newValue: string) => void;
};

const CodeEditor = forwardRef<ReactCodeMirrorRef, CodeEditorProps>(({ script, theme, language, onChange }, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const { state, setContainer, view } = useCodeMirror({
    container: editorRef.current,
    theme: theme === 'light' ? vscodeLight : vscodeDark,
    maxHeight: '600px',
    extensions: [getLanguageExtension(language), EditorView.lineWrapping],
    value: script.trim(),
    onChange,
    basicSetup: {
      lineNumbers: false,
      foldGutter: false,
      highlightSelectionMatches: true,
    },
  });

  useImperativeHandle(ref, () => ({ editor: editorRef.current, state, view }), [editorRef, state, view]);

  useEffect(() => {
    if (editorRef.current) {
      setContainer(editorRef.current);
    }
  }, [setContainer]);

  return <div ref={editorRef} />;
});

function getLanguageExtension(language: Language): LanguageSupport {
  switch (language) {
    case 'js':
      return javascript();
    case 'html':
      return html();
    case 'css':
      return css();
  }
}

CodeEditor.displayName = 'CodeEditor';
export default CodeEditor;
