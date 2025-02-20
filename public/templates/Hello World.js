import * as docx from 'docx';

/**
 * @returns {docx.Document}
 * @see https://docx.js.org/
 */
function generateDocument() {
  // Your code goes here
  const doc = new docx.Document({
    sections: [
      {
        properties: {},
        children: [
          new docx.Paragraph({
            children: [
              new docx.TextRun('Hello World'),
            ],
          }),
        ],
      },
    ],
  });
  return doc;
}

export default generateDocument;