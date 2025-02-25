import {NextResponse} from 'next/server';

export async function POST(request: Request) {
  const {id, language_code, content, last_modified_by} = await request.json();

  if (!id || !language_code || content === undefined || !last_modified_by) {
    return NextResponse.json({error: 'Invalid request'}, {status: 400});
  }

  return NextResponse.json({success: true});
}
