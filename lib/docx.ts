'use client';

import * as docx from 'docx';
import * as docx_preview from 'docx-preview'; // aka docxjs
import mammoth from 'mammoth';
import { env } from '@/lib/env'; // aka mammoth.js

// TODO: handle errors

export function buildDocument(content: string): docx.Document {
  const trimmed = content.trim();
  const codeWithoutFirstLine = trimmed.split('\n').slice(1).join('\n');
  const codeSandboxed = `"use strict";\n${codeWithoutFirstLine}`;
  const userFunction = new Function('docx', codeSandboxed);
  return userFunction(docx) as docx.Document;
}

export async function documentToBlob(doc: docx.Document) {
  return docx.Packer.toBlob(doc);
}

export async function renderWithDocxJS(blob: Blob) {
  const bodyEl = document.createElement('body');
  const headEl = document.createElement('head');
  // render using DocxJS
  await docx_preview.renderAsync(blob, bodyEl, headEl, {
    inWrapper: true,
  }); // will appendChild div to bodyEl and append multiple style elements to headEl
  // override some styles
  const overrideStyleEl = document.createElement('link');
  overrideStyleEl.rel = 'stylesheet';
  overrideStyleEl.href = `${env.basePath}/css/preview/docxjs.css`;
  headEl.appendChild(overrideStyleEl);
  // create html element
  const htmlEl = document.createElement('html');
  htmlEl.appendChild(headEl);
  htmlEl.appendChild(bodyEl);
  // create iframe element
  const iframeEl = document.createElement('iframe');
  iframeEl.srcdoc = htmlEl.outerHTML;
  return iframeEl;
}

export async function renderWithMammothJS(blob: Blob) {
  const result = await mammoth.convertToHtml({
    arrayBuffer: await blob.arrayBuffer(),
  });
  // create body element
  const bodyEl = document.createElement('body');
  bodyEl.innerHTML = result.value;
  // create head element
  const headEl = document.createElement('head');
  // override some styles
  const overrideStyleEl = document.createElement('link');
  overrideStyleEl.rel = 'stylesheet';
  overrideStyleEl.href = `${env.basePath}/css/preview/mammoth.css`;
  headEl.appendChild(overrideStyleEl);
  // create html element
  const htmlEl = document.createElement('html');
  htmlEl.appendChild(headEl);
  htmlEl.appendChild(bodyEl);
  // create iframe element
  const iframeEl = document.createElement('iframe');
  iframeEl.srcdoc = htmlEl.outerHTML;
  return iframeEl;
}

export async function renderWithGoogleDocs(blob: Blob) {
  // TODO: upload blob first to the server then generate URL
  const url = new URL(`https://docs.google.com/gview`); // ?embedded=true&url=
  url.searchParams.append('embedded', 'true');
  console.debug(`using sample url instead of blob`, blob.type);
  url.searchParams.append(
    'url',
    `https://calibre-ebook.com/downloads/demos/demo.docx?__version__=${new Date().getTime()}` // to prevent caching
  );
  const iframeEl = document.createElement('iframe');
  iframeEl.src = url.toString();
  return iframeEl;
}

export async function renderWithMicrosoftOffice(blob: Blob) {
  // TODO: upload blob first to the server then generate URL
  const url = new URL(`https://view.officeapps.live.com/op/embed.aspx`); // ?src=
  console.debug(`using sample url instead of blob`, blob.type);
  url.searchParams.append(
    'src',
    `https://calibre-ebook.com/downloads/demos/demo.docx`
  );
  const iframeEl = document.createElement('iframe');
  iframeEl.src = url.toString();
  return iframeEl;
}
