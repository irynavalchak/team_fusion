import {NextResponse} from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public/documents/documents.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const documents = JSON.parse(fileContents);

    return NextResponse.json({documents}, {status: 200});
  } catch (error) {
    console.error('Error reading documents data:', error);
    return NextResponse.json({message: 'Internal server error'}, {status: 500});
  }
}
