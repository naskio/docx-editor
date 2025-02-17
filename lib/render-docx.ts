// aka docxjs
import * as docx_preview from 'docx-preview';
// aka mammoth.js
import mammoth from 'mammoth';
import { env } from '@/lib/env';
import type { Settings } from '@/lib/types';

async function renderWithDocxJS(blob: Blob) {
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

async function renderWithMammothJS(blob: Blob) {
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

async function renderWithGoogleDocs(blob: Blob) {
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

async function renderWithMicrosoftOffice(blob: Blob) {
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

export async function renderDocx(
  name: string,
  blob: Blob,
  library: Settings['renderingLibrary']
) {
  const renderer: Record<
    Settings['renderingLibrary'],
    (blob: Blob) => Promise<HTMLIFrameElement>
  > = {
    docxjs: renderWithDocxJS,
    'mammoth.js': renderWithMammothJS,
    'Google Docs': renderWithGoogleDocs,
    Office: renderWithMicrosoftOffice,
  };
  return renderer[library](blob)
    .then((iframeEl) => {
      return { status: 'success', name, payload: iframeEl };
    })
    .catch((error) => {
      return { status: 'error', name, payload: error };
    });
}
