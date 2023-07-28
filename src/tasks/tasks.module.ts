import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksGateway } from './tasks.gateway';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [],
  providers: [TasksService, TasksGateway, PrismaService],
})
export class TasksModule {}
