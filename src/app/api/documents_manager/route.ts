import {NextResponse} from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const filePath = searchParams.get('path');

  if (!filePath) {
    return NextResponse.json({error: 'No file path provided'}, {status: 400});
  }

  const fullPath = path.join(process.cwd(), 'public', 'documents', filePath);

  try {
    const content = await fs.readFile(fullPath, 'utf-8');
    return NextResponse.json({content});
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json({error: 'File not found'}, {status: 404});
  }
}
