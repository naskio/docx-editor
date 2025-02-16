import * as docx from 'docx'

/**
 * @returns {docx.Document}
 */
function generateDocument() {
  // Your code goes here
  const doc = new docx.Document({
    sections: [],
  });
  return doc;
}

export default generateDocument;