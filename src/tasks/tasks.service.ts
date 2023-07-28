import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as dateFns from 'date-fns';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async getTasks(projectId: string) {
    const tasks = await this.prisma.task.findMany({
      where: {
        projectId,
      },
      include: {
        userWhoCompletedTask: true,
      },
    });
    return tasks;
  }

  async createTask(task: CreateTaskDto) {
    console.log(task.deliveryDate);
    const parseDateToUTC = this.parseDateToUTC(task.deliveryDate);

    await this.prisma.task.create({
      data: {
        deliveryDate: parseDateToUTC,
        description: task.description,
        name: task.name,
        priority: task.priority,
        projectId: task.projectId,
      },
    });
  }
  async deleteTask(taskId: string) {
    await this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });
  }

  async updateTask(task: UpdateTaskDto) {
    await this.prisma.task.update({
      where: {
        id: task.taskId,
      },
      data: {
        deliveryDate: this.parseDateToUTC(task.dueDate),
        description: task.description,
        name: task.name,
        priority: task.priority,
      },
    });
  }

  async updateTaskState(taskId: string, newState: boolean, userId: string) {
    await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        state: newState,
        userWhoCompletedTaskId: userId,
      },
    });
  }

  parseDateToUTC(dueDate: string) {
    return dateFns.parse(dueDate, 'yyyy-MM-dd', new Date());
  }
}
