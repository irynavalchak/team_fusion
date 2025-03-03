import {NextRequest, NextResponse} from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || '';

export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const body: {
      title: string;
      tag_path: string;
      created_by: number | null;
      last_modified_by: number | null;
      draft: boolean;
    } = await request.json();

    const {title, tag_path, draft} = body;

    if (!title) {
      return NextResponse.json({error: 'Missing title field'}, {status: 400});
    }

    if (!tag_path) {
      return NextResponse.json({error: 'Missing tag_path field'}, {status: 400});
    }

    if (!draft) {
      return NextResponse.json({error: 'Missing draft field'}, {status: 400});
    }

    const response = await axios.post(`${API_BASE_URL}/api/rest/document`, body, {
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
      }
    });

    return NextResponse.json(response.data, {status: 200});
  } catch (err) {
    let errorMessage = 'An unknown error occurred';
    let statusCode = 500;

    // Type guard for HasuraError
    const isHasuraError = (error: unknown): error is HasuraError => {
      return typeof error === 'object' && error !== null && 'response' in error;
    };

    if (isHasuraError(err) && err.response?.data) {
      const hasuraError = err.response.data;
      errorMessage = hasuraError.errors?.[0]?.message || hasuraError.error || hasuraError.message || errorMessage;

      statusCode = err.response.status || statusCode;

      console.error('Hasura error details:', {
        message: errorMessage,
        code: hasuraError.code,
        path: hasuraError.path,
        extensions: hasuraError.extensions
      });
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: isHasuraError(err) ? err.response?.data : null,
        path: isHasuraError(err) ? err.response?.data?.path : null
      },
      {status: statusCode}
    );
  }
}
