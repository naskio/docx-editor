import * as docx from 'docx';

const doc = new docx.Document({
  sections: [
    {
      headers: {
        default: new docx.Header({
          children: [
            new docx.Paragraph({
              alignment: docx.AlignmentType.RIGHT,
              children: [
                new docx.TextRun('My Title '),
                new docx.TextRun({
                  children: ['Page ', docx.PageNumber.CURRENT],
                }),
              ],
            }),
          ],
        }),
        first: new docx.Header({
          children: [
            new docx.Paragraph({
              alignment: docx.AlignmentType.RIGHT,
              children: [
                new docx.TextRun('First Page Header '),
                new docx.TextRun({
                  children: ['Page ', docx.PageNumber.CURRENT],
                }),
              ],
            }),
          ],
        }),
      },
      children: [
        new docx.Paragraph({
          children: [new docx.TextRun('First Page'), new docx.PageBreak()],
        }),
        new docx.Paragraph('Second Page'),
      ],
    },
    {
      properties: {
        page: {
          pageNumbers: {
            start: 1,
            separator: docx.PageNumberSeparator.EM_DASH,
          },
        },
      },
      headers: {
        default: new docx.Header({
          children: [
            new docx.Paragraph({
              alignment: docx.AlignmentType.RIGHT,
              children: [
                new docx.TextRun('My Title '),
                new docx.TextRun({
                  children: ['Page ', docx.PageNumber.CURRENT],
                }),
              ],
            }),
          ],
        }),
        first: new docx.Header({
          children: [
            new docx.Paragraph({
              alignment: docx.AlignmentType.RIGHT,
              children: [
                new docx.TextRun('First Page Header of Second section'),
                new docx.TextRun({
                  children: ['Page ', docx.PageNumber.CURRENT],
                }),
              ],
            }),
          ],
        }),
      },
      children: [
        new docx.Paragraph({
          children: [new docx.TextRun('Third Page'), new docx.PageBreak()],
        }),
        new docx.Paragraph('Fourth Page'),
      ],
    },
  ],
});

return doc;