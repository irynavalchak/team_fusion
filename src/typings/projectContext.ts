// Project Context Types based on new API schema
export interface ProjectContextBlockModel {
  content: string;
  created_at: string;
  id: string;
  path: string;
  project_id: number;
  tags: string[];
  title: string;
  updated_at: string;
  updated_by: number;
}

export interface ProjectContextResponse {
  knowledge_base_project_context_blocks: ProjectContextBlockModel[];
}

export interface ProjectContextBlock {
  id: string;
  title: string | null;
  content: string;
  path: string;
  projectId: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  updatedBy: number;
}
