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
import React, { useRef } from 'react';
import { useTheme } from 'next-themes';
import { TextFile } from '@/lib/types';
import { useDocumentsStore } from '@/store/documents-store-provider';

function getFunctionRange(code: string): [number, number, number, number] {
  // startLineNumber, startColumn, endLineNumber, endColumn
  const result = [-1, -1, -1, -1];
  const lines = code.split('\n');
  for (let i = 1; i <= lines.length; i++) {
    const line = lines[i - 1];
    if (line.startsWith('function')) {
      result[0] = i;
      result[1] = line.length + 1;
      break;
    }
  }
  // iterate from the last line
  for (let i = lines.length; i >= 1; i--) {
    const line = lines[i - 1];
    if (line.startsWith('}')) {
      const previousLine = lines[i - 2];
      result[2] = i - 1;
      result[3] = previousLine.length + 1;
      break;
    }
  }
  console.debug(`getFunctionRange => result`, result, code);
  return result as [number, number, number, number];
}

export function JSEditor({
  name,
  defaultValue,
  declarationFiles,
}: {
  name: string;
  defaultValue: string;
  declarationFiles: TextFile[];
}) {
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco>(null);
  const { resolvedTheme } = useTheme();
  const { saveDocument, closeDocument } = useDocumentsStore((state) => state);
  const debouncedSaveDocumentRef = useRef(debounce(saveDocument, 300));

  function handleEditorWillMount(monaco: Monaco) {
    // do something before editor is mounted
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
    const constrainedMonaco = constrainedEditor(monaco);
    const model = editor.getModel();
    constrainedMonaco.initializeIn(editor);
    const restrictions: RangeRestrictionObject[] = [
      {
        range: getFunctionRange(defaultValue),
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
    console.log(`onValidate => markers`, markers);
    // model markers
    markers.forEach((marker) => {
      console.log(`marker`, marker);
      // display markers in the editor
      // editorRef.current?.deltaDecorations(
      //   [],
      //   [
      //     {
      //       range: new monacoRef.current.Range(
      //         marker.startLineNumber,
      //         marker.startColumn,
      //         marker.endLineNumber,
      //         marker.endColumn
      //       ),
      //       options: {
      //         isWholeLine: false,
      //         className: 'decoration-destructive! underline! decoration-wavy!',
      //         glyphMarginClassName: 'bg-red-400!',
      //       },
      //     },
      //   ]
      // );
    });

    console.log(
      `modelMarkers`,
      editorRef.current?.getModel()?.getAllDecorations()
    );
  }

  return (
    <>
      <Editor
        height='90vh'
        defaultLanguage='javascript'
        theme={`vs-${resolvedTheme}`}
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
