import {readMarkdownFile, writeMarkdownFile} from 'utils/fileSystem';
import {NextResponse} from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const filePath = searchParams.get('path');

  if (!filePath) {
    return NextResponse.json({error: 'No file path provided'}, {status: 400});
  }

  const fullPath = path.join(process.cwd(), 'public', filePath);

  try {
    const stats = await fs.stat(fullPath);

    if (stats.isFile()) {
      if (isImageFile(filePath)) {
        const imageBuffer = await fs.readFile(fullPath);
        const base64Image = imageBuffer.toString('base64');
        return NextResponse.json({content: base64Image, type: 'image'});
      } else {
        const content = await readMarkdownFile(fullPath);
        return NextResponse.json({content, type: 'markdown'});
      }
    } else {
      return NextResponse.json({error: 'Not a file'}, {status: 400});
    }
  } catch (error) {
    return NextResponse.json({error: 'File not found'}, {status: 404});
  }
}

export async function POST(request: Request) {
  const {path: filePath, content} = await request.json();

  if (!filePath || content === undefined) {
    return NextResponse.json({error: 'Invalid request'}, {status: 400});
  }

  const fullPath = path.join(process.cwd(), 'public', filePath);
  const success = await writeMarkdownFile(fullPath, content);

  if (!success) {
    return NextResponse.json({error: 'Failed to save file'}, {status: 500});
  }

  return NextResponse.json({success: true});
}

function isImageFile(filename: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}
