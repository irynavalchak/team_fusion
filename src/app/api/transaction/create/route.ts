import {NextRequest, NextResponse} from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || '';

export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const body: TransactionModel = await request.json();

    const {
      account_id,
      category_id,
      amount,
      currency,
      description,
      organization_id,
      transaction_date,
      transaction_type
    } = body;

    if (!account_id) {
      return NextResponse.json({error: 'Missing account_id field'}, {status: 400});
    }

    if (!category_id) {
      return NextResponse.json({error: 'Missing category_id field'}, {status: 400});
    }

    if (!organization_id) {
      return NextResponse.json({error: 'Missing organization_id field'}, {status: 400});
    }

    if (!amount) {
      return NextResponse.json({error: 'Missing amount field'}, {status: 400});
    }

    if (!description) {
      return NextResponse.json({error: 'Missing description field'}, {status: 400});
    }

    if (!currency) {
      return NextResponse.json({error: 'Missing currency field'}, {status: 400});
    }

    if (!transaction_type) {
      return NextResponse.json({error: 'Missing transaction_type field'}, {status: 400});
    }

    if (!transaction_date) {
      return NextResponse.json({error: 'Missing transaction_date field'}, {status: 400});
    }

    const response = await axios.post(`${API_BASE_URL}/api/rest/transaction`, body, {
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
