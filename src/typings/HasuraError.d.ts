interface HasuraError {
  response?: {
    data?: {
      errors?: Array<{message: string}>;
      error?: string;
      message?: string;
      code?: string;
      path?: string;
      extensions?: Record<string, unknown>;
    };
    status?: number;
  };
  message?: string;
}
