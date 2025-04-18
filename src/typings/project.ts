export interface ProjectItem {
  id: number;
  project_code: string;
  label_en: string;
  label_ru: string;
  label_th: string;
}

export interface ProjectModel {
  id: number;
  project_code: string;
  label_en: string;
  label_ru: string;
  label_th: string;
}

export interface ProjectsResponse {
  projects: ProjectItem[];
}

export interface ProjectGridItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

export interface ProjectGridItems {
  [key: string]: ProjectGridItem[];
  default: ProjectGridItem[];
}

export interface Project {
  id: number;
  name: string;
  missions: Mission[];
}

export interface Mission {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface MissionModel {
  id: string;
  name: string;
  status: string;
  created_at: string;
  tasks: TaskModel[];
}

export interface TaskModel {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
} 