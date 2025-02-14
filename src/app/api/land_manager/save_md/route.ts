import {NextResponse} from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  const {path: filePath, content} = await request.json();

  if (!filePath || content === undefined) {
    return NextResponse.json({error: 'Invalid request'}, {status: 400});
  }

  const fullPath = path.join(process.cwd(), 'public', 'land', filePath);

  try {
    await fs.writeFile(fullPath, content);
    return NextResponse.json({success: true});
  } catch (error) {
    console.log('POST request for save_md error:', error);
    return NextResponse.json({error: 'Failed to save file'}, {status: 500});
  }
}
