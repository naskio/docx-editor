/**
 * The worker receives a message with the user's code and returns a message with the Blob or an error.
 * We use a Web Worker to run the user's code in a separate thread and avoid blocking the main thread.
 */
import { buildDocx } from '@/lib/build-docx';

self.onmessage = (event: MessageEvent<{ name: string; text: string }>) => {
  const { name, text } = event.data;
  buildDocx(text)
    .then((blob) => {
      self.postMessage({ status: 'success', name, payload: blob });
    })
    .catch((error) => {
      self.postMessage({ status: 'error', name, payload: error });
    });
};
