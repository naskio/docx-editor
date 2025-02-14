import path from 'node:path';
import fs from 'node:fs';
import type { TextFile } from '@/lib/types';

export function loadTemplates() {
  const templates: TextFile[] = [];
  const templatesFolderPath = path.join(process.cwd(), 'public', 'templates');
  if (!fs.existsSync(templatesFolderPath)) {
    return [];
  }
  const files = fs.readdirSync(templatesFolderPath);
  for (const file of files) {
    if (file.endsWith('.js')) {
      const filePath = path.join(templatesFolderPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const fileName = file.slice(0, -3);
      const stats = fs.statSync(filePath);
      templates.push({
        name: fileName,
        type: 'text/javascript',
        text: fileContent,
        atime: stats.atime,
        ctime: stats.ctime,
        mtime: stats.mtime,
      });
    }
  }
  return templates;
}
