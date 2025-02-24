interface Mission {
  id: string;
  name: string;
  status: 'todo' | 'doing' | 'review' | 'done';
  createdAt: string;
  tasks: Task[];
}
