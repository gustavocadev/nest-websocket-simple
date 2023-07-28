import type { Task } from '@prisma/client';

export class UpdateTaskStateDto {
  taskState: string;
  task: Task;
  userId: string;
}
