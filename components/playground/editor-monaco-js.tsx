'use client';

import React, { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Editor, {
  IMarker,
  IStandaloneCodeEditor,
  Monaco,
} from '@monaco-editor/react';
import {
  RangeRestrictionObject,
  constrainedEditor,
} from 'constrained-editor-plugin';
import debounce from 'lodash.debounce';
import { useDocumentsStore } from '@/store/documents-store-provider';
import type { TextFile } from '@/lib/types';

function getOpeningRange(code: string): [number, number, number, number] {
  /** range of first line that starts with `function` */
  // startLineNumber, startColumn, endLineNumber, endColumn
  const result = [-1, -1, -1, -1];
  const lines = code.split('\n');
  for (let i = 1; i <= lines.length; i++) {
    const line = lines[i - 1];
    if (line.startsWith('function')) {
      result[0] = i;
      result[1] = 1;
      result[2] = i;
      result[3] = line.length + 1;
      break;
    }
  }
  return result as [number, number, number, number];
}

function getClosingRange(code: string): [number, number, number, number] {
  /** range of the last `}` */
  // startLineNumber, startColumn, endLineNumber, endColumn
  const result = [-1, -1, -1, -1];
  const lines = code.split('\n');
  // iterate from the last line
  for (let i = lines.length; i >= 1; i--) {
    const line = lines[i - 1];
    if (line.startsWith('}')) {
      const previousLine = lines[i - 2];
      result[0] = i - 1;
      result[1] = previousLine.length + 1;
      result[2] = i;
      result[3] = line.length + 1;
      break;
    }
  }
  return result as [number, number, number, number];
}

function reSyncErrorMarker(
  monaco: Monaco | null,
  editor: IStandaloneCodeEditor | null,
  fileName: string,
  errorMessage?: string
) {
  // see: https://microsoft.github.io/monaco-editor/playground.html?source=v0.52.2#example-interacting-with-the-editor-rendering-glyphs-in-the-margin
  const model = editor?.getModel();
  const currentValue = editor?.getValue() || ``;
  if (monaco && editor && model) {
    // if monaco, editor and model are ready
    const where: string = `start`; // start | end | all
    let range: [number, number, number, number];
    if (where === `start`) {
      // highlight only opening range
      range = getOpeningRange(currentValue);
    } else if (where === `end`) {
      // highlight only closing range
      range = getClosingRange(currentValue);
      range[2] = range[0];
      range[3] = range[1];
      range[1] = 1;
    } else {
      // highlight the whole function
      const sRange = getOpeningRange(currentValue);
      const eRange = getClosingRange(currentValue);
      range = [sRange[0] + 1, 1, eRange[0], eRange[1]];
    }
    // if range not valid, fallback to first line / first column
    if (range.includes(-1)) {
      range = [1, 1, 1, 1]; // default to first line
    }
    // add error marker if there is an error message and there is some code
    if (errorMessage && currentValue) {
      monaco.editor.setModelMarkers(model, fileName, [
        {
          startLineNumber: range[0],
          startColumn: range[1],
          endLineNumber: range[2],
          endColumn: range[3],
          message: errorMessage,
          severity: monaco.MarkerSeverity.Error,
          code: 'docx',
        },
      ]);
    } else {
      // remove error marker
      monaco.editor.setModelMarkers(model, fileName, []);
    }
  }
}

function EditorMonacoJS({
  name,
  defaultValue,
  declarationFiles,
  errorMessage,
  saveDocumentDebounceWait,
}: {
  name: string;
  defaultValue: string;
  declarationFiles: TextFile[];
  errorMessage?: string;
  saveDocumentDebounceWait: number;
}) {
  console.debug(
    `Render EditorMonacoJS (name: ${name}, errorMessage: ${errorMessage})`
  );
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco>(null);
  const { resolvedTheme } = useTheme();
  const saveDocument = useDocumentsStore((state) => state.saveDocument);
  const closeDocument = useDocumentsStore((state) => state.closeDocument);
  const debouncedSaveDocumentRef = useRef(
    debounce(saveDocument, saveDocumentDebounceWait)
  );

  // setup monaco editor syntax, type checking and IntelliSense
  function handleEditorWillMount(monaco: Monaco) {
    // do something before editor is mounted
    // see: https://monaco-react.surenatoyan.com/
    // and: https://microsoft.github.io/monaco-editor/
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false, // enable semantic validation
      noSyntaxValidation: false, // enable syntax validation
      diagnosticCodesToIgnore: [
        // ignore some diagnostics
        80004, // JSDoc types may be moved to TypeScript types.
        1108, // A 'return' statement can only be used within a function body.
      ],
    });
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES5, // target JavaScript ES5
      typeRoots: ['node_modules/@types'], // add type definitions from node_modules/@types
      lib: ['dom', 'es2015'], // add default type definitions
      allowNonTsExtensions: true, // allow non-TS files
      allowJs: true, // allow JavaScript files
      alwaysStrict: true, // enable strict mode
      noUnusedParameters: true, // always check for unused parameters
      noImplicitUseStrict: true, // don't allow 'use strict' (already enabled by 'alwaysStrict')
      noUnusedLocals: true, // always check for unused locals
    });
    // add IntelliSense for required external libraries => docx
    declarationFiles.forEach((file) => {
      monaco.languages.typescript.javascriptDefaults.addExtraLib(
        file.text,
        file.name
      );
    });
  }

  function handleEditorDidMount(editor: IStandaloneCodeEditor, monaco: Monaco) {
    console.debug(`EditorDidMount: (name: ${name})`);
    editorRef.current = editor;
    monacoRef.current = monaco;
    // allow edit only inside function generateDocument scope
    const openingRange = getOpeningRange(defaultValue);
    const closingRange = getClosingRange(defaultValue);
    if (!openingRange.includes(-1) && !closingRange.includes(-1)) {
      const constrainedMonaco = constrainedEditor(monaco);
      const model = editor.getModel();
      constrainedMonaco.initializeIn(editor);
      const restrictions: RangeRestrictionObject[] = [
        {
          range: [openingRange[0] + 1, 1, closingRange[0], closingRange[1]],
          allowMultiline: true,
          label: 'function__generateDocument',
        },
      ];
      // const constrainedModel =
      constrainedMonaco.addRestrictionsTo(model, restrictions);
      // constrainedModel?.toggleDevMode();
      // constrainedModel?.toggleHighlightOfEditableAreas({
      //   cssClassForSingleLine: `bg-yellow-100 dark:bg-yellow-900`,
      //   cssClassForMultiLine: `bg-yellow-100 dark:bg-yellow-900`,
      // });
    }
    // Cmd+S => save command
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      const currentValue = editor.getValue();
      if (currentValue) saveDocument(name, currentValue);
    });
    // Cmd+W => close command
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyW, () => {
      const currentValue = editor.getValue();
      if (currentValue) saveDocument(name, currentValue);
      closeDocument(name);
    });
    // Don't init the error marker here => cause a bug when we open multiple tabs (errorMessage shows in multiple tabs)
  }

  function handleEditorValidation(markers: IMarker[]) {
    void markers;
  }

  // reflect error message in the editor
  reSyncErrorMarker(monacoRef?.current, editorRef?.current, name, errorMessage);

  // cancel debounced saveDocument on unmount
  useEffect(() => {
    const debouncedSaveDocument = debouncedSaveDocumentRef?.current;
    return () => {
      // cleanup
      debouncedSaveDocument?.cancel();
      console.debug(`EditorWillUnMount: (name: ${name})`);
    };
  }, [name]);

  return (
    <Editor
      height='90vh'
      defaultLanguage='javascript'
      theme={`vs-${resolvedTheme}`}
      defaultPath={`${name}.js`}
      defaultValue={defaultValue}
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
      onValidate={handleEditorValidation}
      onChange={(value) => {
        // save document on change if there is a value
        if (value) debouncedSaveDocumentRef.current(name, value);
      }}
    />
  );
}

export const EditorMonacoJSMemoized = React.memo(
  EditorMonacoJS,
  (prev, next) => {
    return (
      prev.name === next.name &&
      // defaultValue shouldn't cause re-render because it's only used in the initial render
      // && prev.defaultValue === next.defaultValue
      prev.declarationFiles === next.declarationFiles &&
      prev.errorMessage === next.errorMessage &&
      prev.saveDocumentDebounceWait === next.saveDocumentDebounceWait
    );
  }
);
