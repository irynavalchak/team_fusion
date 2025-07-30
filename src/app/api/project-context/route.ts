import {NextResponse, NextRequest} from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || '';

interface HasuraError {
  response?: {
    data: {
      errors?: Array<{message: string}>;
      error?: string;
      message?: string;
      code?: string;
      path?: string;
      extensions?: any;
    };
    status?: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const {searchParams} = new URL(request.url);
    const project_id = searchParams.get('project_id');

    if (!project_id) {
      return NextResponse.json({error: 'project_id parameter is required'}, {status: 400});
    }

    // Validate that project_id is a valid integer
    const projectIdInt = parseInt(project_id, 10);
    if (isNaN(projectIdInt)) {
      return NextResponse.json({error: 'project_id must be a valid integer'}, {status: 400});
    }

    const response = await axios.get(`${API_BASE_URL}/api/rest/project-context-blocks/${projectIdInt}`, {
      headers: {
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {project_id, path, content, title, updated_by} = body;

    // Validate required fields
    if (!project_id) {
      return NextResponse.json({error: 'project_id is required'}, {status: 400});
    }

    if (!path) {
      return NextResponse.json({error: 'path is required'}, {status: 400});
    }

    // Validate that project_id is a valid integer
    const projectIdInt = parseInt(project_id, 10);
    if (isNaN(projectIdInt)) {
      return NextResponse.json({error: 'project_id must be a valid integer'}, {status: 400});
    }

    // Default content if empty
    const finalContent =
      content?.trim() || 'This context block is currently empty and will be updated with relevant information soon.';

    const response = await axios.post(
      `${API_BASE_URL}/api/rest/project-context-blocks`,
      {
        project_id: projectIdInt,
        path: path.trim(),
        content: finalContent,
        title: title?.trim() || null,
        updated_by: updated_by || null
      },
      {
        headers: {
          'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
          'Content-Type': 'application/json'
        }
      }
    );

    return NextResponse.json(response.data, {status: 201});
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
