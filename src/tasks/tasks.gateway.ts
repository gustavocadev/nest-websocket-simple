import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TasksService } from './tasks.service';
import type { Task } from '@prisma/client';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { UpdateTaskStateDto } from './dtos/update-task-state.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/',
})
export class TasksGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly tasksService: TasksService) {}

  async handleConnection(client: Socket) {
    const projectId = client.handshake.query.projectId as string;
    console.log('connected', projectId);
    await this.emitCurrentTasks(projectId);
  }

  handleDisconnect(client: Socket) {
    console.log('disconnected');
  }

  async emitCurrentTasks(projectId: string) {
    this.server
      .to(projectId)
      .emit('get-tasks', await this.tasksService.getTasks(projectId));
  }

  // This is the way to listen to emit events from the client
  @SubscribeMessage('open-project')
  handleMessage(client: Socket, projectId: string) {
    client.join(projectId);
  }

  @SubscribeMessage('new-task')
  async handleNewTask(client: Socket, task: CreateTaskDto) {
    await this.tasksService.createTask(task);
    await this.emitCurrentTasks(task.projectId);
  }

  @SubscribeMessage('delete-task')
  async handleDeleteTask(client: Socket, task: Task) {
    console.log({ task });
    await this.tasksService.deleteTask(task.id);
    await this.emitCurrentTasks(task.projectId);
  }

  @SubscribeMessage('update-task')
  async handleUpdateTask(client: Socket, task: UpdateTaskDto) {
    console.log({ task });
    await this.tasksService.updateTask(task);
    await this.emitCurrentTasks(task.projectId);
  }

  @SubscribeMessage('update-task-state')
  async handleUpdateTaskState(client: Socket, payload: UpdateTaskStateDto) {
    const { task, taskState, userId } = payload;

    const newTaskState = JSON.parse(taskState);

    await this.tasksService.updateTaskState(task.id, newTaskState, userId);

    await this.emitCurrentTasks(task.projectId);
  }

  // to broadcast to all clients
}
