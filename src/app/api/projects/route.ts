import { NextResponse } from 'next/server';
import axios from 'axios';
import { ProjectModel, ProjectsResponse } from '@/typings/project';

const API_BASE_URL = process.env.API_BASE_URL || '';

export const revalidate = 0;

export async function GET() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/rest/projects`, {
      headers: {
        'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
      }
    });

    // Validate response data structure
    if (!response.data) {
      return NextResponse.json(
        {
          error: 'Invalid API response: Response data is undefined',
          details: null,
          path: '/api/projects'
        },
        { status: 500 }
      );
    }

    const data = response.data as ProjectsResponse;
    
    // Validate projects array exists and is not empty
    if (!data.projects || !Array.isArray(data.projects) || data.projects.length === 0) {
      return NextResponse.json(
        {
          error: 'Invalid API response: Projects array is missing or empty',
          details: data,
          path: '/api/projects'
        },
        { status: 500 }
      );
    }

    // Map and validate each project
    const projects = data.projects.map((project: ProjectModel) => {
      // Validate required project fields
      if (!project.id || !project.project_code || !project.label_en) {
        console.warn('Invalid project data:', project);
      }

      return {
        id: project.id,
        project_code: project.project_code,
        label_en: project.label_en,
        label_ru: project.label_ru || project.label_en, // Fallback to English if Russian is missing
        label_th: project.label_th || project.label_en  // Fallback to English if Thai is missing
      };
    });

    return NextResponse.json({ projects }, { status: 200 });
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
      { status: statusCode }
    );
  }
}
