import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  // Get the requested module from the query parameter
  const module = request.nextUrl.searchParams.get('module');
  
  if (!module) {
    return NextResponse.json(
      { error: 'Module parameter is required' },
      { status: 400 }
    );
  }
  
  try {
    // Construct the file path for the requested module
    const filePath = path.join(process.cwd(), 'src', 'content', 'yaml', `${module}.yaml`);
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `Translations for module '${module}' not found` },
        { status: 404 }
      );
    }
    
    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Return the content with the appropriate YAML content type
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'application/x-yaml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error(`Error serving translations for module ${module}:`, error);
    return NextResponse.json(
      { error: 'Failed to load translations' },
      { status: 500 }
    );
  }
} 