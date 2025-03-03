import {NextRequest, NextResponse} from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || '';

export const revalidate = 0;

export async function DELETE(request: NextRequest) {
  try {
    const body: {id: number} = await request.json();

    const {id} = body;

    if (!id) {
      return NextResponse.json({error: 'Missing id field'}, {status: 400});
    }

    const response = await axios.delete(`${API_BASE_URL}/api/rest/document_content`, {
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
      },
      data: body
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
