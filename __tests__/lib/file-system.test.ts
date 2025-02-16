import { loadTextFile, loadTextFiles } from '@/lib/file-system';

describe('loadTextFile', () => {
  it('should load a JSON file', () => {
    const textFile = loadTextFile('package.json');
    expect(textFile.name).toBe('package.json');
    expect(textFile.type).toBe('application/json');
    expect(textFile.text).toContain('dependencies');
  });
  it('should load a file in a sub directory', () => {
    const textFile = loadTextFile('lib/file-system.ts');
    expect(textFile.name).toBe('file-system.ts');
    expect(textFile.type).toBe('application/typescript');
    expect(textFile.text).toContain('loadTextFile');
  });
});

describe('loadTextFiles', () => {
  it('should load all TypeScript files in the lib directory', () => {
    const textFiles = loadTextFiles('*.ts', 'lib', true);
    console.log(textFiles);
    expect(textFiles.length).toBeGreaterThan(2);
    expect(textFiles.map((f) => f.name)).toContain('file-system');
  });
});
