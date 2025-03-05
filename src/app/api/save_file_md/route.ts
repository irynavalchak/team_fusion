import {NextResponse} from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  const {path: filePath, content, folder} = await request.json();

  if (!filePath || content === undefined || !folder) {
    return NextResponse.json({error: 'Invalid request'}, {status: 400});
  }

  const baseFolder = folder === 'land' ? 'land' : 'documents';

  const fullPath = path.join(process.cwd(), 'public', baseFolder, filePath);

  try {
    await fs.writeFile(fullPath, content);
    return NextResponse.json({success: true});
  } catch (error) {
    return NextResponse.json({error: 'Failed to save file'}, {status: 500});
  }
}
