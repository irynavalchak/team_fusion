import {NextResponse} from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const folderPath = searchParams.get('path');

  if (!folderPath) {
    return NextResponse.json({error: 'No folder path provided'}, {status: 400});
  }

  const fullPath = path.join(process.cwd(), 'public', 'land', folderPath);

  try {
    const files = await fs.readdir(fullPath, {withFileTypes: true});

    const mdFile = files.find(file => file.isFile() && file.name.endsWith('.md'));
    const imageFiles = files
      .filter(file => file.isFile() && /\.(jpg|jpeg|png|gif)$/i.test(file.name))
      .map(file => file.name);

    let mdContent = '';
    if (mdFile) {
      mdContent = await fs.readFile(path.join(fullPath, mdFile.name), 'utf-8');
    }

    //Find the directory 'photos'
    const photosDir = files.find(file => file.isDirectory() && file.name === 'photos');
    let photosImages: string[] = [];

    if (photosDir) {
      const photosPath = path.join(fullPath, 'photos');
      const photoFiles = await fs.readdir(photosPath);
      photosImages = photoFiles.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    }

    // Merging images from the root folder and folder 'photos'
    const allImages = [...imageFiles, ...photosImages.map(img => `photos/${img}`)];

    return NextResponse.json({mdContent, images: allImages});
  } catch (error) {
    console.error('Error reading folder content:', error);
    return NextResponse.json({error: 'Error reading folder content'}, {status: 500});
  }
}
