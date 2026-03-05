export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface Task {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: "Pendente",
  [TaskStatus.IN_PROGRESS]: "Em Progresso",
  [TaskStatus.COMPLETED]: "Concluída",
};

export interface PaginatedTasks {
  data: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
