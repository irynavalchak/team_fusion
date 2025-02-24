import {NextResponse} from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public/testProjectsData/projects.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const projects = JSON.parse(fileContents);

    return NextResponse.json({projects}, {status: 200});
  } catch (error) {
    console.error('Error reading projects data:', error);
    return NextResponse.json({message: 'Internal server error'}, {status: 500});
  }
}
