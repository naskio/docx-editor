import * as docx from 'docx';

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