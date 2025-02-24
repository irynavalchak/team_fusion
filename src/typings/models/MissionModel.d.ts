interface MissionModel {
  id: string;
  name: string;
  status: 'todo' | 'doing' | 'review' | 'done';
  created_at: string;
  tasks: TaskModel[];
}
