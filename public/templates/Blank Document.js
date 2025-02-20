import * as docx from 'docx'

/**
 * @returns {docx.Document}
 * @see https://docx.js.org/
 */
function generateDocument() {
  // Your code goes here
  const doc = new docx.Document({
    sections: [],
  });
  return doc;
}

export default generateDocument;