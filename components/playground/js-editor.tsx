'use client';

import Editor, {
  Monaco,
  IStandaloneCodeEditor,
  IMarker,
} from '@monaco-editor/react';
import {
  constrainedEditor,
  RangeRestrictionObject,
} from 'constrained-editor-plugin';
import debounce from 'lodash.debounce';
import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { TextFile } from '@/lib/types';
import { useDocumentsStore } from '@/store/documents-store-provider';

function getOpeningRange(code: string): [number, number, number, number] {
  /** range of `function generateDocument() {` */
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

export function JSEditor({
  name,
  defaultValue,
  declarationFiles,
  errorMessage,
}: {
  name: string;
  defaultValue: string;
  declarationFiles: TextFile[];
  errorMessage: string;
}) {
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco>(null);
  const { resolvedTheme } = useTheme();
  const { saveDocument, closeDocument } = useDocumentsStore((state) => state);
  const debouncedSaveDocumentRef = useRef(debounce(saveDocument, 300));

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
  }

  function handleEditorValidation(markers: IMarker[]) {
    markers.forEach((marker) => {
      console.debug(`onValidate.marker`, marker);
    });
  }

  // display error message
  useEffect(() => {
    // see: https://microsoft.github.io/monaco-editor/playground.html?source=v0.52.2#example-interacting-with-the-editor-rendering-glyphs-in-the-margin
    const monaco = monacoRef?.current;
    const editor = editorRef?.current;
    const model = editor?.getModel();
    if (monaco && editor && model) {
      const where: string = `start`; // start | end | all
      let range: [number, number, number, number];
      if (where === `start`) {
        range = getOpeningRange(defaultValue);
      } else if (where === `end`) {
        range = getClosingRange(defaultValue);
        range[2] = range[0];
        range[3] = range[1];
        range[1] = 1;
      } else {
        const sRange = getOpeningRange(defaultValue);
        const eRange = getClosingRange(defaultValue);
        range = [sRange[0] + 1, 1, eRange[0], eRange[1]];
      }
      // check range is valid
      if (range.includes(-1)) {
        range = [1, 1, 1, 1]; // default to first line
      }
      monaco.editor.setModelMarkers(model, name, [
        {
          startLineNumber: range[0],
          startColumn: range[1],
          endLineNumber: range[2],
          endColumn: range[3],
          message: errorMessage,
          severity: monaco.MarkerSeverity.Error,
          code: 'docx-editor',
        },
      ]);
    }
  }, [errorMessage]);

  return (
    <>
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
          if (value) debouncedSaveDocumentRef.current(name, value);
        }}
      />
    </>
  );
}
