import {NextResponse} from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  let filePath = searchParams.get('path');

  if (!filePath) {
    return NextResponse.json({error: 'No file path provided'}, {status: 400});
  }

  // Remove leading slash if present
  filePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;

  // Construct the full path, ensuring we're within the 'documents' directory
  const fullPath = path.join(process.cwd(), 'public', 'documents', filePath);

  // Ensure the requested file is within the 'documents' directory
  const documentsDir = path.join(process.cwd(), 'public', 'documents');
  if (!fullPath.startsWith(documentsDir)) {
    return NextResponse.json({error: 'Invalid file path'}, {status: 403});
  }

  try {
    const content = await fs.readFile(fullPath, 'utf-8');
    return NextResponse.json({content});
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json({error: 'File not found'}, {status: 404});
  }
}
