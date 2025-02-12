'use server';

import fs from 'fs';
import path from 'path';

async function readMDFiles() {
  const publicDir = path.join(process.cwd(), 'public');
  const mdFiles = await fs.promises.readdir(publicDir);
  const mdContents = await Promise.all(
    mdFiles
      .filter(file => file.endsWith('.md'))
      .map(async file => {
        const filePath = path.join(publicDir, file);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        return `${file}:\n${content}\n\n`;
      })
  );
  return mdContents.join('');
}

export default async function MDReader() {
  const context = await readMDFiles();
  return context;
}
