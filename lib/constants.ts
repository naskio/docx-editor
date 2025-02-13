export type Template = {
  title: string;
  code: string;
};

export const templates: Template[] = [
  {
    title: `Blank Document`,
    code: `import * as docx from "docx";\nconst doc = new Document({});\n`,
  },
  {
    title: `Hello World`,
    code: `import * as docx from "docx";
const doc = new Document({
    sections: [
        {
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun("Hello World"),
                    ],
                }),
            ],
        },
    ],
});\n`,
  },
];

export const isMac =
  typeof window !== 'undefined'
    ? navigator.userAgent.toUpperCase().indexOf('MAC') >= 0
    : false;
