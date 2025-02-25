import fs from 'fs/promises';
import path from 'path';

export interface DirectoryStructure {
  [key: string]: DirectoryStructure | string[];
}

export async function getLandDirectoryStructure(dir: string): Promise<DirectoryStructure> {
  const structure: DirectoryStructure = {};

  async function readDir(currentPath: string) {
    const items = await fs.readdir(currentPath, {withFileTypes: true});

    for (const item of items) {
      const itemPath = path.join(currentPath, item.name);

      if (item.isDirectory()) {
        structure[item.name] = await getLandDirectoryStructure(itemPath);
      } else if (item.name.endsWith('.md') || isImageFile(item.name)) {
        if (!structure['files']) structure['files'] = [];
        if (Array.isArray(structure['files'])) {
          structure['files'].push(item.name);
        }
      }
    }
  }

  await readDir(dir);
  return structure;
}

function isImageFile(filename: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}

export async function writeMarkdownFile(filePath: string, content: string) {
  try {
    await fs.writeFile(filePath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing file:', error);
    return false;
  }
}
