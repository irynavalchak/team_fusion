import {NextResponse, NextRequest} from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || '';

export async function GET(request: NextRequest) {
  try {
    const {searchParams} = new URL(request.url);

    const organization_id = searchParams.get('organization_id');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');

    if (!organization_id) {
      return NextResponse.json({error: 'organization_id is required'}, {status: 400});
    }

    if (!start_date) {
      return NextResponse.json({error: 'start_date is required'}, {status: 400});
    }

    if (!end_date) {
      return NextResponse.json({error: 'end_date is required'}, {status: 400});
    }

    const response = await axios.get(`${API_BASE_URL}/api/rest/transactions`, {
      headers: {
        'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
      },
      params: {
        organization_id,
        start_date,
        end_date
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
